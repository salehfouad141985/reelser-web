import { pageMetadata } from "@/lib/pageMetadata";
import { HeroSection } from "@/components/HeroSection";
import { CategoryHubSection } from "@/components/CategoryHubSection";
import { HowToSection } from "@/components/HowToSection";

export const metadata = pageMetadata(
  "/profile-downloader",
  "Instagram Profile Viewer & Full HD DP Downloader Hub",
  "View and download full-size HD profile pictures (DP) and browse public posts, reels, and active stories by @username without logging in.",
);

export default function ProfileDownloaderPage() {
  return (
    <>
      <HeroSection
        initialTab="profile"
        customTitle="Instagram Profile Viewer & HD DP Hub"
        customDescription="View uncropped full-resolution Instagram profile pictures (DP) and explore public posts, reels, and stories by @username."
      />
      <CategoryHubSection category="profile" />
      <HowToSection />
    </>
  );
}
