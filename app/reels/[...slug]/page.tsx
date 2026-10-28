import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { HowToSection } from "@/components/HowToSection";

interface ShortcutPageProps {
  params: Promise<{ slug: string[] }>;
}

export const metadata: Metadata = {
  title: "Download Instagram Reel - Direct Shortcut | Reelser",
  description: "Direct URL shortcut to download this public Instagram Reel in Full HD MP4 without watermark.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ReelsPluralShortcutPage({ params }: ShortcutPageProps) {
  const { slug } = await params;
  const igUrl = `https://www.instagram.com/reels/${slug.join("/")}/`;

  return (
    <>
      <HeroSection
        initialTab="reels"
        initialUrl={igUrl}
        customTitle="Direct Instagram Reel Downloader"
        customDescription="We detected your Instagram Reel link automatically and started extracting the Full HD MP4 stream."
      />
      <div className="bg-gray-50 border-b border-gray-100 py-2.5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CrossLanguageLinksBar currentLocale="en" />
        </div>
      </div>
      <HowToSection />
    </>
  );
}
