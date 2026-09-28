import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata = pageMetadata(
  "/story-saver",
  "Instagram Story Saver",
  "View and download available stories from public Instagram accounts. Save story photos and videos to your phone or computer with Reelser.",
);

export default function StorySaverPage() {
  return (
    <>
      <HeroSection
        initialTab="story"
        customTitle="Instagram Story Saver"
        customDescription="View and save available photos and videos from public Instagram stories before they expire."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
