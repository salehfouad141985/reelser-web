import React from "react";
import Link from "next/link";
import { REELSER_PSEO_PAGES, type PseoPageConfig } from "@/lib/pseo-data";
import { TRANSLATED_SLUG_MATRIX } from "@/lib/localeRoutes";
import { CrossLanguageLinksBar } from "./CrossLanguageLinksBar";
import { ArrowRight, CheckCircle2, Layers, Sparkles, HelpCircle } from "lucide-react";

type HubCategory = "reels" | "story" | "photo" | "audio" | "profile";

interface HubMetadata {
  path: string;
  badge: string;
  heading: string;
  summary: string;
  supportedFormats: string[];
  highlights: { title: string; desc: string }[];
  specs: { label: string; value: string }[];
  faqs: { q: string; a: string }[];
}

const HUB_CONTENT: Record<HubCategory, HubMetadata> = {
  reels: {
    path: "/reels",
    badge: "Reels Hub & Utilities",
    heading: "Complete Instagram Reels Download & Conversion Suite",
    summary:
      "Our Reels Hub provides direct CDN extraction for public Instagram short-form vertical videos. Save original 1080p Full HD MP4 streams with synchronized stereo AAC audio, no watermarks, and full compatibility across iOS Safari, Android Chrome, Windows, and macOS.",
    supportedFormats: [
      "https://www.instagram.com/reel/{shortcode}/",
      "https://www.instagram.com/reels/{shortcode}/",
      "https://www.instagram.com/{username}/reel/{shortcode}/",
    ],
    highlights: [
      {
        title: "Uncompressed Source Stream",
        desc: "Downloads the exact MP4 container stored on Instagram CDN servers without re-encoding or frame drops.",
      },
      {
        title: "Clean Output Without Branding",
        desc: "Unlike screen recordings or watermarked apps, Reelser preserves the clean video frame with zero overlays.",
      },
      {
        title: "Synchronized Original Audio",
        desc: "Retains original creator voiceovers, trending music tracks, and stereo sound effects.",
      },
    ],
    specs: [
      { label: "Video Container", value: "MP4 (H.264 / AVC1)" },
      { label: "Audio Track", value: "AAC Stereo (128kbps – 256kbps)" },
      { label: "Resolution Support", value: "Up to 1080×1920 (Full HD Vertical)" },
      { label: "Maximum File Size", value: "Up to 64 MB per Reel" },
    ],
    faqs: [
      {
        q: "How do I save an Instagram Reel directly to my iPhone Photos app?",
        a: "Paste the Reel URL into Reelser in Safari, tap Download Video (MP4), open the Safari downloads menu, tap the saved video, and select 'Save Video' from the iOS share sheet.",
      },
      {
        q: "Why does Reelser keep the original quality of Instagram Reels?",
        a: "Reelser resolves the direct CDN video stream published by Instagram rather than transcoding the video, ensuring zero generation loss.",
      },
      {
        q: "Can I extract just the audio track from an Instagram Reel?",
        a: "Yes. Every Reel extracted on Reelser includes both a direct MP4 video download option and an MP3 audio extraction option.",
      },
    ],
  },
  story: {
    path: "/story-saver",
    badge: "Stories & Highlights Hub",
    heading: "Anonymous Instagram Story Saver & Highlight Archive Tools",
    summary:
      "Browse and download active 24-hour Instagram Stories and pinned Profile Highlights from any public account with 100% anonymity. Your username never appears in the creator's story viewer list, and no Instagram login is required.",
    supportedFormats: [
      "https://www.instagram.com/stories/{username}/{story_id}/",
      "https://www.instagram.com/stories/{username}/",
      "@username (Direct Public Handle Lookup)",
    ],
    highlights: [
      {
        title: "Zero Viewer Footprint",
        desc: "Stories are fetched through isolated proxy sessions so your personal account never registers a view.",
      },
      {
        title: "24-Hour Stories & Pinned Highlights",
        desc: "Save both expiring daily story clips and archived story highlights directly to your device.",
      },
      {
        title: "Photo & Video Story Support",
        desc: "Automatically detects whether each story slide is a high-resolution JPG photo or an MP4 video with music.",
      },
    ],
    specs: [
      { label: "Privacy Mode", value: "100% Anonymous (No Viewer List Entry)" },
      { label: "Supported Media", value: "Story Videos (MP4) & Story Photos (JPG)" },
      { label: "Input Methods", value: "Direct Story Link or @username" },
      { label: "Account Login", value: "Never Required" },
    ],
    faqs: [
      {
        q: "Will the account owner see that I viewed or downloaded their Instagram Story?",
        a: "No. Reelser retrieves public stories without using your Instagram account, so your profile never appears in their story viewers list.",
      },
      {
        q: "Can I view all active stories from a public username at once?",
        a: "Yes. Enter the public @username or profile link into the Story Saver tab to load all currently active story slides in one grid.",
      },
      {
        q: "Does Story Saver keep the background music sticker audio?",
        a: "Yes, video stories that contain embedded audio tracks are downloaded as MP4 files with their sound preserved.",
      },
    ],
  },
  photo: {
    path: "/photo-downloader",
    badge: "Photo & Carousel Hub",
    heading: "Full-Resolution Instagram Photo & Multi-Slide Carousel Downloader",
    summary:
      "Instagram prevents right-click saving and compresses mobile screenshots. Our Photo & Carousel Hub extracts the highest-resolution original JPEG/WebP images and multi-slide album posts (up to 20 slides per post) from any public link.",
    supportedFormats: [
      "https://www.instagram.com/p/{shortcode}/",
      "https://www.instagram.com/{username}/p/{shortcode}/",
      "Multi-slide mixed photo & video carousels",
    ],
    highlights: [
      {
        title: "Full Carousel Album Extraction",
        desc: "Unpacks every individual photo and video slide from multi-item Instagram carousel posts in one click.",
      },
      {
        title: "Native 1080px Width Resolution",
        desc: "Retrieves the largest available image variant from Instagram's servers instead of cropped thumbnails.",
      },
      {
        title: "Mixed Media Post Support",
        desc: "Seamlessly handles carousels that combine static photography and video clips in the same post.",
      },
    ],
    specs: [
      { label: "Image Formats", value: "Original JPG / WebP" },
      { label: "Carousel Capacity", value: "Up to 20 Slides per Post" },
      { label: "Aspect Ratios", value: "Square (1:1), Portrait (4:5), Landscape (1.91:1)" },
      { label: "Max Width", value: "1080px Native Source Quality" },
    ],
    faqs: [
      {
        q: "How do I download all photos from an Instagram carousel post?",
        a: "Paste the carousel post link (/p/...) into Reelser. All individual slides will appear in a grid so you can preview and save any or all images in full resolution.",
      },
      {
        q: "Why is downloading with Reelser better than taking a screenshot?",
        a: "Screenshots capture UI overlays, status bars, and screen compression. Reelser downloads the raw 1080p image file directly from Instagram's CDN.",
      },
      {
        q: "Can I download a single photo from the middle of a slideshow?",
        a: "Yes. Reelser lists each slide separately with its own preview and download button.",
      },
    ],
  },
  audio: {
    path: "/audio-downloader",
    badge: "Audio & MP3 Hub",
    heading: "Instagram Reels to MP3 Converter & Original Audio Extractor",
    summary:
      "Convert any public Instagram Reel, video post, or IGTV clip into a clean, standalone MP3 audio file. Built on an isolated server-side FFmpeg audio pipeline for instant MP4-to-MP3 demuxing and encoding.",
    supportedFormats: [
      "Instagram Reels Audio to MP3",
      "Original Creator Voiceovers & Podcasts",
      "Trending Background Music & Sound Effects",
    ],
    highlights: [
      {
        title: "Server-Side FFmpeg Conversion",
        desc: "Extracts and encodes the audio stream on our servers so your mobile browser doesn't waste battery or CPU.",
      },
      {
        title: "Universal MP3 Compatibility",
        desc: "Produces standard ID3-compliant MP3 files that play natively on iOS Files, Android Music players, and desktop DAWs.",
      },
      {
        title: "High-Bitrate Stereo Output",
        desc: "Preserves the dynamic range and clarity of speech, music, and ambient audio from the source video.",
      },
    ],
    specs: [
      { label: "Output Format", value: "MP3 (audio/mpeg)" },
      { label: "Encoder Engine", value: "Isolated Server-Side FFmpeg" },
      { label: "Channels", value: "2-Channel Stereo" },
      { label: "Max Source Duration", value: "Up to 24 MB Converted Audio Output" },
    ],
    faqs: [
      {
        q: "How do I convert an Instagram Reel to an MP3 file?",
        a: "Copy the link to the Instagram Reel, paste it into the Audio Downloader tab on Reelser, and click 'Download Audio (MP3)' to convert and save the soundtrack.",
      },
      {
        q: "Do I need to install any software to extract Instagram audio?",
        a: "No. Audio extraction happens entirely in the cloud and delivers a ready-to-play .mp3 file to your browser.",
      },
      {
        q: "Can I use extracted MP3 files for offline listening?",
        a: "Yes, downloaded MP3 files are stored locally on your phone or computer and can be played offline anytime.",
      },
    ],
  },
  profile: {
    path: "/profile-downloader",
    badge: "Profile & DP Hub",
    heading: "Instagram Profile Viewer & Full-Size HD Profile Picture (DP) Downloader",
    summary:
      "Instagram restricts profile pictures to tiny circular thumbnails in the app. Use our Profile Hub to view and download full-size HD Instagram Display Pictures (DP), inspect public bios, and browse recent posts, reels, and active stories by @username.",
    supportedFormats: [
      "@username (e.g. @nasa, @instagram)",
      "https://www.instagram.com/{username}/",
      "Public Creator & Brand Profiles",
    ],
    highlights: [
      {
        title: "Full-Size Uncropped Avatar (DP)",
        desc: "Fetches the square, uncropped profile picture instead of the tiny 150×150 circular thumbnail.",
      },
      {
        title: "All-in-One Public Profile Explorer",
        desc: "View account statistics, biography, recent feed posts, reels, and active stories in one unified interface.",
      },
      {
        title: "No Instagram Account Required",
        desc: "Browse public profiles without hitting Instagram's login wall or app prompts.",
      },
    ],
    specs: [
      { label: "Avatar Output", value: "Uncropped Square JPG Image" },
      { label: "Profile Sections", value: "Posts, Reels, Active Stories & Highlights" },
      { label: "Lookup Format", value: "@username or Profile URL" },
      { label: "Access Policy", value: "Public Instagram Accounts Only" },
    ],
    faqs: [
      {
        q: "How can I view someone's Instagram profile picture in full size?",
        a: "Type their @username or paste their profile URL into the Profile Downloader tab on Reelser. You can view and download the full-size square avatar immediately.",
      },
      {
        q: "Can I browse a public Instagram profile without logging in?",
        a: "Yes. Entering a public @username loads their profile header, biography, recent posts, reels, and active stories without requiring an Instagram account.",
      },
      {
        q: "Does Reelser work with private Instagram profiles?",
        a: "No. To protect user privacy, Reelser only accesses publicly available Instagram profiles and media.",
      },
    ],
  },
};

