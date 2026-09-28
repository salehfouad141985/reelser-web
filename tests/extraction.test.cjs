require("./register.cjs");
const { test, mock } = require("node:test");
const assert = require("node:assert/strict");
const { extractInstagramMedia } = require("../lib/instagramExtractor.ts");
const media = require("../lib/safeMedia.ts");
function encodedMedia() {
  const html = '<div class="download-items"><img src="https://cdninstagram.com/photo.jpg"><div class="download-items__btn"><a href="https://cdninstagram.com/photo.jpg">Download</a></div></div><div class="download-items"><img src="https://cdninstagram.com/video.jpg"><span class="icon-dlvideo"></span><div class="download-items__btn"><a href="https://cdninstagram.com/video.mp4">Download</a></div></div>';
  const decoded = 'getElementById("download-section").innerHTML = "' + html + '"; document.getElementById("inputData").remove(); ';
  const encoded = [...decoded].map(char => char.charCodeAt(0).toString(2).replaceAll("0", "a").replaceAll("1", "b") + "c").join("");
  return `decodeURIComponent(escape(r))}("${encoded}",0,"abc",0,2,0))`;
}
test("post results keep photos out of reels and posts out of stories", async () => {
  const fetch = mock.method(globalThis, "fetch", async (url, options) => String(url).includes("snapsave.app")
    ? new Response(options.body.get("url").includes("/stories/") ? "invalid encoding" : encodedMedia())
    : new Response("", { status: 503 }));
  try {
    const result = await extractInstagramMedia("@example");
    assert.equal(result.profileData.posts.length, 2);
    assert.equal(result.profileData.mediaCoverage, "partial");
    assert.equal(result.profileData.reels.length, 1);
    assert.equal(result.profileData.reels[0].type, "video");
    assert.equal(result.profileData.stories.length, 0);
    assert.equal(result.profileData.hdAvatarUrl, "");
    assert.equal(result.formats.length, 2);
  } finally { fetch.mock.restore(); }
});
test("stories are fetched separately even when profile media is empty", async () => {
  let calls = 0;
  const fetch = mock.method(globalThis, "fetch", async (url, options) => {
    if (!String(url).includes("snapsave.app")) return new Response("", { status: 503 });
    assert.ok(options.signal);
    calls++;
    return new Response(options.body.get("url").includes("/stories/") ? encodedMedia() : "invalid encoding");
  });
  try {
    const result = await extractInstagramMedia("@example");
    assert.equal(calls, 2);
    assert.equal(result.profileData.posts.length, 0);
    assert.equal(result.profileData.reels.length, 0);
    assert.equal(result.profileData.stories.length, 2);
  } finally { fetch.mock.restore(); }
});
test("active stories appear alongside posts and reels", async () => {
  const fetch = mock.method(globalThis, "fetch", async (url) => String(url).includes("snapsave.app")
    ? new Response(encodedMedia()) : new Response("", { status: 503 }));
  try {
    const result = await extractInstagramMedia("@example");
    assert.equal(result.profileData.posts.length, 2);
    assert.equal(result.profileData.mediaCoverage, "partial");
    assert.equal(result.profileData.reels.length, 1);
    assert.equal(result.profileData.stories.length, 2);
    assert.equal(result.formats.length, 4);
  } finally { fetch.mock.restore(); }
});
test("direct story links do not invent an avatar or posts", async () => {
  const fetch = mock.method(globalThis, "fetch", async () => new Response(encodedMedia()));
  try {
    const result = await extractInstagramMedia("https://www.instagram.com/stories/example/");
    assert.equal(result.profileData.stories.length, 2);
    assert.equal(result.profileData.posts.length, 0);
    assert.equal(result.profileData.hdAvatarUrl, "");
  } finally { fetch.mock.restore(); }
});

test("denied viewer avatar does not create broken tickets or erase profile metadata", async () => {
  const viewerHtml = `<img class="profile__avatar-pic" src="https://cdn.iqsaved.com/avatar.jpg">
    <div class="profile__nickname">Example Creator</div>
    <div class="profile__stats-posts">210</div>
    <div class="profile__stats-followers">900K</div>
    <div class="profile__description">Example biography</div>`;
  const fetch = mock.method(globalThis, "fetch", async (url, options) => {
    if (String(url).includes("insta-stories-viewer.com")) return new Response(viewerHtml);
    if (String(url).includes("snapsave.app")) return new Response(options.body.get("url").includes("/stories/") ? "invalid encoding" : encodedMedia());
    return new Response("", { status: 503 });
  });
  const avatarFetch = mock.method(media, "fetchMedia", async () => { throw new Error("CDN denied access"); });
  try {
    const result = await extractInstagramMedia("@example");
    assert.equal(avatarFetch.mock.callCount(), 1);
    assert.equal(result.profileData.fullName, "Example Creator");
    assert.equal(result.profileData.followersCount, "900K");
    assert.equal(result.profileData.biography, "Example biography");
    assert.equal(result.profileData.avatarUrl, "/icon.svg");
    assert.equal(result.profileData.hdAvatarUrl, "");
    assert.equal(result.profileData.posts.length, 2);
    assert.equal(result.formats.length, 2);
  } finally { fetch.mock.restore(); avatarFetch.mock.restore(); }
});
