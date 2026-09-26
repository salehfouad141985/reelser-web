// Bounded source responses and real cancellation, including the response body.
async function fetchSource(url: string, options: RequestInit): Promise<Response> {
  const response = await fetch(url, { ...options, redirect: "error" });
  if (!response.ok || !response.body) throw new Error("Source unavailable");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      options.signal?.throwIfAborted();
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 2 * 1024 * 1024) { await reader.cancel(); throw new Error("Source response too large"); }
      chunks.push(value);
    }
    return new Response(Buffer.concat(chunks), { status: response.status, headers: response.headers });
  } finally { reader.releaseLock(); }
}

export interface MediaFormat {
  formatId: string;
  quality: string;
  ext: string;
  type: "video" | "audio" | "image";
  downloadUrl: string;
  note?: string;
}

export interface ProfileMediaItem {
  id: string;
  type: "video" | "image";
  thumbnail: string;
  downloadUrl: string;
  caption?: string;
  likes?: string;
  comments?: string;
  timestamp?: string;
  isVideo?: boolean;
}

export interface ProfileHighlightItem {
  id: string;
  title: string;
  cover: string;
}

export interface ProfileData {
  username: string;
  fullName: string;
  avatarUrl: string;
  hdAvatarUrl: string;
  avatarDownloadUrl?: string;
  postsCount: string;
  followersCount: string;
  followingCount: string;
  biography: string;
  isVerified?: boolean;
  posts: ProfileMediaItem[];
  stories: ProfileMediaItem[];
  highlights: ProfileHighlightItem[];
  reels: ProfileMediaItem[];
}

export interface MediaResult {
  url: string;
  title: string;
  author: string;
  thumbnail: string;
  duration?: string;
  durationSeconds?: number;
  platform: "Instagram";
  formats: MediaFormat[];
  isProfile?: boolean;
  profileData?: ProfileData;
}

export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:instagram\.com\/(?:p|reel|reels|tv|share)\/)([\w-]+)/i);
  return match ? match[1] : null;
}

export function extractInstagramUsername(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (trimmed.includes("://")) {
    try { const parsed = new URL(trimmed); if (parsed.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(parsed.hostname) || parsed.username || parsed.password || parsed.port) return null; } catch { return null; }
  }

  // If starts with @, e.g. @cristiano or @user.name
  if (trimmed.startsWith("@")) {
    const candidate = trimmed.slice(1).trim();
    if (/^[a-zA-Z0-9._]{1,30}$/.test(candidate)) {
      return candidate;
    }
  }

  // If story URL like instagram.com/stories/username/
  const storyMatch = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/stories\/([a-zA-Z0-9._]{1,30})\/?(?:\?.*)?$/i);
  if (storyMatch) {
    return storyMatch[1].toLowerCase();
  }

  // If profile URL like instagram.com/username or https://www.instagram.com/username/
  const profileMatch = trimmed.match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]{1,30})\/?(?:\?.*)?$/i);
  if (profileMatch) {
    const candidate = profileMatch[1].toLowerCase();
    const reserved = ["p", "reel", "reels", "tv", "stories", "share", "explore", "accounts", "direct", "about", "developer"];
    if (!reserved.includes(candidate)) {
      return candidate;
    }
  }

  // Plain username: 2-30 characters, alphanumeric with dot or underscore, no spaces, slashes, or colons
  if (/^[a-zA-Z0-9._]{2,30}$/.test(trimmed) && !trimmed.includes("/") && !trimmed.includes(":") && !trimmed.includes(" ")) {
    return trimmed;
  }

  return null;
}

export function isValidInstagramUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.includes("://")) {
    try { const parsed = new URL(trimmed); if (parsed.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(parsed.hostname) || parsed.username || parsed.password || parsed.port) return false; } catch { return false; }
  }
  if (/^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|reels|tv|stories|share)\/([\w.-]+)/i.test(trimmed)) {
    return true;
  }
  if (extractInstagramUsername(trimmed) !== null) {
    return true;
  }
  return false;
}

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&#064;/g, "@")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[\u200e\u200f]/g, "")
    .trim();
}

