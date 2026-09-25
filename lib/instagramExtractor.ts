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

export function isValidInstagramUrl(url: string): boolean {
  if (!url) return false;
  return /https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|reels|tv|stories|share)\/([\w.-]+)/i.test(url.trim());
}

export async function extractInstagramMedia(inputUrl: string): Promise<MediaResult | null> {
  const cleanUrl = inputUrl.trim();
  if (!cleanUrl) return null;

  try {
    const { snapsave } = await import("snapsave-media-downloader");
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Timeout during Instagram extraction")), 8000);
    });

    const res: any = await Promise.race([snapsave(cleanUrl), timeoutPromise]);
    const mediaData = res?.data;

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

    if (formats.length === 0) return null;

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
    return null;
  }
}
