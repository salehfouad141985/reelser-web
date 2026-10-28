import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { Film, Video, Image as ImageIcon, Music, UserCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description:
    "The page you requested could not be found. Use the Reelser Instagram Downloader below to save Reels, Stories, Photos, Profile Pictures, and MP3 Audio.",
  robots: {
    index: false,
    follow: true,
  },
};

const QUICK_HUBS = [
  {
    href: "/reels",
    title: "Instagram Reels Downloader",
    desc: "Save public Reels in 1080p Full HD MP4 without watermark.",
    icon: Film,
  },
  {
    href: "/story-saver",
    title: "Anonymous Story Saver",
    desc: "View and download 24-hour Stories & Highlights anonymously.",
    icon: Video,
  },
  {
    href: "/photo-downloader",
    title: "Photo & Carousel Downloader",
    desc: "Extract original HD photos and multi-slide albums.",
    icon: ImageIcon,
  },
  {
    href: "/audio-downloader",
    title: "Instagram to MP3 Converter",
    desc: "Convert Reels & video soundtracks into stereo MP3 files.",
    icon: Music,
  },
  {
    href: "/profile-downloader",
    title: "Profile Picture (DP) Viewer",
    desc: "Zoom and download full-size HD Instagram avatars by @username.",
    icon: UserCheck,
  },
];

export default function NotFound() {
  return (
    <div className="bg-white">
      <HeroSection
        initialTab="reels"
        customTitle="404 — Page Not Found, Download From Instagram Below"
        customDescription="The link you followed may have moved, or you can paste any Instagram Reel, Story, Photo, or @username below to start downloading right away."
      />

      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="en" />
        </div>
      </div>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-gray-900">
              Explore Our Main Instagram Tool Hubs
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a dedicated tool below or return to the homepage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_HUBS.map((hub) => {
              const Icon = hub.icon;
              return (
                <Link
                  key={hub.href}
                  href={hub.href}
                  className="flex flex-col p-5 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:bg-white hover:border-pink-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {hub.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {hub.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
