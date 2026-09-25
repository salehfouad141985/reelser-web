import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowToSection } from "@/components/HowToSection";
import { FaqSection } from "@/components/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroSection initialTab="reels" />
      <FeaturesSection />
      <HowToSection />
      <FaqSection />
    </>
  );
}
