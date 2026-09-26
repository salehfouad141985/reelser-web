const fs = require('fs');
const path = require('path');

const csvPath = process.argv[2];
if (!csvPath || !fs.existsSync(csvPath)) { console.error("Usage: node " + process.argv[1] + " <keyword-export.tsv> [utf8|utf16le]"); process.exit(1); }
const buffer = fs.readFileSync(csvPath);
const encoding = process.argv[3] || (buffer[0] === 255 && buffer[1] === 254 ? "utf16le" : "utf8");
if (!["utf8", "utf16le"].includes(encoding)) throw new Error("Unsupported encoding");
const text = buffer.toString(encoding).replace(/^\uFEFF/, "");
const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

// Key downloader search patterns
const categories = {
  reels: {
    title: "Instagram Reels Downloader",
    description: "Download Instagram Reels in Full HD 1080p MP4 with original crystal-clear audio. Fast, free, and no watermark.",
    type: "reels",
    keywords: [],
  },
  video: {
    title: "Instagram Video Downloader",
    description: "Free online Instagram video downloader. Download Instagram videos in high-definition MP4 without watermark.",
    type: "reels",
    keywords: [],
  },
  story: {
    title: "Instagram Story & Highlights Saver",
    description: "Download Instagram Stories and Highlights anonymously in original high quality before they expire.",
    type: "story",
    keywords: [],
  },
  photo: {
    title: "Instagram Photo & Carousel Downloader",
    description: "Download Instagram pictures, photos, and carousel albums in original high-resolution JPG.",
    type: "photo",
    keywords: [],
  },
  audio: {
    title: "Instagram Audio & Reels MP3 Extractor",
    description: "Extract and download audio tracks, background music, and songs from Instagram Reels in high-quality MP3 format.",
    type: "audio",
    keywords: [],
  },
  profile: {
    title: "Instagram Profile Picture (DP) Downloader",
    description: "View, zoom, and download any public Instagram avatar or profile picture (DP) in full resolution HD.",
    type: "profile",
    keywords: [],
  },
  mp4: {
    title: "Instagram to MP4 Converter",
    description: "Convert Instagram video and reel links to high-definition MP4 online for free. Works on iPhone, Android, and PC.",
    type: "reels",
    keywords: [],
  },
  nowm: {
    title: "Instagram Downloader Without Watermark",
    description: "Save Instagram Reels and videos cleanly without any watermark or logo in 1080p Full HD.",
    type: "reels",
    keywords: [],
  },
  saveinsta: {
    title: "SaveInsta Alternative - Free Instagram Downloader",
    description: "The best SaveInsta alternative. Download Instagram Reels, Stories, Photos, and Videos in Full HD.",
    type: "reels",
    keywords: [],
  },
  ssinstagram: {
    title: "SSInstagram Alternative - Instagram Media Downloader",
    description: "Fastest SSInstagram alternative to download Instagram Reels, Stories, Photos, and Videos online.",
    type: "reels",
    keywords: [],
  },
  snapinsta: {
    title: "SnapInsta Alternative - Fast Instagram Downloader",
    description: "High-speed SnapInsta alternative. Save Instagram Reels, Videos, Stories, and DP in 1080p MP4/JPG.",
    type: "reels",
    keywords: [],
  },
};

