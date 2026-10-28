// Test public production APIs and real files without retaining media tickets.
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const ffmpeg = require("ffmpeg-static");
const base = "https://reelser.com";
const results = [];
async function jsonResponse(response) {
  try { return await response.json(); } catch { return { error: "Non-JSON response" }; }
}
async function extract(url, tab) {
  const response = await fetch(`${base}/api/extract`, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, ...(tab ? { tab } : {}) }), signal: AbortSignal.timeout(35000) });
  return { status: response.status, body: await jsonResponse(response) };
}
async function download(url, type, name, directory) {
  if (!url?.startsWith("/api/download?ticket=")) return { error: "No authorized download offered" };
  const started = performance.now();
  const response = await fetch(new URL(url, base), { signal: AbortSignal.timeout(65000) });
  const result = { status: response.status, operationId: response.headers.get("x-request-id") };
  if (!response.ok) result.error = (await jsonResponse(response)).error;
  else {
    const bytes = Buffer.from(await response.arrayBuffer());
    result.bytes = bytes.length;
    result.mime = response.headers.get("content-type");
    result.signature = type === "audio" ? bytes.toString("ascii", 0, 3) === "ID3" || bytes[0] === 255 && (bytes[1] & 224) === 224
      : type === "video" ? bytes.toString("ascii", 4, 8) === "ftyp"
      : bytes.subarray(0, 3).equals(Buffer.from([255,216,255])) || bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || bytes.toString("ascii", 0, 4) === "RIFF";
    const filename = path.join(directory, name);
    await fs.writeFile(filename, bytes);
    const decoded = spawnSync(ffmpeg, ["-v", "error", "-i", filename, ...(type === "image" ? ["-frames:v", "1"] : ["-t", "1"]), "-f", "null", "-"], { timeout: 15000, windowsHide: true });
    result.decoded = decoded.status === 0;
    await fs.unlink(filename);
  }
  result.elapsedMs = Math.round(performance.now() - started);
  return result;
}
async function check(name, action) {
  const row = { name, timestamp: new Date().toISOString() };
  try { Object.assign(row, await action()); } catch (error) { row.clientErrorType = error.name; row.networkCode = error.cause?.code; }
  results.push(row);
  console.log(JSON.stringify(row));
}
(async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "reelser-production-check-"));
  try {
    await check("mp3", async () => {
      const { status, body } = await extract("https://www.instagram.com/reel/DeTUk4sDSp-/");
      const format = body.data?.formats?.find(item => item.type === "audio");
      return { extractStatus: status, ...(body.error ? { error: body.error } : {}), download: await download(format?.downloadUrl, "audio", "audio.mp3", directory) };
    });
    await check("photo", async () => {
      const { status, body } = await extract("https://www.instagram.com/p/DeelvcCF53n/");
      const format = body.data?.formats?.find(item => item.type === "image");
      return { extractStatus: status, ...(body.error ? { error: body.error } : {}), download: await download(format?.downloadUrl, "image", "photo.jpg", directory) };
    });
    await check("carousel", async () => {
      const { status, body } = await extract("https://www.instagram.com/p/DeAYvsnn4la/");
      const formats = body.data?.formats?.filter(item => item.type === "image") ?? [];
      const downloads = [];
      for (let i = 0; i < formats.length; i++) downloads.push(await download(formats[i].downloadUrl, "image", `carousel-${i}.jpg`, directory));
      return { extractStatus: status, offered: formats.length, ...(body.error ? { error: body.error } : {}), downloads };
    });
    await check("profile-avatar", async () => {
      const { status, body } = await extract("@nasa", "profile");
      const profile = body.data?.profileData;
      return { extractStatus: status, ...(body.error ? { error: body.error } : {}), avatarOffered: Boolean(profile?.avatarDownloadUrl),
        download: await download(profile?.avatarDownloadUrl, "image", "avatar.jpg", directory) };
    });
    await check("stories", async () => {
      const { status, body } = await extract("@nasa", "story");
      const stories = body.data?.profileData?.stories ?? [];
      const downloads = [];
      for (let i = 0; i < stories.length; i++) downloads.push(await download(stories[i].downloadUrl, stories[i].type, `story-${i}.media`, directory));
      return { extractStatus: status, offered: stories.length, ...(body.error ? { error: body.error } : {}), downloads };
    });
    await check("invalid-url", async () => { const { status, body } = await extract("https://example.com/invalid"); return { status, error: body.error }; });
    await check("missing-ticket", async () => {
      const response = await fetch(`${base}/api/download?ticket=${"a".repeat(32)}`, { signal: AbortSignal.timeout(10000) });
      return { status: response.status, operationId: response.headers.get("x-request-id"), error: (await jsonResponse(response)).error };
    });
    await fs.writeFile(path.join(__dirname, "production-tools-results.json"), JSON.stringify(results, null, 2) + "\n");
  } finally { await fs.rmdir(directory); }
})().catch(() => { console.error("Production verification failed"); process.exitCode = 1; });
