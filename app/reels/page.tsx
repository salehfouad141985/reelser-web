import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Instagram Reels Downloader - Download Reels in source quality MP4",
  description:
    "Fastest Instagram Reels Downloader online. Save Instagram Reels to iPhone, Android, or PC in source quality with audio. Free, no watermark, no registration.",
  alternates: {
    canonical: "https://reelser.com/reels",
  },
};

export default function ReelsPage() {
  return (
    <>
      <HeroSection
        initialTab="reels"
        customTitle="Instagram Reels Downloader"
        customDescription="Download Instagram Reels in source quality MP4 with original crystal-clear audio. Fast, free, and no watermark."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
