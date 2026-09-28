import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata = pageMetadata(
  "/reels",
  "Instagram Reels Downloader",
  "Download public Instagram Reels as MP4 videos with audio. Save available videos to your phone or computer with Reelser, free and without registration.",
);

export default function ReelsPage() {
  return (
    <>
      <HeroSection
        initialTab="reels"
        customTitle="Instagram Reels Downloader"
        customDescription="Save public Instagram Reels as MP4 videos with audio in the quality available from the source."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
