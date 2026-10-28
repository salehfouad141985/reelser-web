require("./register.cjs");
const { test, mock } = require("node:test");
const assert = require("node:assert/strict");
const { extractInstagramMedia } = require("../lib/instagramExtractor.ts");
const media = require("../lib/safeMedia.ts");
const { normalizeInstagramMediaUrl, isValidInstagramUrl, extractInstagramShortcode } = require("../lib/instagramExtractor.ts");

test("account-qualified media links validate and extract using the direct canonical path", async t => {
  const input = "https://www.instagram.com/nasa/reel/DeTUk4sDSp-/?igsh=test";
  assert.equal(isValidInstagramUrl(input), true);
  assert.equal(extractInstagramShortcode(input), "DeTUk4sDSp-");
  assert.equal(normalizeInstagramMediaUrl(input), "https://www.instagram.com/reel/DeTUk4sDSp-/?igsh=test");
  for (const type of ["p", "reel", "reels", "tv"]) {
    assert.equal(isValidInstagramUrl(`https://instagram.com/user.name/${type}/ABC_123-/`), true);
  }
  for (const input of ["https://instagram.com.evil.test/nasa/reel/abc/", "http://instagram.com/nasa/reel/abc/",
    "https://user:pass@instagram.com/nasa/reel/abc/", "https://instagram.com:444/nasa/reel/abc/",
    "https://instagram.com/nasa/reel/abc/extra", "https://instagram.com/accounts/reel/abc/"]) {
    assert.equal(isValidInstagramUrl(input), false);
    assert.equal(normalizeInstagramMediaUrl(input), input);
  }
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.body.get("url"), "https://www.instagram.com/reel/DeTUk4sDSp-/?igsh=test");
    return new Response(encodedMedia());
  });
  const result = await extractInstagramMedia(input);
  assert.equal(result.formats.length, 2);
  assert.match(result.title, /DeTUk4sDSp-/);
});
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

test("reel extraction falls back to Instagram embed endpoint when primary provider fails", async () => {
  const embedPayload = `<script>window.__additionalDataLoaded('extra',{"shortcode_media":{"video_url":"https:\\/\\/scontent.cdninstagram.com\\/v\\/t50.2886-16\\/reel_fallback.mp4?efg=1\\u0026oe=2","display_url":"https:\\/\\/scontent.cdninstagram.com\\/v\\/t51.2885-15\\/thumb_fallback.jpg"}});</script>`;
  const fetch = mock.method(globalThis, "fetch", async (url) => {
    if (String(url).includes("snapsave.app")) return new Response("unavailable", { status: 503 });
    if (String(url).includes("/p/DeTUk4sDSp-/embed/captioned/")) return new Response(embedPayload);
    return new Response("", { status: 404 });
  });
  try {
    const result = await extractInstagramMedia("https://www.instagram.com/reel/DeTUk4sDSp-/");
    assert.ok(result);
    assert.equal(result.formats.length, 2);
    assert.equal(result.formats[0].type, "video");
    assert.equal(result.formats[0].downloadUrl, "https://scontent.cdninstagram.com/v/t50.2886-16/reel_fallback.mp4?efg=1&oe=2");
    assert.equal(result.formats[1].type, "audio");
  } finally { fetch.mock.restore(); }
});
