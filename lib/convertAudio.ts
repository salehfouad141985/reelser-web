import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import ffmpegPath from "ffmpeg-static";
import { acquireLease, RequestError } from "./requestPolicy";
export async function convertAudio(input: Buffer, signal: AbortSignal): Promise<Buffer> {
  const release = acquireLease("convert", 2);
  let directory: string | undefined;
  try {
    signal.throwIfAborted();
    directory = await mkdtemp(path.join(os.tmpdir(), "reelser-audio-"));
    const file = path.join(directory, "input.mp4");
    await writeFile(file, input, { signal, mode: 0o600 });
    return await new Promise<Buffer>((resolve, reject) => {
      const limit = 24 * 1024 * 1024;
      const process = spawn(ffmpegPath || "ffmpeg", [
        "-nostdin", "-hide_banner", "-loglevel", "error", "-protocol_whitelist", "file,pipe",
        "-f", "mov", "-enable_drefs", "0", "-i", file,
        "-threads", "1", "-vn", "-acodec", "libmp3lame", "-b:a", "192k", "-fs", String(limit), "-f", "mp3", "pipe:1",
      ], { stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
      const chunks: Buffer[] = [];
      let size = 0;
      let failure: Error | undefined;
      const stop = (error: Error) => { failure ??= error; process.kill("SIGKILL"); };
      const abort = () => stop(new RequestError("Conversion cancelled", 499));
      signal.addEventListener("abort", abort, { once: true });
      if (signal.aborted) abort();
      const timer = setTimeout(() => stop(new RequestError("Conversion timed out", 504)), 35_000);
      process.stderr.resume();
      process.stdout.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size >= limit) stop(new RequestError("Audio exceeds size limit", 413));
        else chunks.push(chunk);
      });
      process.stdout.on("error", error => stop(error));
      process.on("error", error => { failure = error; });
      process.once("close", code => {
        clearTimeout(timer);
        signal.removeEventListener("abort", abort);
        if (failure) reject(failure);
        else if (code !== 0 || !size) reject(new RequestError("Audio conversion failed", 502));
        else resolve(Buffer.concat(chunks));
      });
    });
  } finally {
    try { if (directory) await rm(directory, { recursive: true, force: true }); }
    finally { release(); }
  }
}
