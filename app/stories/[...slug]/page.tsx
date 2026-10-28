import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { CrossLanguageLinksBar } from "@/components/CrossLanguageLinksBar";
import { HowToSection } from "@/components/HowToSection";

interface ShortcutPageProps {
  params: Promise<{ slug: string[] }>;
}

export const metadata: Metadata = {
  title: "Download Instagram Story Anonymously - Direct Shortcut | Reelser",
  description: "Direct URL shortcut to view and download this public Instagram Story anonymously in Full HD.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function StoryShortcutPage({ params }: ShortcutPageProps) {
  const { slug } = await params;
  const igUrl = `https://www.instagram.com/stories/${slug.join("/")}/`;

  return (
    <>
      <HeroSection
        initialTab="story"
        initialUrl={igUrl}
        customTitle="Anonymous Instagram Story Downloader"
        customDescription="We detected your Instagram Story link automatically and started loading the story anonymously."
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
