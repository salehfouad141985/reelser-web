require("./register.cjs");
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");
const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reelser-policy-regression-"));
process.env.REELSER_DATA_DIR = directory;
process.env.ADMIN_JWT_SECRET = "regression-only-secret-".repeat(3);
process.env.REELSER_ADMIN_PASS = "regression-only-password";
const policy = require("../lib/requestPolicy.ts");
const storage = require("../lib/storage.ts");
const admin = require("../lib/adminStore.ts");
const tickets = require("../lib/mediaTickets.ts");
const media = require("../lib/safeMedia.ts");
const { NextRequest } = require("next/server");
after(() => fs.rmSync(directory, { recursive: true, force: true }));

test("untrusted IP headers cannot create new visitor quotas", t => {
  const previous = process.env.REELSER_TRUSTED_IP_HEADER;
  t.after(() => {
    if (previous === undefined) delete process.env.REELSER_TRUSTED_IP_HEADER;
    else process.env.REELSER_TRUSTED_IP_HEADER = previous;
  });
  const request = headers => new Request("https://reelser.com", { headers });
  delete process.env.REELSER_TRUSTED_IP_HEADER;
  for (const header of ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"])
    assert.equal(policy.clientKey(request({ [header]: "8.8.8.8" })), "shared");
  process.env.REELSER_TRUSTED_IP_HEADER = "x-trusted-client";
  assert.equal(policy.clientKey(request({ "x-real-ip": "8.8.8.8" })), "shared");
  assert.equal(policy.clientKey(request({ "x-trusted-client": "8.8.8.8, 1.1.1.1" })), "shared");
  assert.equal(policy.clientKey(request({ "x-trusted-client": "invalid" })), "shared");
  assert.equal(policy.clientKey(request({ "x-trusted-client": " 8.8.8.8 " })), "8.8.8.8");
});

test("leases remain occupied beyond each operation deadline and recover after expiry", async t => {
  let now = 1000;
  t.mock.method(Date, "now", () => now);
  for (const [kind, deadline] of [["extract", 25000], ["convert", 35000], ["download", 60000]]) {
    const release = await policy.acquireLease(kind, 1);
    now += deadline + 1000;
    await assert.rejects(policy.acquireLease(kind, 1), error => error.status === 429);
    now += 80000;
    const recovered = await policy.acquireLease(kind, 1);
    await release();
    // Releasing the old job must not free the new job's slot.
    await assert.rejects(policy.acquireLease(kind, 1), error => error.status === 429);
    await recovered();
  }
});

test("initial extraction and pagination enforce the same shared capacity", async t => {
  const mode = process.env.REELSER_PROFILE_SOURCE;
  process.env.REELSER_PROFILE_SOURCE = "selfHosted";
  t.after(() => {
    if (mode === undefined) delete process.env.REELSER_PROFILE_SOURCE;
    else process.env.REELSER_PROFILE_SOURCE = mode;
  });
  const releases = [];
  try {
    for (let i = 0; i < policy.EXTRACTION_CONCURRENCY; i++) releases.push(await policy.acquireLease("extract", policy.EXTRACTION_CONCURRENCY));
    const request = body => new NextRequest("https://reelser.com/api/extract", { method: "POST", body: JSON.stringify(body) });
    const initial = require("../app/api/extract/route.ts").POST;
    const page = require("../app/api/profile-media/route.ts").POST;
    assert.equal((await initial(request({ url: "@example" }))).status, 429);
    assert.equal((await page(request({ username: "example", section: "posts" }))).status, 429);
  } finally { for (const release of releases) await release(); }
});

test("failed lease release preserves the prepared download and its statistic", async t => {
  const result = await tickets.authorizeMedia({ url: "test", title: "test", author: "test", platform: "Instagram", thumbnail: "", formats: [
    { formatId: "image", ext: "jpg", quality: "Photo", type: "image", downloadUrl: "https://cdninstagram.com/a.jpg" },
  ] });
  t.mock.method(media, "fetchMedia", async () => Buffer.from([255, 216, 255, 224]));
  const before = (await admin.getAdminStats()).totalDownloads;
  const rename = fs.promises.rename.bind(fs.promises);
  let writes = 0;
  t.mock.method(fs.promises, "rename", async (from, to) => {
    if (path.basename(to) === "leases-download.json" && ++writes === 2) throw new Error("simulated release write failure");
    return rename(from, to);
  });
  const logs = t.mock.method(console, "error", () => {});
  const response = await require("../app/api/download/route.ts").GET(new NextRequest("https://reelser.com" + result.formats[0].downloadUrl));
  assert.equal(response.status, 200);
  assert.equal((await response.arrayBuffer()).byteLength, 4);
  assert.equal((await admin.getAdminStats()).totalDownloads, before + 1);
  assert.equal(logs.mock.callCount(), 1);
});

test("settings, stats, session verification and tickets can be read without any writes", async t => {
  const token = await admin.createAdminToken();
  const result = await tickets.authorizeMedia({ url: "test", title: "test", author: "test", platform: "Instagram", thumbnail: "", formats: [
    { formatId: "1", ext: "jpg", quality: "Photo", type: "image", downloadUrl: "https://cdninstagram.com/a.jpg" },
  ] });
  const id = new URL(result.formats[0].downloadUrl, "https://reelser.com").searchParams.get("ticket");
  for (const method of ["mkdir", "open", "rename"]) t.mock.method(fs.promises, method, async () => { throw new Error("read attempted a write"); });
  assert.equal((await admin.getAdminSettings()).maintenance_mode, false);
  assert.ok((await admin.getAdminStats()).totalDownloads >= 1);
  assert.equal(await admin.verifyAdminToken(token), true);
  assert.equal((await tickets.readTicket(id, "download")).kind, "download");
});

test("contended transactions yield and snapshots stay consistent until commit", async () => {
  await storage.transaction("yield-test", () => ({ value: 0 }), () => {});
  let unlock;
  let entered;
  const ready = new Promise(resolve => { entered = resolve; });
  const gate = new Promise(resolve => { unlock = resolve; });
  const first = storage.transaction("yield-test", () => ({}), async data => {
    data.value = 1;
    entered();
    await gate;
  });
  await ready;
  const second = storage.transaction("yield-test", () => ({}), data => { data.value++; });
  try {
    // A blocking lock wait would prevent this timer and expire before unlock.
    await delay(30);
    assert.equal((await storage.readSnapshot("yield-test", () => ({}))).value, 0);
  } finally { unlock(); await Promise.all([first, second]); }
  assert.equal((await storage.readSnapshot("yield-test", () => ({}))).value, 2);
});

test("fresh snapshot reads do not create a persisted store", async () => {
  assert.deepEqual(await storage.readSnapshot("uninitialized", () => ({ value: 0 })), { value: 0 });
  assert.equal(fs.existsSync(path.join(directory, "uninitialized.json")), false);
});

test("password resets revoke sessions issued by authenticated login", async () => {
  assert.equal(await admin.authenticateAdmin("admin", "wrong-password"), null);
  const token = await admin.authenticateAdmin("admin", process.env.REELSER_ADMIN_PASS);
  assert.match(token, /^[\w-]{43}$/);
  assert.equal(await admin.verifyAdminToken(token), true);
  await admin.updateAdminPassword("new-regression-only-password");
  assert.equal(await admin.verifyAdminToken(token), false);
  assert.equal(await admin.authenticateAdmin("admin", process.env.REELSER_ADMIN_PASS), null);
  assert.ok(await admin.authenticateAdmin("admin", "new-regression-only-password"));
});

test("proxy thumbnail previews do not exhaust video download concurrency slots and extract rejects cross-origin POST", async () => {
  const releases = [];
  try {
    for (let i = 0; i < policy.DOWNLOAD_CONCURRENCY; i++) {
      releases.push(await policy.acquireLease("download", policy.DOWNLOAD_CONCURRENCY));
    }
    const releaseProxy = await policy.acquireLease("proxy", policy.PROXY_CONCURRENCY);
    await releaseProxy();
  } finally {
    for (const release of releases) await release();
  }
  const { POST } = require("../app/api/extract/route.ts");
  const crossOrigin = new NextRequest("https://reelser.com/api/extract", {
    method: "POST",
    headers: { origin: "https://evil.example.com" },
    body: JSON.stringify({ url: "@example" }),
  });
  assert.equal((await POST(crossOrigin)).status, 403);
});
