import type { Metadata } from "next";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Instagram Profile Picture Downloader (DP) - View & Save Full Size",
  description:
    "View and download any Instagram profile picture (DP) in full resolution HD. Completely anonymous, free, and works without an Instagram account.",
  alternates: {
    canonical: "https://reelser.com/profile-downloader",
  },
};

export default function ProfileDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="profile"
        customTitle="Instagram Profile Picture (DP) Downloader"
        customDescription="Enlarge and download any public Instagram avatar or profile picture in original HD resolution."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
