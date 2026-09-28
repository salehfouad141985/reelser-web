import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata = pageMetadata(
  "/audio-downloader",
  "Instagram Audio Downloader - Reels to MP3",
  "Extract audio from public Instagram Reels and videos as MP3 files. Use Reelser to save available music, speech, and other audio to your device.",
);

export default function AudioDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="audio"
        customTitle="Instagram Audio & MP3 Downloader"
        customDescription="Extract available audio from public Instagram Reels and videos and save it as an MP3 file."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
