import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Instagram Photo Downloader - Download Photos & Carousels in High-Res",
  description:
    "Download Instagram pictures and multiple carousel slides in original high-resolution JPG. 100% free with no compression.",
  alternates: {
    canonical: "https://reelser.com/photo-downloader",
  },
};

export default function PhotoDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="photo"
        customTitle="Instagram Photo & Carousel Downloader"
        customDescription="Save high-resolution pictures and multiple photos from carousel posts in original crisp quality without login."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
