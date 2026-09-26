require("./register.cjs");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFile } = require("node:child_process");
const { promisify } = require("node:util");
test("multiple workers update the same file without lost writes", async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "reelser-lock-test-"));
  const script = `require('./tests/register.cjs');const {transaction}=require('./lib/storage.ts');for(let i=0;i<12;i++)transaction('counter',()=>({value:0}),data=>{data.value++});`;
  try {
    await Promise.all(Array.from({ length: 3 }, () => promisify(execFile)(process.execPath, ["-e", script], {
      cwd: path.join(__dirname, ".."), env: { ...process.env, REELSER_DATA_DIR: directory }, windowsHide: true, timeout: 15000,
    })));
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory, "counter.json"))).value, 36);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
