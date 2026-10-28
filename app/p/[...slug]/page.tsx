import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { HowToSection } from "@/components/HowToSection";

interface ShortcutPageProps {
  params: Promise<{ slug: string[] }>;
}

export const metadata: Metadata = {
  title: "Download Instagram Post & Carousel - Direct Shortcut | Reelser",
  description: "Direct URL shortcut to download this public Instagram photo, video, or carousel post in Full HD.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function PostShortcutPage({ params }: ShortcutPageProps) {
  const { slug } = await params;
  const igUrl = `https://www.instagram.com/p/${slug.join("/")}/`;

  return (
    <>
      <HeroSection
        initialTab="photo"
        initialUrl={igUrl}
        customTitle="Direct Instagram Post & Carousel Downloader"
        customDescription="We detected your Instagram post link automatically and started extracting all photos and videos in HD."
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
