import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { CategoryHubSection } from "@/components/CategoryHubSection";
import { HowToSection } from "@/components/HowToSection";

export const metadata = pageMetadata(
  "/audio-downloader",
  "Instagram Audio Downloader Hub - Convert Reels & Videos to MP3",
  "Extract original audio, voiceovers, and background music from public Instagram Reels and videos as clean MP3 files with Reelser.",
);

export default function AudioDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="audio"
        customTitle="Instagram Audio & Reels to MP3 Hub"
        customDescription="Convert public Instagram Reels and videos into standalone stereo MP3 audio tracks directly in your browser."
      />
      <CategoryHubSection category="audio" />
      <HowToSection />
    </>
  );
}
