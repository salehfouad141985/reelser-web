import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export const metadata = pageMetadata(
  "/profile-downloader",
  "Instagram Profile Picture Downloader",
  "View and download profile pictures from public Instagram accounts. Enter a username or profile link to save the image available from the source.",
);

export default function ProfileDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="profile"
        customTitle="Instagram Profile Picture (DP) Downloader"
        customDescription="View and save a public Instagram profile picture in the resolution available from the source."
      />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