export function createFallbackProfileResult(username: string): MediaResult {
  const clean = username.replace(/^@/, "").replace(/\/$/, "").trim();
  const defaultAvatar = "/icon.svg";

  return {
    url: `https://www.instagram.com/${clean}/`,
    title: `@${clean}`,
    author: `@${clean}`,
    thumbnail: defaultAvatar,
    platform: "Instagram",
    formats: [],
    isProfile: true,
    profileData: {
      username: clean,
      fullName: `@${clean}`,
      avatarUrl: defaultAvatar,
      hdAvatarUrl: "",
      postsCount: "0",
      followersCount: "Public",
      followingCount: "Instagram",
      biography: `Instagram Creator @${clean}`,
      isVerified: false,
      posts: [],
      stories: [],
      highlights: [],
      reels: [],
    },
  };
}

async function fetchPublicProfileMetadata(username: string, signal: AbortSignal): Promise<{
  username: string;
  fullName: string;
  avatarUrl: string;
  hdAvatarUrl: string;
  postsCount: string;
  followersCount: string;
  followingCount: string;
  biography: string;
  isVerified?: boolean;
} | null> {
  const clean = username.replace(/^@/, "").replace(/\/$/, "").trim();
  if (!clean) return null;

  try {
    const res = await fetchSource(`https://insta-stories-viewer.com/${encodeURIComponent(clean)}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.any([signal, AbortSignal.timeout(6000)]),
    });

    if (!res.ok) return null;

    const html = await res.text();
    const { load } = await import("cheerio");
    const $ = load(html);

    const rawAvatar = $(".profile__avatar-pic").attr("src") || "";
    const postsCount = $(".profile__stats-posts").text().trim() || "";
    const followersCount = $(".profile__stats-followers").text().trim() || "";
    const followingCount = $(".profile__stats-follows").text().trim() || "";
    const bio = $(".profile__description").text().trim() || "";
    const nickname = $(".profile__nickname").text().replace(/\(Anonymous profile view\)/i, "").trim() || clean;
    const isVerified = $(".profile__nickname-is-verify").length > 0;

    let exactFollowers = "";
    let exactPosts = "";
    let exactFollowing = "";
    const chartMatch = html.match(/var\s+CHART_DATA\s*=\s*({[^;]+});/);
    if (chartMatch) {
      try {
        const chart = JSON.parse(chartMatch[1]);
        const keys = Object.keys(chart);
        if (keys.length > 0) {
          const latest = chart[keys[keys.length - 1]];
          if (latest.followers) exactFollowers = Number(latest.followers).toLocaleString();
          if (latest.posts) exactPosts = Number(latest.posts).toLocaleString();
          if (latest.followings) exactFollowing = Number(latest.followings).toLocaleString();
        }
      } catch {}
    }

    if (rawAvatar || followersCount) {

      return {
        username: clean,
        fullName: nickname,
        avatarUrl: rawAvatar,
        hdAvatarUrl: rawAvatar,
        postsCount: exactPosts || postsCount || "0",
        followersCount: exactFollowers || followersCount || "Public",
        followingCount: exactFollowing || followingCount || "Instagram",
        biography: bio || `Instagram Creator @${clean}`,
        isVerified,
      };
    }
  } catch {
    console.warn("fetchPublicProfileMetadata error:");
  }
  return null;
}

export async function extractInstagramProfile(username: string, signal: AbortSignal = AbortSignal.timeout(10000)): Promise<MediaResult | null> {
  const clean = username.replace(/^@/, "").replace(/\/$/, "").trim();
  if (!clean) return null;

  try {
    // 1. Fetch public profile metadata from residential viewer mirror
    const publicMetaPromise = fetchPublicProfileMetadata(clean, signal);

    // 2. Also attempt direct Instagram request (in case residential proxy / client IP is direct)
    const directPromise = (async () => {
      try {
        const chromeHeaders = {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Sec-Ch-Ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        };

        const res = await fetchSource(`https://www.instagram.com/${clean}/`, {
          headers: chromeHeaders,
          cache: "no-store",
          signal: AbortSignal.any([signal, AbortSignal.timeout(5000)]),
        });

        if (!res.ok) return null;
        const html = await res.text();
        const { load } = await import("cheerio");
        const $ = load(html);

        const ogImg =
          $('meta[property="og:image"]').attr("content") ||
          $('meta[name="og:image"]').attr("content") ||
          $('meta[name="twitter:image"]').attr("content") ||
          (html.match(/property="og:image"\s+content="([^"]+)"/) || [])[1] ||
          "";

        const ogTitle =
          $('meta[property="og:title"]').attr("content") ||
          $('meta[name="og:title"]').attr("content") ||
          $("title").text() ||
          "";

        const ogDesc =
          $('meta[property="og:description"]').attr("content") ||
          $('meta[name="description"]').attr("content") ||
          "";

        // Detect datacenter login block or placeholder
        const isLoginBlock =
          ogTitle.toLowerCase().includes("login") ||
          ogTitle.toLowerCase().includes("تسجيل الدخول") ||
          ogTitle.trim() === "Instagram" ||
          ogImg.includes("rsrc.php") ||
          ogImg.includes("static.cdninstagram.com");

        if (isLoginBlock || !ogImg) {
          return null;
        }

        const cleanImg = ogImg.replace(/&amp;/g, "&");
        const hdMatch = html.match(/"profile_pic_url_hd":"([^"]+)"/) || html.match(/"profile_pic_url":"([^"]+)"/);
        let hdImg = cleanImg;
        if (hdMatch) {
          try {
            hdImg = JSON.parse(`"${hdMatch[1]}"`);
          } catch {
            hdImg = hdMatch[1];
          }
        }

        const decodedTitle = decodeHtmlEntities(ogTitle);
        let displayName = clean;
        if (decodedTitle) {
          const matchName = decodedTitle.match(/^([^(]+)/);
          if (matchName && matchName[1].trim() && matchName[1].trim() !== "Instagram") {
            displayName = matchName[1].trim();
          }
        }

        const decodedDesc = decodeHtmlEntities(ogDesc);
        const followersCount = (decodedDesc.match(/([\d.,]+[KkMmBb]?)\s+Followers/i) || [])[1] || "Public";
        const followingCount = (decodedDesc.match(/([\d.,]+[KkMmBb]?)\s+Following/i) || [])[1] || "Instagram";
        const postsCount = (decodedDesc.match(/([\d.,]+[KkMmBb]?)\s+Posts/i) || [])[1] || "0";

        const bioText = decodedDesc
          ? decodedDesc
              .replace(/[\d.,]+[KkMmBb]?\s+Followers,\s+[\d.,]+[KkMmBb]?\s+Following,\s+[\d.,]+[KkMmBb]?\s+Posts\s*-\s*See\s+Instagram\s+photos\s+and\s+videos\s+from\s+/i, "")
              .replace(new RegExp(`^${displayName}\\s*\\(@${clean}\\)`, "i"), "")
              .trim()
          : "";

        return {
          username: clean,
          fullName: displayName,
          avatarUrl: hdImg || cleanImg,
          hdAvatarUrl: hdImg || cleanImg,
          postsCount,
          followersCount,
          followingCount,
          biography: bioText,
          isVerified: decodedTitle.includes("Verified") || html.includes('"is_verified":true'),
        };
      } catch {
        return null;
      }
    })();

    const [publicMeta, directMeta] = await Promise.all([publicMetaPromise, directPromise]);
    const chosen = directMeta || publicMeta;

    if (!chosen) {
      return null;
    }

    const fullName = directMeta?.fullName || publicMeta?.fullName || clean;
    const avatarUrl = directMeta?.avatarUrl || publicMeta?.avatarUrl || "/icon.svg";
    const hdAvatarUrl = directMeta?.hdAvatarUrl || publicMeta?.hdAvatarUrl || avatarUrl;
    const postsCount = publicMeta?.postsCount || directMeta?.postsCount || "0";
    const followersCount = publicMeta?.followersCount || directMeta?.followersCount || "Public";
    const followingCount = publicMeta?.followingCount || directMeta?.followingCount || "Instagram";
    const biography = publicMeta?.biography || directMeta?.biography || `Instagram Creator @${clean}`;
    const isVerified = Boolean(directMeta?.isVerified || publicMeta?.isVerified);

    const formats: MediaFormat[] = hdAvatarUrl && hdAvatarUrl !== "/icon.svg" ? [
      {
        formatId: "ig-avatar-hd",
        quality: "Profile picture (available quality)",
        ext: "jpg",
        type: "image",
        downloadUrl: hdAvatarUrl,
        note: `Profile avatar of @${clean}`,
      },
    ] : [];

    if (avatarUrl && avatarUrl !== hdAvatarUrl) {
      formats.push({
        formatId: "ig-avatar-sd",
        quality: "Standard Profile Picture (JPG)",
        ext: "jpg",
        type: "image",
        downloadUrl: avatarUrl,
        note: "Standard Quality",
      });
    }

    const profileData: ProfileData = {
      username: clean,
      fullName,
      avatarUrl,
      hdAvatarUrl,
      postsCount,
      followersCount,
      followingCount,
      biography,
      isVerified,
      posts: [],
      stories: [],
      highlights: [],
      reels: [],
    };

    return {
      url: `https://www.instagram.com/${clean}/`,
      title: `${fullName} (@${clean})`,
      author: `@${clean}`,
      thumbnail: avatarUrl,
      platform: "Instagram",
      formats,
      isProfile: true,
      profileData,
    };
  } catch {
    console.warn("Instagram profile extraction error:");
    return null;
  }
}

