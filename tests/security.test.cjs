require("./register.cjs");
const { test, after, mock } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reelser-tests-"));
process.env.REELSER_DATA_DIR = directory;
process.env.ADMIN_JWT_SECRET = "test-only-key-".repeat(4);
process.env.REELSER_ADMIN_PASS = "test-only-password-long";
after(() => { mock.restoreAll(); fs.rmSync(directory, { recursive: true, force: true }); });
const admin = require("../lib/adminStore.ts");
const policy = require("../lib/requestPolicy.ts");
const media = require("../lib/safeMedia.ts");
const tickets = require("../lib/mediaTickets.ts");
const extractor = require("../lib/instagramExtractor.ts");
const { NextRequest } = require("next/server");

test("administration fails closed without a strong secret and rejects old defaults", () => {
  const previous = process.env.ADMIN_JWT_SECRET;
  delete process.env.ADMIN_JWT_SECRET;
  assert.throws(() => admin.verifyAdminCredentials("admin", "anything"));
  process.env.ADMIN_JWT_SECRET = previous;
  assert.equal(admin.verifyAdminCredentials("admin", "Admin@Reelser2026!"), false);
  assert.equal(admin.verifyAdminCredentials("admin", process.env.REELSER_ADMIN_PASS), true);
});
test("sessions expire and revoke on logout, password change and secret rotation", () => {
  const token = admin.createAdminToken();
  assert.equal(admin.verifyAdminToken(token), true);
  admin.revokeAdminToken(token);
  assert.equal(admin.verifyAdminToken(token), false);
  const second = admin.createAdminToken();
  assert.equal(admin.updateAdminPassword("a-new-long-test-password"), true);
  assert.equal(admin.verifyAdminToken(second), false);
  const third = admin.createAdminToken();
  const key = process.env.ADMIN_JWT_SECRET;
  process.env.ADMIN_JWT_SECRET = "rotated-".repeat(8);
  assert.equal(admin.verifyAdminToken(third), false);
  process.env.ADMIN_JWT_SECRET = key;
  const file = path.join(directory, "admin-config.json");
  const data = JSON.parse(fs.readFileSync(file));
  for (const id in data.sessions) data.sessions[id] = 0;
  fs.writeFileSync(file, JSON.stringify(data));
  assert.equal(admin.verifyAdminToken(third), false);
  assert.equal(admin.verifyAdminToken("eyJhbGciOiJIUzI1NiJ9.e30.invalid"), false);
});
test("corrupt storage is not reset and write failures propagate", () => {
  const file = path.join(directory, "admin-config.json");
  const original = fs.readFileSync(file);
  fs.writeFileSync(file, "invalid-json");
  assert.throws(() => admin.getAdminSettings());
  assert.equal(fs.readFileSync(file, "utf8"), "invalid-json");
  fs.writeFileSync(file, original);
  const failure = mock.method(fs, "renameSync", () => { throw new Error("disk failure"); });
  assert.throws(() => admin.updateAdminPassword("cannot-be-saved-password"), /disk failure/);
  failure.mock.restore();
  assert.equal(admin.verifyAdminCredentials("admin", "a-new-long-test-password"), true);
});
test("SSRF policy rejects local IPs, lookalike hosts, credentials and unsafe protocols", () => {
  for (const url of ["http://127.0.0.1/", "https://169.254.169.254/", "https://cdninstagram.com.evil.test/", "file:///etc/passwd", "https://user:pass@cdninstagram.com/", "https://cdninstagram.com:444/", "https://[::1]/"]) assert.throws(() => media.validateMediaUrl(url));
  assert.equal(media.validateMediaUrl("https://scontent.cdninstagram.com/image.jpg").hostname, "scontent.cdninstagram.com");
  for (const ip of ["127.0.0.1", "10.0.0.1", "172.16.0.1", "192.168.1.1", "169.254.169.254", "100.64.0.1", "::1", "::ffff:127.0.0.1", "fc00::1", "fe80::1", "2001:db8::1", "2002:c0a8:101::1", "2001:0::1"]) assert.equal(media.publicAddress(ip), false);
  assert.equal(media.publicAddress("8.8.8.8"), true);
  assert.equal(media.publicAddress("2606:4700:4700::1111"), true);
});
test("SnapSave CDN media receives tickets only from its exact verified host", () => {
  const source = "https://d.rapidcdn.app/photo.jpg";
  assert.equal(media.validateMediaUrl(source).hostname, "d.rapidcdn.app");
  for (const url of ["https://rapidcdn.app/photo.jpg", "https://other.rapidcdn.app/photo.jpg", "https://d.rapidcdn.app.evil.test/photo.jpg"]) {
    assert.throws(() => media.validateMediaUrl(url));
  }
  const item = { id: "post-1", type: "image", thumbnail: source, downloadUrl: source };
  const result = tickets.authorizeMedia({
    url: "https://instagram.com/example/", title: "Example", author: "Example", platform: "Instagram",
    thumbnail: source, formats: [{ formatId: "1", ext: "jpg", type: "image", quality: "Photo", downloadUrl: source }],
    profileData: { username: "example", fullName: "Example", avatarUrl: "", hdAvatarUrl: "", postsCount: "1", followersCount: "0", followingCount: "0", biography: "", posts: [item], stories: [], reels: [], highlights: [] },
  });
  assert.equal(result.formats.length, 1);
  assert.equal(result.profileData.posts.length, 1);
  assert.match(result.profileData.posts[0].downloadUrl, /^\/api\/download\?ticket=/);
  assert.match(result.profileData.posts[0].thumbnail, /^\/api\/proxy\?ticket=/);
});
test("HTML and SVG are never accepted as media even with an image MIME type", () => {
  assert.throws(() => media.mediaKind(Buffer.from("<html><script>alert(1)</script>")));
  assert.throws(() => media.mediaKind(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')));
  assert.equal(media.mediaKind(Buffer.from([255,216,255,224])).mime, "image/jpeg");
});
test("tickets are scoped and arbitrary source URLs cannot be downloaded", async () => {
  const raw = { url: "https://instagram.com/p/test", title: "test", author: "test", platform: "Instagram", thumbnail: "https://cdninstagram.com/photo.jpg", formats: [{ formatId: "1", ext: "jpg", quality: "original", type: "image", downloadUrl: "https://cdninstagram.com/photo.jpg" }] };
  const result = tickets.authorizeMedia(raw);
  const id = new URL(result.formats[0].downloadUrl, "http://localhost").searchParams.get("ticket");
  assert.equal(tickets.readTicket(id, "download").url, raw.formats[0].downloadUrl);
  assert.throws(() => tickets.readTicket(id, "preview"));
  const { GET } = require("../app/api/download/route.ts");
  const response = await GET(new NextRequest("http://localhost/api/download?url=https://127.0.0.1/private"));
  assert.equal(response.status, 403);
});
test("rate limits, concurrency limits and maintenance are enforced", () => {
  policy.rateLimit("test", 1);
  assert.throws(() => policy.rateLimit("test", 1), error => error.status === 429);
  const release = policy.acquireLease("convert", 1);
  assert.throws(() => policy.acquireLease("convert", 1), error => error.status === 429);
  release(); policy.acquireLease("convert", 1)();
  admin.updateAdminSettings({ maintenance_mode: true });
  assert.throws(() => policy.servicePolicy(new Request("https://reelser.com"), "extract"), error => error.status === 503);
  admin.updateAdminSettings({ maintenance_mode: false, max_downloads_per_ip_hour: 1 });
  assert.throws(() => policy.servicePolicy(new Request("https://reelser.com"), "download"), error => error.status === 429);
  admin.updateAdminSettings({ max_downloads_per_ip_hour: 60 });
});
test("failed extraction does not fabricate original media", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  assert.equal(await extractor.extractInstagramMedia("@example"), null);
  assert.equal(extractor.createFallbackProfileResult("example").formats.length, 0);
  fetch.mock.restore();
  for (const url of ["https://evil.test/instagram.com/p/abc", "https://evil.test/instagram.com/example", "https://instagram.com.evil.test/p/abc"]) assert.equal(extractor.isValidInstagramUrl(url), false);
});
test("invalid JSON and cross-origin admin requests fail safely", async () => {
  await assert.rejects(() => policy.readJson(new Request("https://reelser.com", { method: "POST", body: "null" })));
  assert.throws(() => policy.assertSameOrigin(new Request("https://reelser.com", { headers: { origin: "https://evil.test" } })), error => error.status === 403);
});

test("network connections reject private DNS answers and revalidate redirects", async () => {
  const https = require("node:https");
  const dns = require("node:dns");
  const { EventEmitter } = require("node:events");
  const { Readable } = require("node:stream");
  let ip = "127.0.0.1", connections = 0;
  const dnsMock = mock.method(dns, "lookup", (_host, _options, callback) => callback(null, [{ address: ip, family: 4 }]));
  const requestMock = mock.method(https, "get", (_url, options, callback) => {
    const request = new EventEmitter();
    queueMicrotask(() => options.lookup("cdninstagram.com", { all: true }, (error) => {
      if (error) return request.emit("error", error);
      connections++;
      const response = Readable.from([]);
      response.statusCode = 302;
      response.headers = { location: "http://127.0.0.1/private" };
      callback(response);
    }));
    return request;
  });
  await assert.rejects(() => media.fetchMedia("https://cdninstagram.com/a", AbortSignal.timeout(1000)), /Blocked network/);
  assert.equal(connections, 0);
  ip = "8.8.8.8";
  await assert.rejects(() => media.fetchMedia("https://cdninstagram.com/a", AbortSignal.timeout(1000)), /Unsupported media/);
  assert.equal(connections, 1);
  dnsMock.mock.restore(); requestMock.mock.restore();
});

test("media connection tries only public IPv4 and IPv6 DNS answers", async () => {
  const https = require("node:https");
  const dns = require("node:dns");
  const { EventEmitter } = require("node:events");
  const { Readable } = require("node:stream");
  const dnsMock = mock.method(dns, "lookup", (_host, options, callback) => {
    assert.equal(options.family, 0);
    callback(null, [
      { address: "127.0.0.1", family: 4 },
      { address: "2606:4700:4700::1111", family: 6 },
      { address: "8.8.8.8", family: 4 },
    ]);
  });
  const requestMock = mock.method(https, "get", (_url, options, callback) => {
    assert.equal(options.autoSelectFamily, true);
    const request = new EventEmitter();
    queueMicrotask(() => options.lookup("cdninstagram.com", { all: true }, (error, addresses) => {
      assert.ifError(error);
      assert.deepEqual(addresses, [
        { address: "2606:4700:4700::1111", family: 6 },
        { address: "8.8.8.8", family: 4 },
      ]);
      const response = Readable.from([Buffer.from([255, 216, 255])]);
      response.statusCode = 200; response.headers = {};
      callback(response);
    }));
    return request;
  });
  try { assert.equal((await media.fetchMedia("https://cdninstagram.com/a", AbortSignal.timeout(1000))).length, 3); }
  finally { dnsMock.mock.restore(); requestMock.mock.restore(); }
});

test("HTML image responses are rejected by the proxy route", async () => {
  const result = tickets.authorizeMedia({ url: "test", title: "test", author: "test", platform: "Instagram", formats: [], thumbnail: "https://cdninstagram.com/a" });
  const fetch = mock.method(media, "fetchMedia", async () => Buffer.from("<html>active content</html>"));
  const { GET } = require("../app/api/proxy/route.ts");
  const response = await GET(new NextRequest("http://localhost" + result.thumbnail));
  assert.equal(response.status, 415);
  fetch.mock.restore();
});

test("FFmpeg failures return an error and do not count as a download", async () => {
  const child = require("node:child_process");
  const { EventEmitter } = require("node:events");
  const { PassThrough } = require("node:stream");
  let drained = false;
  const spawn = mock.method(child, "spawn", (_binary, args) => {
    assert.ok(args.includes("-protocol_whitelist"));
    assert.ok(!args.some(arg => arg.startsWith("https://")));
    const process = new EventEmitter();
    process.stdout = new PassThrough(); process.stderr = new PassThrough();
    process.stderr.on("resume", () => { drained = true; });
    process.kill = () => true;
    setImmediate(() => { process.stdout.end(); process.stderr.end("invalid input"); process.emit("close", 1); });
    return process;
  });
  const fetch = mock.method(media, "fetchMedia", async () => Buffer.from([0,0,0,24,102,116,121,112,105,115,111,109]));
  const result = tickets.authorizeMedia({ url: "test", title: "test", author: "test", platform: "Instagram", thumbnail: "", formats: [
    { formatId: "audio", ext: "mp3", type: "audio", quality: "MP3", downloadUrl: "https://cdninstagram.com/a.mp4" },
  ] });
  const before = admin.getAdminStats().totalDownloads;
  const { GET } = require("../app/api/download/route.ts");
  const response = await GET(new NextRequest("http://localhost" + result.formats[0].downloadUrl));
  assert.equal(response.status, 502);
  assert.equal(admin.getAdminStats().totalDownloads, before);
  assert.equal(drained, true);
  spawn.mock.restore(); fetch.mock.restore();
});

test("conversion cancellation kills the process and releases its slot", async () => {
  const child = require("node:child_process");
  const { EventEmitter } = require("node:events");
  const { PassThrough } = require("node:stream");
  const controller = new AbortController();
  let killed = false;
  const spawn = mock.method(child, "spawn", () => {
    const process = new EventEmitter();
    process.stdout = new PassThrough(); process.stderr = new PassThrough();
    process.kill = () => { killed = true; setImmediate(() => process.emit("close", null)); return true; };
    setImmediate(() => controller.abort());
    return process;
  });
  const { convertAudio } = require("../lib/convertAudio.ts");
  await assert.rejects(() => convertAudio(Buffer.from("test"), controller.signal), error => error.status === 499);
  assert.equal(killed, true);
  policy.acquireLease("convert", 1)();
  spawn.mock.restore();
});

test("bounded response sizes reject oversized source bodies", async () => {
  const https = require("node:https");
  const { EventEmitter } = require("node:events");
  const { Readable } = require("node:stream");
  const get = mock.method(https, "get", (_url, _options, callback) => {
    const request = new EventEmitter();
    queueMicrotask(() => {
      const response = Readable.from([Buffer.alloc(20)]);
      response.statusCode = 200; response.headers = {};
      callback(response);
    });
    return request;
  });
  await assert.rejects(() => media.fetchMedia("https://cdninstagram.com/a", AbortSignal.timeout(1000), 10), error => error.status === 413);
  get.mock.restore();
});

test("login endpoint locks out repeated attempts with 429", async () => {
  const { POST } = require("../app/api/admin/login/route.ts");
  for (let i = 0; i < 5; i++) {
    const response = await POST(new NextRequest("http://localhost/api/admin/login", { method: "POST", body: JSON.stringify({ username: "unknown", password: "wrong" }) }));
    assert.equal(response.status, 401);
  }
  const response = await POST(new NextRequest("http://localhost/api/admin/login", { method: "POST", body: "{}" }));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "60");
});

