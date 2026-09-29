import crypto from "node:crypto";
import { isIP } from "node:net";
import { transaction } from "./storage";
import { getAdminSettings } from "./adminStore";

export class RequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function clientKey(request: Request) {
  // Only configure this when the front proxy overwrites this header and the
  // application cannot be accessed without that proxy. Default: shared quota.
  const header = process.env.REELSER_TRUSTED_IP_HEADER;
  const value = header ? request.headers.get(header)?.trim() : null;
  return value && isIP(value) ? value : "shared";
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
  const visitorLimit = kind === "download" ? settings.max_downloads_per_ip_hour : kind === "extract" ? 30 : 600;
  // Without a verified visitor IP, every visitor shares one bucket. Keep a
  // separate, higher site-wide ceiling so normal traffic cannot exhaust an
  // individual visitor's allowance for everybody else.
  const limit = client === "shared" ? Math.max(visitorLimit, kind === "proxy" ? 6000 : 600) : visitorLimit;
  rateLimit(`${kind}:${client}`, limit);
}
export function acquireLease(kind: "extract" | "download" | "convert", limit: number) {
  const id = crypto.randomUUID();
  transaction<Record<string, number>, void>(`leases-${kind}`, () => ({}), data => {
    for (const [key, exp] of Object.entries(data)) if (exp < Date.now()) delete data[key];
    if (Object.keys(data).length >= limit) throw new RequestError("Service busy. Try again shortly.", 429);
    data[id] = Date.now() + 120_000;
  });
  return () => transaction<Record<string, number>, void>(`leases-${kind}`, () => ({}), data => { delete data[id]; });
}
export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new RequestError("Invalid origin", 403);
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
