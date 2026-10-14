// Exercise the locally built API; never print or persist signed media tickets.
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const ffmpeg = require("ffmpeg-static");
const base = "http://127.0.0.1:3100";
const inputs = [
  ["DeTUk4sDSp-", "https://www.instagram.com/nasa/reel/DeTUk4sDSp-/"],
  ["DUa5b_BDmmD", "https://www.instagram.com/reel/DUa5b_BDmmD/"],
];
(async () => {
  const results = [];
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "reelser-download-check-"));
  try {
    for (const [clip, url] of inputs) {
      const row = { clip, url, timestamp: new Date().toISOString() };
      try {
        const extracted = await fetch(`${base}/api/extract`, { method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }), signal: AbortSignal.timeout(35000) });
        row.extractStatus = extracted.status;
        const body = await extracted.json();
        if (!extracted.ok) row.error = body.error;
        else {
          const format = body.data?.formats?.find(item => item.type === "video");
          row.videoOffered = Boolean(format);
          if (format) {
            const started = performance.now();
            const download = await fetch(new URL(format.downloadUrl, base), { signal: AbortSignal.timeout(65000) });
            row.downloadStatus = download.status;
            row.operationId = download.headers.get("x-request-id");
            if (!download.ok) row.error = (await download.json()).error;
            else {
              const bytes = Buffer.from(await download.arrayBuffer());
              row.bytes = bytes.length;
              row.mime = download.headers.get("content-type");
              row.mp4Signature = bytes.toString("ascii", 4, 8) === "ftyp";
              const filename = path.join(directory, `${clip}.mp4`);
              await fs.writeFile(filename, bytes);
              const decoded = spawnSync(ffmpeg, ["-v", "error", "-i", filename, "-t", "1", "-f", "null", "-"], { timeout: 15000, windowsHide: true });
              row.firstSecondDecoded = decoded.status === 0;
              await fs.unlink(filename);
            }
            row.downloadElapsedMs = Math.round(performance.now() - started);
          }
        }
      } catch (error) { row.clientErrorType = error.name; }
      results.push(row);
      console.log(JSON.stringify(row));
    }
    await fs.writeFile(path.join(__dirname, "local-download-results.json"), JSON.stringify(results, null, 2) + "\n");
  } finally { await fs.rmdir(directory); }
})().catch(() => { console.error("Local verification failed"); process.exitCode = 1; });
