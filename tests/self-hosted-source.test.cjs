require("./register.cjs");
const { test, mock, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reelser-source-tests-"));
process.env.REELSER_DATA_DIR = directory;
process.env.REELSER_PROFILE_SOURCE = "selfHosted";
process.env.REELSER_SOURCE_URL = "http://127.0.0.1:8010";
process.env.REELSER_SOURCE_TOKEN = "source-test-".repeat(4);
after(() => { mock.restoreAll(); fs.rmSync(directory, { recursive: true, force: true }); });
const source = require("../lib/selfHostedSource.ts");
const { POST: pageRoute } = require("../app/api/profile-media/route.ts");
const { POST: extractRoute } = require("../app/api/extract/route.ts");
const { NextRequest } = require("next/server");
const item = { id: "123", type: "video", thumbnail: "https://cdninstagram.com/a.jpg", downloadUrl: "https://cdninstagram.com/a.mp4" };
const metadata = { username: "example", fullName: "Example", avatarUrl: "", hdAvatarUrl: "", postsCount: "90", followersCount: "200", followingCount: "10", biography: "" };
const request = body => new NextRequest("https://reelser.com/api/profile-media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("initial extraction requests independent reels and retains cursor", async () => {
  const calls = [];
  const fetch = mock.method(globalThis, "fetch", async (url, options) => {
    calls.push(JSON.parse(options.body));
    assert.equal(new URL(url).pathname, "/v1/profile");
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Authorization, `Bearer ${process.env.REELSER_SOURCE_TOKEN}`);
    return Response.json(calls.at(-1).section === "profile" ? { profile: metadata } : { items: [item], nextCursor: "signed-next" });
  });
  try {
    const data = await source.extractSelfHostedProfile("example", "reels", new AbortController().signal);
    assert.deepEqual(calls.map(call => call.section), ["profile", "reels"]);
    assert.equal(data.profileData.reels.length, 1);
    assert.equal(data.profileData.posts.length, 0);
    assert.deepEqual(data.profileData.pagination.reels, { loaded: true, cursor: "signed-next" });
    assert.equal(data.profileData.pagination.posts.loaded, false);
  } finally { fetch.mock.restore(); }
});

test("pagination routes only expose media tickets and pass through cursor", async () => {
  const fetch = mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(JSON.parse(options.body).cursor, "signed-next");
    return Response.json({ items: [item], nextCursor: null });
  });
  try {
    const response = await pageRoute(request({ username: "example", section: "reels", cursor: "signed-next" }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.match(body.data.items[0].downloadUrl, /^\/api\/download\?ticket=/);
    assert.match(body.data.items[0].thumbnail, /^\/api\/proxy\?ticket=/);
    assert.equal(body.data.nextCursor, null);
    assert.doesNotMatch(JSON.stringify(body), /source-test-|cdninstagram/);
  } finally { fetch.mock.restore(); }
});

test("a genuinely empty section succeeds and leaves other tabs available", async () => {
  const fetch = mock.method(globalThis, "fetch", async (_url, options) => Response.json(JSON.parse(options.body).section === "profile"
    ? { profile: metadata } : { items: [], nextCursor: null }));
  try {
    const response = await extractRoute(request({ url: "@example", tab: "story" }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.profileData.initialSection, "stories");
    assert.equal(body.data.profileData.pagination.posts.loaded, false);
  } finally { fetch.mock.restore(); }
});

test("errors, unsupported media and repeated cursors never become an empty success", async () => {
  for (const response of [new Response("SECRET", { status: 503 }), Response.json({ items: [{ ...item, downloadUrl: "https://127.0.0.1/x" }], nextCursor: null }), Response.json({ items: [], nextCursor: "repeat" }), Response.json({ items: [], nextCursor: 123 })]) {
    const fetch = mock.method(globalThis, "fetch", async () => response);
    try {
      await assert.rejects(source.getSourcePage("example", "reels", new AbortController().signal, "repeat"), error => !error.message.includes("SECRET"));
    } finally { fetch.mock.restore(); }
  }
});

test("rejects bad queries and unsafe service configuration before sending token", async () => {
  for (const args of [["../x", "posts", null], ["example", "bad", null], ["example", "stories", "cursor"]]) assert.throws(() => source.validateProfileQuery(...args));
  const original = process.env.REELSER_SOURCE_URL;
  process.env.REELSER_SOURCE_URL = "http://external.example.com";
  const fetch = mock.method(globalThis, "fetch", () => { throw new Error("should never send token"); });
  try {
    await assert.rejects(source.getSourcePage("example", "posts", new AbortController().signal));
    assert.equal(fetch.mock.calls.length, 0);
  } finally { fetch.mock.restore(); process.env.REELSER_SOURCE_URL = original; }
});
