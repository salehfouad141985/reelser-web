import { NextRequest } from "next/server";
import { recordDownloadStat } from "@/lib/adminStore";
import { acquireLease, DOWNLOAD_CONCURRENCY, errorResponse, RequestError, servicePolicy } from "@/lib/requestPolicy";
import { readTicket } from "@/lib/mediaTickets";
import { fetchMedia, mediaKind } from "@/lib/safeMedia";
import { convertAudio } from "@/lib/convertAudio";
import { downloadAttempt, type DownloadStage } from "@/lib/downloadDiagnostics";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(req: NextRequest) {
  let release: (() => Promise<void>) | undefined;
  const attempt = downloadAttempt();
  const attemptTime = new Date().toISOString();
  let stage: DownloadStage = "policy";
  let signal: AbortSignal = req.signal;
  let type: "audio" | "video" | "image" = "video";
  try {
    await servicePolicy(req, "download");
    stage = "ticket";
    const ticket = await readTicket(req.nextUrl.searchParams.get("ticket"), "download");
    if (ticket.audio) type = "audio";
    stage = "lease";
    release = await acquireLease("download", DOWNLOAD_CONCURRENCY);
    const operationSignal = AbortSignal.any([req.signal, AbortSignal.timeout(60_000)]);
    signal = AbortSignal.any([operationSignal, AbortSignal.timeout(20_000)]);
    stage = "fetch";
    let bytes = await fetchMedia(ticket.url, signal);
    signal = operationSignal;
    stage = "content";
    const kind = mediaKind(bytes);
    let mime: string = kind.mime;
    let ext: string = kind.ext;
    type = kind.type;
    if (ticket.audio) {
      if (kind.type !== "video") throw new RequestError("Audio source is not a video", 415);
      stage = "convert";
      bytes = await convertAudio(bytes, signal);
      mime = "audio/mpeg";
      ext = "mp3";
      type = "audio";
    }
    signal.throwIfAborted();
    // Counts fully prepared files, not confirmation that the browser saved them.
    stage = "statistics";
    await recordDownloadStat(type, true, attemptTime);
    stage = "response";
    return new Response(new Uint8Array(bytes), {
      headers: {
        "X-Request-Id": attempt.operationId,
        "Content-Type": mime,
        "Content-Length": String(bytes.length),
        "Content-Disposition": `attachment; filename="reelser-media.${ext}"`,
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    await recordDownloadStat(type, false, attemptTime);
    const failure = signal.aborted
      ? new RequestError(
          signal.reason instanceof Error && signal.reason.name === "TimeoutError"
            ? "Download timed out. Try again."
            : "Download cancelled.",
          signal.reason instanceof Error && signal.reason.name === "TimeoutError" ? 504 : 499
        )
      : error;
    const response = errorResponse(failure);
    attempt.failure(stage, error, signal, response.status);
    response.headers.set("X-Request-Id", attempt.operationId);
    return response;
  } finally {
    await release?.();
  }
}
