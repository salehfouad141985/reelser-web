const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { test } = require("node:test");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Load the actual TypeScript components without requiring a browser or a build.
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}
const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return resolveFilename.call(this,
    request.startsWith("@/") ? path.join(__dirname, "..", request.slice(2)) : request,
    ...args);
};

const { ProfileViewer } = require("../components/ProfileViewer.tsx");
const baseProfile = {
  username: "example", fullName: "Example", avatarUrl: "https://example.com/avatar.jpg",
  hdAvatarUrl: "https://example.com/avatar.jpg", postsCount: "0", followersCount: "0",
  followingCount: "0", biography: "", posts: [], reels: [], stories: [], highlights: [],
};
const item = (index) => ({
  id: String(index), type: "image", thumbnail: `https://example.com/${index}.jpg`,
  downloadUrl: `https://example.com/${index}.jpg`, caption: `Post caption ${index}`,
});
const render = (overrides = {}) => renderToStaticMarkup(
  React.createElement(ProfileViewer, { profile: { ...baseProfile, ...overrides } })
);

test("empty profiles render safely and do not invent posts", () => {
  const html = render();
  assert.match(html, /No posts available to display/);
  assert.doesNotMatch(html, /426K|Featured Media|Show more|role="dialog"/);
});

test("initial posts are present in server rendering", () => {
  const html = render({ posts: [item(1)] });
  assert.match(html, /Post caption 1/);
  assert.doesNotMatch(html, /No posts available|Show more/);
});

test("large batches show twelve items and offer the remaining batch", () => {
  const html = render({ posts: Array.from({ length: 13 }, (_, i) => item(i + 1)) });
  assert.match(html, /Post caption 12/);
  assert.doesNotMatch(html, /Post caption 13/);
  assert.match(html, /Show more/);
});

test("a complete batch has no further loading control", () => {
  const html = render({ posts: Array.from({ length: 12 }, (_, i) => item(i + 1)) });
  assert.doesNotMatch(html, /Show more/);
});

test("available stories select the stories tab without showing posts", () => {
  const html = render({ posts: [item(1)], stories: [item(2)] });
  assert.match(html, /Instagram Story/);
  assert.doesNotMatch(html, /Post caption 1|No Active Stories/);
});

test("multiple stories all render and partial results are disclosed", () => {
  const html = render({ stories: [item(1), item(2), item(3)], mediaCoverage: "partial" });
  assert.equal((html.match(/alt="Instagram Story"/g) || []).length, 3);
  assert.match(html, /These results may not include all posts, reels or active stories/);
});

test("self-hosted reels select their own tab and expose a remote next page", () => {
  const html = render({ source: "selfHosted", initialSection: "reels", reels: [{ ...item(1), type: "video" }],
    pagination: { reels: { loaded: true, cursor: "next-page" }, posts: { loaded: false, cursor: null } } });
  assert.match(html, /Instagram Reel/);
  assert.match(html, /Show more/);
  assert.doesNotMatch(html, /No reels available/);
});

test("unloaded sections do not claim that no media exists", () => {
  const html = render({ source: "selfHosted", initialSection: "stories", pagination: { stories: { loaded: false, cursor: null } } });
  assert.doesNotMatch(html, /No Active Stories/);
});