test("saved public settings are applied without exposing administration data", async () => {
  const { GET } = require("../app/api/site-settings/route.ts");
  admin.updateAdminSettings({ maintenance_mode: true, ad_top_banner_enabled: true, ad_top_banner_code: "<p>test</p>" });
  const body = await GET().json();
  assert.equal(body.maintenance, true);
  assert.equal(body.banners.top, "<p>test</p>");
  assert.equal(body.password_hash, undefined);
  admin.updateAdminSettings({ maintenance_mode: false, ad_top_banner_enabled: false });
});

test("mirror media uses its required referer after each redirect", async () => {
  const https = require("node:https");
  const { EventEmitter } = require("node:events");
  const { Readable } = require("node:stream");
  const get = mock.method(https, "get", (_url, options, callback) => {
    assert.equal(options.headers.Referer, "https://insta-stories-viewer.com/");
    const request = new EventEmitter();
    queueMicrotask(() => {
      const response = Readable.from([Buffer.from([255,216,255])]);
      response.statusCode = 200; response.headers = {};
      callback(response);
    });
    return request;
  });
  try { assert.equal((await media.fetchMedia("https://cdn.iqsaved.com/a.jpg", AbortSignal.timeout(1000))).length, 3); }
  finally { get.mock.restore(); }
});
