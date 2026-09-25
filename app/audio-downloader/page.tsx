import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Instagram Audio Downloader - Extract Reels Audio & Music to MP3",
  description:
    "Extract and download audio tracks, background music, and sounds from Instagram Reels and videos in high-quality 320kbps MP3 format.",
  alternates: {
    canonical: "https://reelser.com/audio-downloader",
  },
};

export default function AudioDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="audio"
        customTitle="Instagram Audio & MP3 Downloader"
        customDescription="Extract original background songs, voice tracks, and audio sounds from any Instagram Reel or Video in clean MP3 format."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