// Slugs mapping to predefined landing pages
const slugMap = [
  // High volume Reels
  { slug: "instagram-reels-download", category: "reels", match: ["instagram reels download", "download instagram reels", "reels download", "ig reels download", "download reels", "reels downloader", "reels video download", "save reels"] },
  { slug: "download-instagram-reels", category: "reels", match: ["download instagram reels", "download ig reels", "download reels instagram", "download reels video", "download instagram reel"] },
  { slug: "reels-downloader", category: "reels", match: ["reels downloader", "reels downloader hd", "ig reels downloader", "online reel downloader", "instagram reel downloader"] },
  { slug: "save-instagram-reels", category: "reels", match: ["save instagram reels", "save reels ig", "save reels", "save reel", "save ig reels", "save reels from instagram"] },
  { slug: "instagram-reels-video-download", category: "reels", match: ["instagram reels video download", "instagram reel video download", "reels video download instagram", "instagram reels video"] },
  { slug: "instagram-reels-without-watermark", category: "nowm", match: ["instagram reels without watermark", "download instagram reels without watermark", "reels without watermark", "save reel without watermark", "reels download no watermark"] },
  { slug: "instagram-reels-download-online", category: "reels", match: ["instagram reels download online", "download instagram reels online", "reels download online free", "online reels downloader"] },
  { slug: "reels-download-hd", category: "reels", match: ["reels download hd", "instagram reels download 1080p", "instagram reels hd download", "reels 4k download", "instagram reels download 4k"] },
  { slug: "download-reels-by-link", category: "reels", match: ["download reels by link", "copy link instagram reels download", "instagram reels link download", "download instagram reels with link"] },

  // High volume Videos
  { slug: "instagram-video-download", category: "video", match: ["instagram video download", "download video ig", "instagram video", "download instagram video", "ig video download", "video download instagram"] },
  { slug: "download-instagram-video", category: "video", match: ["download instagram video", "download video from instagram", "download ig video", "download video instagram", "video download from instagram"] },
  { slug: "instagram-video-downloader", category: "video", match: ["instagram video downloader", "ig video downloader", "video downloader for instagram", "best instagram video downloader"] },
  { slug: "save-instagram-video", category: "video", match: ["save instagram video", "save video ig", "save video from instagram", "save video instagram", "save ig video"] },
  { slug: "instagram-video-download-hd", category: "video", match: ["instagram video download hd", "instagram video 1080p download", "download video instagram 1080p", "instagram video download 4k", "download instagram video hd"] },
  { slug: "instagram-video-without-watermark", category: "nowm", match: ["instagram video without watermark", "download instagram video without watermark", "instagram video download no watermark", "download video ig tanpa watermark"] },
  { slug: "instagram-to-mp4", category: "mp4", match: ["instagram to mp4", "convert instagram to mp4", "convert ig to mp4", "instagram video to mp4", "instagram link to mp4", "instagram to mp4 1080p"] },
  { slug: "download-instagram-video-by-link", category: "video", match: ["download instagram video by link", "instagram copy link video download", "download video from instagram link", "instagram video link download"] },

  // High volume Stories & Highlights
  { slug: "story-saver", category: "story", match: ["story saver", "instagram story saver", "ig story saver", "story saver instagram", "stories saver", "story saver net", "saver story"] },
  { slug: "instagram-story-download", category: "story", match: ["instagram story download", "download ig story", "download instagram story", "story download instagram", "ig story download", "download story ig"] },
  { slug: "storiesig-viewer", category: "story", match: ["storiesig", "storiesig viewer", "stories ig", "storiesig net", "storiesig app"] },
  { slug: "instagram-highlights-download", category: "story", match: ["instagram highlights download", "download highlight instagram", "download ig highlight", "highlight saver instagram", "instagram story highlight download"] },
  { slug: "anonymous-instagram-story-viewer", category: "story", match: ["anonymously instagram story viewer", "view anonymous instagram story", "instagram story viewer anonymously", "instagram stalker story viewer"] },
  { slug: "instagram-story-download-with-music", category: "story", match: ["instagram story download with music", "save instagram story with music", "download instagram story with audio", "instagram story with song download"] },

  // High volume Photos & Posts
  { slug: "instagram-photo-download", category: "photo", match: ["instagram photo download", "save instagram photos", "instagram picture download", "instagram pic download", "download photo from instagram", "ig photo download"] },
  { slug: "download-instagram-post", category: "photo", match: ["download instagram post", "download post instagram", "download post from instagram", "save instagram posts", "instagram post saver"] },
  { slug: "instagram-carousel-download", category: "photo", match: ["download instagram carousel", "download multiple instagram photos", "instagram album download", "instagram multi photo download"] },

  // Profile Picture (DP)
  { slug: "instagram-dp-download", category: "profile", match: ["instagram dp download", "insta dp", "instagram profile picture download", "ig dp viewer", "insta dp download", "instagram pfp download"] },
  { slug: "instagram-profile-picture-viewer", category: "profile", match: ["instagram profile picture viewer", "insta dp viewer", "instagram profile picture full size", "view full size instagram dp", "instagram profile photo download"] },

  // Audio & MP3
  { slug: "instagram-audio-download", category: "audio", match: ["instagram audio download", "download reels audio", "instagram mp3", "instagram reels song download", "instagram music download", "download song from instagram"] },
  { slug: "instagram-reels-song-download", category: "audio", match: ["instagram reels song download", "instagram reels audio download", "download reels with audio", "reels song download", "download audio from instagram"] },

  // Competitor Brand Alternatives
  { slug: "saveinsta-alternative", category: "saveinsta", match: ["saveinsta", "save insta", "saveinsta com", "saveinsta app", "saveinsta download", "saveinsta reel"] },
  { slug: "ssinstagram-alternative", category: "ssinstagram", match: ["ssinstagram", "sssinstagram", "ss instagram", "sss instagram", "sssinstagram download", "ssinstagram reels"] },
  { slug: "snapinsta-alternative", category: "snapinsta", match: ["snapinsta", "snap insta", "snapinsta app", "snapinsta download", "snap insta video download"] },
  { slug: "snaptik-instagram", category: "reels", match: ["snaptik instagram", "snaptik for instagram", "snaptik reels", "snaptik ig"] },
  { slug: "fastsave-instagram", category: "reels", match: ["fastsave for instagram", "fast save", "fastsave apk", "fastsave app download"] },
  { slug: "indown-alternative", category: "reels", match: ["indown", "indown io", "indown download", "indown reels"] }
];

console.log("Configured pSEO Slugs:", slugMap.length);

// Extract keywords from CSV into matching slugs
for (let i = 3; i < lines.length; i++) {
  const parts = lines[i].split('\t');
  if (parts.length >= 3) {
    const kw = parts[0].trim().toLowerCase();
    const volume = parseInt(parts[2].replace(/[^0-9]/g, ''), 10) || 0;
    if (!kw || volume <= 0) continue;

    for (const item of slugMap) {
      if (item.match.some(m => kw.includes(m) || m.includes(kw))) {
        if (!categories[item.category].keywords.includes(kw)) {
          categories[item.category].keywords.push(kw);
        }
      }
    }
  }
}

// Generate the TypeScript dataset file
let code = `export interface PseoPageConfig {
  slug: string;
  category: "reels" | "story" | "photo" | "audio" | "profile";
  h1: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const REELSER_PSEO_PAGES: Record<string, PseoPageConfig> = {
`;

slugMap.forEach(({ slug, category }) => {
  const cat = categories[category];
  const pageTitle = `${cat.title} - Reelser`;
  const metaDesc = cat.description;
  const kwList = cat.keywords.slice(0, 30);

  code += `  "${slug}": {
    slug: "${slug}",
    category: "${cat.type}",
    h1: "${cat.title}",
    metaTitle: "${pageTitle}",
    metaDescription: "${metaDesc}",
    keywords: ${JSON.stringify(kwList)},
  },
`;
});

code += `};
`;

const outputPath = path.join(__dirname, '..', 'lib', 'pseo-data.ts');
fs.writeFileSync(outputPath, code, 'utf8');
console.log("SUCCESS: Created lib/pseo-data.ts with", slugMap.length, "high-volume keyword landing pages!");
