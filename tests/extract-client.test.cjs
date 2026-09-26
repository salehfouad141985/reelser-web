const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const ts = require("typescript");

const source = fs.readFileSync(path.join(__dirname, "../lib/extractClient.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const client = { exports: {} };
new Function("module", "exports", compiled)(client, client.exports);
const { requestExtract } = client.exports;

test("retries an empty response once and returns the next valid result", async () => {
  let calls = 0;
  const result = { formats: [{ url: "/api/download?ticket=test" }] };
  const request = async (_url, options) => {
    calls++;
    assert.equal(options.cache, "no-store");
    return calls === 1
      ? new Response("")
      : Response.json({ success: true, data: result });
  };
  assert.deepEqual(await requestExtract("@maoning_mfa", "reels", "Try again", request), result);
  assert.equal(calls, 2);
});

test("shows a useful error after two invalid responses", async () => {
  let calls = 0;
  await assert.rejects(
    requestExtract("@maoning_mfa", "reels", "Try again", async () => {
      calls++;
      return new Response("<html>Unavailable</html>", { status: 502 });
    }),
    { message: "Try again" },
  );
  assert.equal(calls, 2);
});

test("does not retry an explicit API error", async () => {
  let calls = 0;
  await assert.rejects(
    requestExtract("@private", "reels", "Try again", async () => {
      calls++;
      return Response.json({ success: false, error: "Profile is private" }, { status: 422 });
    }),
    { message: "Profile is private" },
  );
  assert.equal(calls, 1);
});
