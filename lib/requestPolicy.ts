import crypto from "node:crypto";
import { isIP } from "node:net";
import { transaction } from "./storage";
import { getAdminSettings } from "./adminStore";

export class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function clientKey(request: Request) {
  const header = process.env.REELSER_TRUSTED_IP_HEADER;
  let candidate = header ? request.headers.get(header)?.trim() : null;

  if (!candidate) {
    // Automatically inspect standard proxy / CDN headers (Hostinger hcdn, Cloudflare, Nginx)
    candidate = request.headers.get("cf-connecting-ip")?.trim()
      || request.headers.get("x-real-ip")?.trim()
      || request.headers.get("x-forwarded-for")?.trim()
      || null;
  }

  if (candidate) {
    // If x-forwarded-for contains multiple comma-separated IPs ("client_ip, proxy_ip"), extract the first one
    const firstIp = candidate.split(",")[0].trim();
    if (isIP(firstIp)) return firstIp;
  }

  return "shared";
}
export function rateLimit(key: string, limit: number, windowMs = 3600_000) {
  return transaction<Record<string, { count: number; expires: number }>, void>("rate-limits", () => ({}), data => {
    const now = Date.now();
    for (const [id, value] of Object.entries(data)) if (value.expires <= now) delete data[id];
    const id = crypto.createHash("sha256").update(key).digest("hex");
    const entry = data[id] ?? { count: 0, expires: now + windowMs };
    if (entry.count >= limit || Object.keys(data).length > 10000) throw new RequestError("Too many requests. Try again later.", 429);
    entry.count++;
    data[id] = entry;
  });
}
export function servicePolicy(request: Request, kind: "extract" | "download" | "proxy") {
  const settings = getAdminSettings();
  if (settings.maintenance_mode) throw new RequestError("Service temporarily unavailable for maintenance.", 503);
  const client = clientKey(request);
  const baseDownloadLimit = settings.max_downloads_per_ip_hour || 60;
  // Generous extract allowance (at least 150 per IP per hour) since extraction is the primary user flow
  const visitorLimit = kind === "download" ? baseDownloadLimit : kind === "extract" ? Math.max(150, baseDownloadLimit * 2) : 1200;
  // Without a verified visitor IP, keep a high ceiling so one visitor or bot cannot exhaust the site for everybody else
  const limit = client === "shared" ? Math.max(visitorLimit, kind === "proxy" ? 15000 : 3000) : visitorLimit;
  rateLimit(`${kind}:${client}`, limit);
}
export function acquireLease(kind: "extract" | "download" | "convert", limit: number) {
  const id = crypto.randomUUID();
  transaction<Record<string, number>, void>(`leases-${kind}`, () => ({}), data => {
    for (const [key, exp] of Object.entries(data)) if (exp < Date.now()) delete data[key];
    if (Object.keys(data).length >= limit) throw new RequestError("Service busy. Try again shortly.", 429);
    data[id] = Date.now() + 30_000;
  });
  return () => transaction<Record<string, number>, void>(`leases-${kind}`, () => ({}), data => { delete data[id]; });
}
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  let originHost: string;
  try {
    originHost = new URL(origin).host.toLowerCase();
  } catch {
    throw new RequestError("Invalid origin", 403);
  }
  // Behind Hostinger / reverse-proxy TLS termination the internal request.url
  // is http:// while the browser sends Origin: https:// — hosts match but
  // origins differ. Compare hosts, respecting X-Forwarded-* when present.
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim().toLowerCase();
  const hostHeader = request.headers.get("host")?.split(",")[0]?.trim().toLowerCase();
  const urlHost = new URL(request.url).host.toLowerCase();
  const expectedHost = forwardedHost || hostHeader || urlHost;
  if (originHost !== expectedHost && originHost !== urlHost) {
    throw new RequestError("Invalid origin", 403);
  }
}
export async function readJson(request: Request, maxBytes = 32768) {
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError("Missing request body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; void reader.cancel().catch(() => {}); }, 10000);
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (timedOut) throw new RequestError("Request body timed out", 408);
      if (done) break;
      size += value.length;
      if (size > maxBytes) { await reader.cancel(); throw new RequestError("Request too large", 413); }
      chunks.push(value);
    }
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error();
    return data as Record<string, unknown>;
  } catch (error) {
    if (error instanceof RequestError) throw error;
    throw new RequestError("Invalid JSON body");
  } finally { clearTimeout(timer); reader.releaseLock(); }
}
export function errorResponse(error: unknown) {
  const status = error instanceof RequestError ? error.status : error instanceof Error && error.name === "TimeoutError" ? 504 : error instanceof Error && error.name === "AbortError" ? 499 : 503;
  return Response.json({ success: false, error: error instanceof RequestError ? error.message : "Service temporarily unavailable" }, {
    status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "60" } : {}) },
  });
}
