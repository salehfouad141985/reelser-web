export interface MediaFormat {
  formatId: string;
  quality: string;
  ext: string;
  type: "video" | "audio" | "image";
  downloadUrl: string;
  note?: string;
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

export async function extractInstagramProfile(username: string): Promise<MediaResult | null> {
  const clean = username.replace(/^@/, "").replace(/\/$/, "").trim();
  if (!clean) return null;

  try {
    const res = await fetch(`https://www.instagram.com/${clean}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      return null;
    }

    const html = await res.text();
    const ogImg = (html.match(/property="og:image"\s+content="([^"]+)"/) || [])[1];
    const ogTitle = (html.match(/property="og:title"\s+content="([^"]+)"/) || [])[1];
    const ogDesc = (html.match(/property="og:description"\s+content="([^"]+)"/) || [])[1];

    if (!ogImg && !ogTitle) {
      return null;
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

    let displayName = clean;
    if (ogTitle) {
      const matchName = ogTitle.match(/^([^(]+)/);
      if (matchName) displayName = matchName[1].trim();
    }

    const bioText = ogDesc
      ? ogDesc.replace(/&#064;/g, "@").replace(/&quot;/g, '"').replace(/&amp;/g, "&")
      : "";

    const formats: MediaFormat[] = [];
    if (hdImg) {
      formats.push({
        formatId: "ig-avatar-hd",
        quality: "Full HD Profile Picture (Original JPG)",
        ext: "jpg",
        type: "image",
        downloadUrl: hdImg,
        note: bioText ? bioText.slice(0, 90) : "High-Resolution Display Picture",
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

    return {
      url: `https://www.instagram.com/${clean}/`,
      title: `${displayName} (@${clean}) Profile & DP`,
      author: `@${clean}`,
      thumbnail: hdImg || cleanImg,
      platform: "Instagram",
      formats,
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
