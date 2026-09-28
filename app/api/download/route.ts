import { NextRequest } from "next/server";
import { recordDownloadStat } from "@/lib/adminStore";
import { acquireLease, errorResponse, RequestError, servicePolicy } from "@/lib/requestPolicy";
import { readTicket } from "@/lib/mediaTickets";
import { fetchMedia, mediaKind } from "@/lib/safeMedia";
import { convertAudio } from "@/lib/convertAudio";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  let release: (() => void) | undefined;
  try {
    servicePolicy(req, "download");
    const ticket = readTicket(req.nextUrl.searchParams.get("ticket"), "download");
    release = acquireLease("download", 4);
    const signal = AbortSignal.any([req.signal, AbortSignal.timeout(60_000)]);
    let bytes = await fetchMedia(ticket.url, AbortSignal.any([signal, AbortSignal.timeout(20_000)]));
    const kind = mediaKind(bytes);
    let mime: string = kind.mime;
    let ext: string = kind.ext;
    let type: "audio" | "video" | "image" = kind.type;
    if (ticket.audio) {
      if (kind.type !== "video") throw new RequestError("Audio source is not a video", 415);
      bytes = await convertAudio(bytes, signal);
      mime = "audio/mpeg"; ext = "mp3"; type = "audio";
    }
    signal.throwIfAborted();
    // Counts fully prepared files, not confirmation that the browser saved them.
    recordDownloadStat(type);
    return new Response(new Uint8Array(bytes), { headers: {
      "Content-Type": mime, "Content-Length": String(bytes.length),
      "Content-Disposition": `attachment; filename="reelser-media.${ext}"`,
      "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "private, no-store",
    } });
  } catch (error) {
    console.warn("Media download failed", error instanceof RequestError
      ? { status: error.status, reason: error.message }
      : { name: error instanceof Error ? error.name : "unknown", code: (error as NodeJS.ErrnoException)?.code || "unknown" });
    return errorResponse(error);
  }
  finally { release?.(); }
}
