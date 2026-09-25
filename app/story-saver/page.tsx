import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Instagram Story Saver - Download Instagram Stories & Highlights HD",
  description:
    "Save Instagram stories and highlights anonymously and in original high quality. 100% free online Story Saver for iPhone, Android, and PC.",
  alternates: {
    canonical: "https://reelser.com/story-saver",
  },
};

export default function StorySaverPage() {
  return (
    <>
      <HeroSection
        initialTab="story"
        customTitle="Instagram Story Saver"
        customDescription="Download Instagram Stories and Highlights directly to your gallery in full resolution before they disappear after 24 hours."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