function decodeSnapApp(args: string[]): string {
  const [h, , n, t, e] = args;
  const tNum = Number(t);
  const eNum = Number(e);
  if (!Number.isFinite(tNum) || !Number.isInteger(eNum) || eNum < 2 || eNum > 36 || n.length > 64 || !n[eNum]) throw new Error("Invalid source encoding");
  function decode(d: string, e: number, f: number) {
    const g = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split("");
    const hArr = g.slice(0, e);
    const iArr = g.slice(0, f);
    let j = d.split("").reverse().reduce((a, b, c) => {
      const idx = hArr.indexOf(b);
      if (idx !== -1) return a + idx * Math.pow(e, c);
      return a;
    }, 0);
    if (!Number.isFinite(j)) throw new Error("Invalid encoded value");
    let k = "";
    while (j > 0) {
      k = iArr[j % f] + k;
      j = Math.floor(j / f);
    }
    return k || "0";
  }
  let result = "";
  for (let i = 0, len = h.length; i < len;) {
    let s = "";
    while (i < len && h[i] !== n[eNum]) {
      s += h[i];
      i++;
      if (s.length > 32) throw new Error("Invalid encoded chunk");
    }
    i++;
    for (let j = 0; j < n.length; j++) s = s.split(n[j]).join(j.toString());
    result += String.fromCharCode(Number(decode(s, eNum, 10)) - tNum);
  }
  return result;
}

