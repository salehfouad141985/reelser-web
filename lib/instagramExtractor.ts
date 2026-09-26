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

  // If starts with @, e.g. @cristiano or @user.name
  if (trimmed.startsWith("@")) {
    const candidate = trimmed.slice(1).trim();
    if (/^[a-zA-Z0-9._]{1,30}$/.test(candidate)) {
      return candidate;
    }
  }

  // If story URL like instagram.com/stories/username/
  const storyMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/stories\/([a-zA-Z0-9._]{1,30})\/?(?:\?.*)?$/i);
  if (storyMatch) {
    return storyMatch[1].toLowerCase();
  }

  // If profile URL like instagram.com/username or https://www.instagram.com/username/
  const profileMatch = trimmed.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]{1,30})\/?(?:\?.*)?$/i);
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
  if (/https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|reels|tv|stories|share)\/([\w.-]+)/i.test(trimmed)) {
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
  const defaultAvatar = `https://www.instagram.com/${clean}/media/?size=l`;

  return {
    url: `https://www.instagram.com/${clean}/`,
    title: `@${clean}`,
    author: `@${clean}`,
    thumbnail: defaultAvatar,
    platform: "Instagram",
    formats: [
      {
        formatId: "ig-avatar-hd",
        quality: "Full HD Profile Picture (Original JPG)",
        ext: "jpg",
        type: "image",
        downloadUrl: defaultAvatar,
        note: `Profile avatar of @${clean}`,
      },
    ],
    isProfile: true,
    profileData: {
      username: clean,
      fullName: `@${clean}`,
      avatarUrl: defaultAvatar,
      hdAvatarUrl: defaultAvatar,
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

export async function extractInstagramProfile(username: string): Promise<MediaResult | null> {
  const clean = username.replace(/^@/, "").replace(/\/$/, "").trim();
  if (!clean) return null;

  try {
    const res = await fetch(`https://www.instagram.com/${clean}/`, {
      headers: {
        "User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return createFallbackProfileResult(clean);
    }

    const html = await res.text();
    const { load } = await import("cheerio");
    const $ = load(html);

    const ogImg =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      (html.match(/property="og:image"\s+content="([^"]+)"/) || [])[1] ||
      (html.match(/content="([^"]+)"\s+property="og:image"/) || [])[1] ||
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

    if (!ogImg && !ogTitle) {
      return createFallbackProfileResult(clean);
    }

    const cleanImg = ogImg ? ogImg.replace(/&amp;/g, "&") : "";
    const hdMatch = html.match(/"profile_pic_url_hd":"([^"]+)"/) || html.match(/"profile_pic_url":"([^"]+)"/);
    let hdImg = cleanImg;
    if (hdMatch) {
      try {
        hdImg = JSON.parse(`"${hdMatch[1]}"`);
      } catch {
        hdImg = hdMatch[1];
      }
    }

    // Decode full title and name
    const decodedTitle = decodeHtmlEntities(ogTitle || "");
    let displayName = clean;
    if (decodedTitle) {
      const matchName = decodedTitle.match(/^([^(]+)/);
      if (matchName) displayName = matchName[1].trim();
    }

    // Decode stats from og:description
    const decodedDesc = decodeHtmlEntities(ogDesc || "");
    const followersCount = (decodedDesc.match(/([\d.,]+[KkMmBb]?)\s+Followers/i) || [])[1] || "";
    const followingCount = (decodedDesc.match(/([\d.,]+[KkMmBb]?)\s+Following/i) || [])[1] || "";
    const postsCount = (decodedDesc.match(/([\d.,]+[KkMmBb]?)\s+Posts/i) || [])[1] || "";

    const bioText = decodedDesc
      ? decodedDesc.replace(/[\d.,]+[KkMmBb]?\s+Followers,\s+[\d.,]+[KkMmBb]?\s+Following,\s+[\d.,]+[KkMmBb]?\s+Posts\s*-\s*See\s+Instagram\s+photos\s+and\s+videos\s+from\s+/i, "").replace(new RegExp(`^${displayName}\\s*\\(@${clean}\\)`, "i"), "").trim()
      : "";

    const formats: MediaFormat[] = [];
    if (hdImg) {
      formats.push({
        formatId: "ig-avatar-hd",
        quality: "Full HD Profile Picture (Original JPG)",
        ext: "jpg",
        type: "image",
        downloadUrl: hdImg,
        note: `Profile avatar of @${clean}`,
      });
    }

    if (cleanImg && cleanImg !== hdImg) {
      formats.push({
        formatId: "ig-avatar-sd",
        quality: "Standard Profile Picture (JPG)",
        ext: "jpg",
        type: "image",
        downloadUrl: cleanImg,
        note: "Standard Quality",
      });
    }

    // Build rich ProfileData
    const profileData: ProfileData = {
      username: clean,
      fullName: displayName,
      avatarUrl: hdImg || cleanImg,
      hdAvatarUrl: hdImg || cleanImg,
      postsCount: postsCount || "0",
      followersCount: followersCount || "0",
      followingCount: followingCount || "0",
      biography: bioText || `${displayName} on Instagram (@${clean})`,
      isVerified: decodedTitle.includes("Verified") || html.includes('"is_verified":true'),
      posts: [],
      stories: [],
      highlights: [],
      reels: [],
    };

    return {
      url: `https://www.instagram.com/${clean}/`,
      title: `${displayName} (@${clean})`,
      author: `@${clean}`,
      thumbnail: hdImg || cleanImg,
      platform: "Instagram",
      formats,
      isProfile: true,
      profileData,
    };
  } catch (err: any) {
    console.warn("Instagram profile extraction error:", err?.message || err);
    return null;
  }
}

export async function extractInstagramMedia(inputUrl: string): Promise<MediaResult | null> {
  const cleanUrl = inputUrl.trim();
  if (!cleanUrl) return null;

  // Check if the input is a pure username or a profile URL
  const username = extractInstagramUsername(cleanUrl);
  const isPostOrReel = /(?:instagram\.com\/(?:p|reel|reels|tv|share)\/)/i.test(cleanUrl);

  if (username && !isPostOrReel && !cleanUrl.includes("/stories/")) {
    const profileResult = await extractInstagramProfile(username);
    if (profileResult && profileResult.formats.length > 0) {
      return profileResult;
    }
  }

  try {
    const { snapsave } = await import("snapsave-media-downloader");
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout during Instagram extraction")), 8000);
    });

    const targetUrl = cleanUrl.startsWith("@")
      ? `https://www.instagram.com/stories/${cleanUrl.slice(1)}/`
      : cleanUrl;

    const res: any = await Promise.race([snapsave(targetUrl), timeoutPromise]);
    const mediaData = res?.data;

    if (!mediaData || !Array.isArray(mediaData.media) || mediaData.media.length === 0) {
      // If snapsave failed, but we have a username, fall back to profile extraction
      if (username) {
        return await extractInstagramProfile(username);
      }
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

    mediaList.forEach((item: any, idx: number) => {
      if (item.url) {
        const isVideo = item.type === "video" || item.url.includes(".mp4");
        const ext = isVideo ? "mp4" : "jpg";
        const label = mediaList.length > 1
          ? `${isVideo ? "Video" : "Photo"} #${idx + 1}`
          : isVideo
          ? "Full HD Video (1080p MP4)"
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
      const items: ProfileMediaItem[] = mediaList.map((m: any, i: number) => ({
        id: `story-${i}`,
        type: m.type === "video" || (m.url && m.url.includes(".mp4")) ? "video" : "image",
        thumbnail: m.thumbnail || m.url,
        downloadUrl: m.url,
        caption: `@${username} Story #${i + 1}`,
        likes: "HD",
        comments: "",
        timestamp: "Active Story",
        isVideo: m.type === "video" || (m.url && m.url.includes(".mp4")),
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
          avatarUrl: mediaData.preview || mediaList[0]?.thumbnail || mediaList[0]?.url,
          hdAvatarUrl: mediaData.preview || mediaList[0]?.thumbnail || mediaList[0]?.url,
          postsCount: `${mediaList.length}`,
          followersCount: "Public",
          followingCount: "Instagram",
          biography: `Instagram Creator @${username}`,
          isVerified: false,
          posts: items,
          stories: items,
          highlights: [],
          reels: items,
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
  } catch (err: any) {
    console.warn("Instagram extraction error:", err?.message || err);
    if (username) {
      return await extractInstagramProfile(username);
    }
    return null;
  }
}
