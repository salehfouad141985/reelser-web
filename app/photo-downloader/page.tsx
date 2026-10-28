import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { CategoryHubSection } from "@/components/CategoryHubSection";
import { HowToSection } from "@/components/HowToSection";

export const metadata = pageMetadata(
  "/photo-downloader",
  "Instagram Photo & Carousel Downloader Hub - Full 1080p Resolution",
  "Download full-resolution photos and multi-slide carousel albums from public Instagram posts. Save original JPG images without compression or screenshots.",
);

export default function PhotoDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="photo"
        customTitle="Instagram Photo & Carousel Downloader Hub"
        customDescription="Extract native 1080p photos and multi-slide carousel albums from public Instagram posts in one click."
      />
      <CategoryHubSection category="photo" />
      <HowToSection />
    </>
  );
}