export function CategoryHubSection({ category }: { category: HubCategory }) {
  const hub = HUB_CONTENT[category];
  const hubRow = TRANSLATED_SLUG_MATRIX.find((r) => r.categoryHub === hub.path);
  const clusterPages: PseoPageConfig[] = Object.values(REELSER_PSEO_PAGES).filter(
    (page) => page.category === category,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://reelser.com${hub.path}#webpage`,
        url: `https://reelser.com${hub.path}`,
        name: hub.heading,
        description: hub.summary,
        breadcrumb: {
          "@id": `https://reelser.com${hub.path}#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://reelser.com${hub.path}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://reelser.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: hub.badge,
            item: `https://reelser.com${hub.path}`,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `https://reelser.com${hub.path}#app`,
        name: `${hub.heading} | Reelser`,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "iOS, Android, Windows, macOS, Linux",
        url: `https://reelser.com${hub.path}`,
        description: hub.summary,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: hub.highlights.map((h) => h.title),
      },
      {
        "@type": "ItemList",
        "@id": `https://reelser.com${hub.path}#itemlist`,
        name: `${hub.badge} Tools & Guides`,
        numberOfItems: clusterPages.length,
        itemListElement: clusterPages.map((page, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: page.h1,
          url: `https://reelser.com/${page.slug}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `https://reelser.com${hub.path}#faq`,
        mainEntity: hub.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="bg-white border-t border-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Category Pillar Overview & Supported Formats */}
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-1">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
              <li>
                <Link href="/" className="hover:text-pink-600 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-900 font-semibold">{hub.badge}</li>
            </ol>
          </nav>
          <CrossLanguageLinksBar enSlug={hubRow?.en} currentLocale="en" />
        </div>
      </div>
      <section className="py-12 sm:py-16 bg-gradient-to-b from-pink-50/40 via-white to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{hub.badge}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight">
              {hub.heading}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              {hub.summary}
            </p>
          </div>

          {/* 3 Unique Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hub.highlights.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs hover:border-pink-200 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Technical Specs & Supported Link Patterns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50/80 rounded-2xl border border-gray-200/80 p-6 space-y-4">
              <h3 className="text-base font-black text-gray-900">
                Technical Specifications
              </h3>
              <dl className="divide-y divide-gray-200/70">
                {hub.specs.map((spec, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-sm">
                    <dt className="font-semibold text-gray-600">{spec.label}</dt>
                    <dd className="font-bold text-gray-900 text-right">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="bg-gray-50/80 rounded-2xl border border-gray-200/80 p-6 space-y-4">
              <h3 className="text-base font-black text-gray-900">
                Supported Instagram Inputs
              </h3>
              <p className="text-xs text-gray-500">
                Paste any of the following link formats directly into the search bar above:
              </p>
              <ul className="space-y-2.5">
                {hub.supportedFormats.map((pattern, idx) => (
                  <li
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 font-mono text-xs text-pink-700 break-all"
                  >
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Category FAQ Section */}
      <section className="py-12 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Category FAQ</span>
            </span>
            <h2 className="text-2xl font-black text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {hub.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-2"
              >
                <h3 className="text-base font-bold text-gray-900">{faq.q}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topic Cluster Internal Linking Hub (All pSEO Pages in this Category) */}
      <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-50 text-pink-700">
              <Layers className="w-3.5 h-3.5" />
              <span>Specialized Tools & Guides ({clusterPages.length})</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-3">
              Explore All {hub.badge}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Dedicated tools and step-by-step guides for every device, format, and use case.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusterPages.map((item) => (
              <Link
                key={item.slug}
                href={`/${item.slug}`}
                className="flex flex-col p-5 rounded-2xl bg-gray-50/70 border border-gray-200/80 hover:bg-white hover:border-pink-300 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                    {item.badge}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                  {item.h1}
                </h3>
                <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
