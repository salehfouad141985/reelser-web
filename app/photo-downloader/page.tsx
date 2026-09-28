import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata = pageMetadata(
  "/photo-downloader",
  "Instagram Photo & Carousel Downloader",
  "Download photos and carousel images from public Instagram posts. Save the available images to your phone or computer with Reelser, without registration.",
);

export default function PhotoDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="photo"
        customTitle="Instagram Photo & Carousel Downloader"
        customDescription="Save photos and carousel images from public Instagram posts in the quality available from the source."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
