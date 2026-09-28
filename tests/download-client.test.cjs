require("./register.cjs");
const { test, afterEach, mock } = require("node:test");
const assert = require("node:assert/strict");
const { saveMedia } = require("../lib/downloadClient.ts");

afterEach(() => mock.restoreAll());

test("does not save a proxy error page returned with HTTP 200", async () => {
  mock.method(globalThis, "fetch", async () => new Response("<html>Error</html>", {
    headers: { "Content-Type": "text/html" },
  }));
  await assert.rejects(saveMedia("/api/download?ticket=test", "photo"), /Download failed/);
});

test("HTML gateway errors and network failures have a readable retry message", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => new Response("Bad gateway", { status: 502 }));
  await assert.rejects(saveMedia("/api/download?ticket=test", "photo"), /Download failed\. Try again\./);
  fetch.mock.mockImplementation(async () => { throw new DOMException("aborted", "TimeoutError"); });
  await assert.rejects(saveMedia("/api/download?ticket=test", "photo"), /Download failed\. Try again\./);
});

test("expired links preserve the server's recovery instruction", async () => {
  mock.method(globalThis, "fetch", async () => Response.json({ error: "Media link expired. Extract the link again." }, { status: 403 }));
  await assert.rejects(saveMedia("/api/download?ticket=test", "photo"), /Extract the link again/);
});

test("interrupted media bodies and empty files cannot report a successful download", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => ({
    ok: true, blob: async () => { throw new TypeError("connection interrupted"); },
  }));
  await assert.rejects(saveMedia("/api/download?ticket=test", "photo"), /Download failed/);
  fetch.mock.mockImplementation(async () => new Response(null));
  await assert.rejects(saveMedia("/api/download?ticket=test", "photo"), /Download failed/);
});

test("valid media is saved with its actual extension and temporary URL is released", async () => {
  const previous = globalThis.document;
  const link = { click: mock.fn(), remove: mock.fn() };
  globalThis.document = { createElement: () => link, body: { appendChild: mock.fn() } };
  try {
    mock.method(globalThis, "fetch", async () => new Response(new Uint8Array([255, 216, 255]), { headers: { "Content-Type": "image/jpeg; charset=binary" } }));
    mock.method(URL, "createObjectURL", () => "blob:test");
    const revoke = mock.method(URL, "revokeObjectURL", () => {});
    const timer = mock.method(globalThis, "setTimeout", callback => { callback(); return 1; });
    await saveMedia("/api/download?ticket=test", "picture.png");
    assert.equal(link.download, "picture.jpg");
    assert.equal(link.click.mock.callCount(), 1);
    assert.equal(link.remove.mock.callCount(), 1);
    assert.equal(revoke.mock.calls[0].arguments[0], "blob:test");
    assert.equal(timer.mock.callCount(), 1);
  } finally {
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
