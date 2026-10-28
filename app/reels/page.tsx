import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { CategoryHubSection } from "@/components/CategoryHubSection";
import { HowToSection } from "@/components/HowToSection";

export const metadata = pageMetadata(
  "/reels",
  "Instagram Reels Hub - Download 1080p MP4 Reels Online",
  "Save public Instagram Reels as Full HD MP4 videos with original stereo audio. Explore all Reels downloaders, converters, and device guides on Reelser.",
);

export default function ReelsPage() {
  return (
    <>
      <HeroSection
        initialTab="reels"
        customTitle="Instagram Reels Downloader Hub"
        customDescription="Save public Instagram Reels as Full HD MP4 videos with original stereo audio on iPhone, Android, or PC."
      />
      <CategoryHubSection category="reels" />
      <HowToSection />
    </>
  );
}
