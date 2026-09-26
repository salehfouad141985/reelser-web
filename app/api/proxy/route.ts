import { NextRequest } from "next/server";
import { acquireLease, errorResponse, RequestError, servicePolicy } from "@/lib/requestPolicy";
import { readTicket } from "@/lib/mediaTickets";
import { fetchMedia, mediaKind } from "@/lib/safeMedia";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  let release: (() => void) | undefined;
  try {
    servicePolicy(req, "proxy");
    const ticket = readTicket(req.nextUrl.searchParams.get("ticket"), "preview");
    release = acquireLease("download", 4);
    const bytes = await fetchMedia(ticket.url, AbortSignal.any([req.signal, AbortSignal.timeout(10_000)]), 8 * 1024 * 1024);
    const kind = mediaKind(bytes);
    if (kind.type !== "image") throw new RequestError("Unsupported image", 415);
    return new Response(new Uint8Array(bytes), { headers: {
      "Content-Type": kind.mime, "Content-Length": String(bytes.length),
      "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "private, max-age=300", "Cross-Origin-Resource-Policy": "same-origin",
    } });
  } catch (error) { return errorResponse(error); }
  finally { release?.(); }
}
