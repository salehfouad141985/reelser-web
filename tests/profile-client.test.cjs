require("./register.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const { requestProfilePage, mergeProfileItems } = require("../lib/profileClient.ts");
const item = { id: "1", type: "image", thumbnail: "/icon.svg", downloadUrl: "/api/download?ticket=" + "x".repeat(32) };
test("client requests correct tab and continuation and forwards cancellation", async () => {
  const signal = new AbortController().signal;
  const page = await requestProfilePage("example", "reels", "next", signal, async (url, options) => {
    assert.equal(url, "/api/profile-media");
    assert.equal(options.signal, signal);
    assert.deepEqual(JSON.parse(options.body), { username: "example", section: "reels", cursor: "next" });
    return Response.json({ success: true, data: { items: [item], nextCursor: null } });
  });
  assert.equal(page.items.length, 1);
});
test("client rejects errors, raw external links and repeated cursor", async () => {
  for (const body of [{ success: false, error: "Busy" }, { success: true, data: { items: [{ ...item, downloadUrl: "https://example.com/file" }], nextCursor: null } }, { success: true, data: { items: [], nextCursor: "same" } }]) {
    await assert.rejects(requestProfilePage("example", "posts", "same", new AbortController().signal, async () => Response.json(body)));
  }
});
test("overlapping pages deduplicate IDs and refresh expired download tickets", () => {
  const updated = { ...item, downloadUrl: "/api/download?ticket=" + "y".repeat(32) };
  const merged = mergeProfileItems([item], [updated, { ...item, id: "2" }]);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].downloadUrl, updated.downloadUrl);
});
