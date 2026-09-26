require("./register.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { convertAudio } = require("../lib/convertAudio.ts");
test("real FFmpeg converts a local synthetic video to a nonempty MP3", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reelser-convert-test-"));
  process.env.REELSER_DATA_DIR = path.join(directory, "state");
  try {
    const input = path.join(directory, "fixture.mp4");
    const result = spawnSync(require("ffmpeg-static"), ["-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=black:s=64x64:d=0.3", "-f", "lavfi", "-i", "sine=frequency=440:duration=0.3", "-threads", "1", "-c:v", "mpeg4", "-c:a", "aac", "-shortest", input], { timeout: 10000, windowsHide: true });
    assert.equal(result.status, 0, String(result.stderr));
    const mp3 = await convertAudio(fs.readFileSync(input), AbortSignal.timeout(10000));
    assert.ok(mp3.length > 1000);
    assert.equal(mp3.toString("ascii", 0, 3), "ID3");
    await assert.rejects(() => convertAudio(Buffer.from("not a video"), AbortSignal.timeout(10000)), error => error.status === 502);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