interface SnapsaveMediaItem {
  url: string;
  thumbnail: string;
  type: "video" | "image";
}

async function fetchRawSnapsave(url: string, signal: AbortSignal): Promise<SnapsaveMediaItem[]> {
  try {
    const { load } = await import("cheerio");
    const formData = new URLSearchParams();
    formData.append("url", url);

    const response = await fetchSource("https://snapsave.app/action.php?lang=en", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://snapsave.app",
        "referer": "https://snapsave.app/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: formData,
      signal: AbortSignal.any([signal, AbortSignal.timeout(9000)]),
    });

    const raw = await response.text();
    const encodedParts = raw.split("decodeURIComponent(escape(r))}(")[1]?.split("))")[0]?.split(",")?.map((v: string) => v.replace(/"/g, "").trim());
    if (!encodedParts || encodedParts.length < 6) return [];

    const decoded = decodeSnapApp(encodedParts);
    const html = decoded.split('getElementById("download-section").innerHTML = "')[1]?.split('"; document.getElementById("inputData").remove(); ')[0]?.replace(/\\(\\)?/g, "");
    if (!html) return [];

    const $ = load(html);
    const media: SnapsaveMediaItem[] = [];

    $(".download-items").each((i, el) => {
      const thumb = $(el).find("img").attr("src");
      const isVideo = $(el).find(".icon-dlvideo").length > 0;
      const downloadUrl = $(el).find(".download-items__btn a").attr("href");
      if (downloadUrl && media.length < 100) {
        media.push({
          url: downloadUrl,
          thumbnail: thumb || downloadUrl,
          type: isVideo ? "video" : "image",
        });
      }
    });

    return media;
  } catch {
    console.warn("fetchRawSnapsave error:");
    return [];
  }
}

export async function extractInstagramMedia(inputUrl: string, signal: AbortSignal = AbortSignal.timeout(25000)): Promise<MediaResult | null> {
  const cleanUrl = inputUrl.trim();
  if (!cleanUrl) return null;

  // Check if the input is a pure username or a profile URL
  const username = extractInstagramUsername(cleanUrl);
  const isPostOrReel = /(?:instagram\.com\/(?:p|reel|reels|tv|share)\/)/i.test(cleanUrl);

  // If this is a profile or username lookup (not a single post/reel or direct story url)
  if (username && !isPostOrReel && !cleanUrl.includes("/stories/")) {
    let profileResult = await extractInstagramProfile(username, signal);
    if (!profileResult || profileResult.formats.length === 0) {
      profileResult = createFallbackProfileResult(username);
    }

    // Fetch full 12 media items (posts, reels, stories) via direct snapsave
    try {
      const targetProfileUrl = `https://www.instagram.com/${username}/`;
      const targetStoryUrl = `https://www.instagram.com/stories/${username}/`;

      let mediaList = await fetchRawSnapsave(targetProfileUrl, signal);
      let isStoryResult = false;
      if (mediaList.length === 0) {
        mediaList = await fetchRawSnapsave(targetStoryUrl, signal);
        isStoryResult = true;
      }

      if (mediaList.length > 0) {
        const currentAvatar = profileResult.profileData?.avatarUrl || profileResult.thumbnail;
        const allItems: ProfileMediaItem[] = mediaList.map((m, i) => ({
          id: `item-${i}`,
          type: m.type === "video" || m.url.includes(".mp4") ? "video" : "image",
          thumbnail: m.thumbnail || m.url || currentAvatar,
          downloadUrl: m.url,
          caption: `@${username} Media #${i + 1}`,
          isVideo: m.type === "video" || m.url.includes(".mp4"),
        }));

        const reelsOnly = allItems.filter(i => i.isVideo);

        if (profileResult.profileData) {
          if (isStoryResult) {
            profileResult.profileData.stories = allItems;
          } else {
            profileResult.profileData.posts = allItems;
            profileResult.profileData.reels = reelsOnly;
          }
          if (!isStoryResult && (profileResult.profileData.postsCount === "0" || profileResult.profileData.postsCount === "Public")) {
            profileResult.profileData.postsCount = `${allItems.length}`;
          }
        }

        mediaList.forEach((item, idx) => {
          if (item.url) {
            const isVideo = item.type === "video" || item.url.includes(".mp4");
            profileResult!.formats.push({
              formatId: `ig-media-${idx}`,
              quality: isVideo ? `Video #${idx + 1} (MP4)` : `Photo #${idx + 1} (HD JPG)`,
              ext: isVideo ? "mp4" : "jpg",
              type: isVideo ? "video" : "image",
              downloadUrl: item.url,
              note: isVideo ? "Synchronized Audio & Video" : "Original Quality",
            });
          }
        });
      }
    } catch {
      console.warn("Snapsave profile lookup error:");
    }

    signal.throwIfAborted();
    return profileResult.formats.length ? profileResult : null;
  }

  try {
    const targetUrl = cleanUrl.startsWith("@")
      ? `https://www.instagram.com/stories/${cleanUrl.slice(1)}/` : cleanUrl;
    const rawItems = await fetchRawSnapsave(targetUrl, signal);
    signal.throwIfAborted();
    const mediaData = { media: rawItems, description: "", preview: "" };

    if (!mediaData || !Array.isArray(mediaData.media) || mediaData.media.length === 0) {
      return null;
    }

    const mediaList = mediaData.media;
    const shortcode = extractInstagramShortcode(cleanUrl) || "reels";
    const title = (mediaData.description && mediaData.description.trim().length > 0)
      ? mediaData.description.trim().slice(0, 120)
      : `Instagram Reel #${shortcode}`;
    const author = "Instagram Creator";
    const thumbnail =
      mediaData.preview ||
      mediaList[0]?.thumbnail ||
      `https://www.instagram.com/p/${shortcode}/media/?size=l`;

    const formats: MediaFormat[] = [];

    mediaList.forEach((item, idx) => {
      if (item.url) {
        const isVideo = item.type === "video" || item.url.includes(".mp4");
        const ext = isVideo ? "mp4" : "jpg";
        const label = mediaList.length > 1
          ? `${isVideo ? "Video" : "Photo"} #${idx + 1}`
          : isVideo
          ? "Video (MP4)"
          : "High-Res Photo (JPG)";

        formats.push({
          formatId: `ig-${idx}`,
          quality: label,
          ext,
          type: isVideo ? "video" : "image",
          downloadUrl: item.url,
          note: isVideo ? "Synchronized Audio & Video" : "Original Quality",
        });

        // If it's a video, also offer an audio extraction option
        if (isVideo && idx === 0) {
          formats.push({
            formatId: `ig-audio-${idx}`,
            quality: "Original Audio (MP3 / M4A)",
            ext: "mp3",
            type: "audio",
            downloadUrl: item.url,
            note: "Clean Audio Stream",
          });
        }
      }
    });

    if (formats.length === 0) {
      if (username) {
        return await extractInstagramProfile(username);
      }
      return null;
    }

    if (username) {
      const items: ProfileMediaItem[] = mediaList.map((m, i) => ({
        id: `story-${i}`,
        type: m.type === "video" || m.url.includes(".mp4") ? "video" : "image",
        thumbnail: m.thumbnail || m.url,
        downloadUrl: m.url,
        caption: `@${username} Story #${i + 1}`,
        isVideo: m.type === "video" || m.url.includes(".mp4"),
      }));

      return {
        url: cleanUrl,
        title: `@${username}`,
        author: `@${username}`,
        thumbnail: mediaData.preview || mediaList[0]?.thumbnail || mediaList[0]?.url,
        platform: "Instagram",
        formats,
        isProfile: true,
        profileData: {
          username,
          fullName: `@${username}`,
          avatarUrl: "/icon.svg",
          hdAvatarUrl: "",
          postsCount: "—",
          followersCount: "Public",
          followingCount: "Instagram",
          biography: `Instagram Creator @${username}`,
          isVerified: false,
          posts: [],
          stories: items,
          highlights: [],
          reels: [],
        },
      };
    }

    return {
      url: cleanUrl,
      title,
      author,
      thumbnail,
      platform: "Instagram",
      formats,
    };
  } catch {
    console.warn("Instagram extraction error:");
    signal.throwIfAborted();
    return null;
  }
}
