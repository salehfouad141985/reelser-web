import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { CategoryHubSection } from "@/components/CategoryHubSection";
import { HowToSection } from "@/components/HowToSection";

export const metadata = pageMetadata(
  "/story-saver",
  "Instagram Story Saver Hub - View & Download Public Stories Anonymously",
  "View and download active 24-hour Instagram Stories and pinned Highlights from public accounts with 100% anonymity and no login required.",
);

export default function StorySaverPage() {
  return (
    <>
      <HeroSection
        initialTab="story"
        customTitle="Anonymous Instagram Story Saver Hub"
        customDescription="View and save available photos, videos, and highlights from public Instagram stories without appearing in the viewer list."
      />
      <CategoryHubSection category="story" />
      <HowToSection />
    </>
  );
}
