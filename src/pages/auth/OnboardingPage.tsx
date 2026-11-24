import { useEffect } from "react";
import { OnboardingHeader } from "./components/onboarding/OnboardingHeader";
import { HeroSection } from "./components/onboarding/HeroSection";
import { FlowSection } from "./components/onboarding/FlowSection";
import { RolesSection } from "./components/onboarding/RolesSection";
import { FaqSection } from "./components/onboarding/FaqSection";
import { OnboardingFooter } from "./components/onboarding/OnboardingFooter";
import "./components/onboarding/heroScene.css";

export function OnboardingPage() {
  useEffect(() => {
    document.title = "FISHPRO – Catat hasil tangkapan langsung dari dermaga";
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased overflow-x-hidden selection:bg-[#2563eb] selection:text-white" style={{ background: "var(--bg, #f8fafc)", color: "var(--tx, #0f172a)" }}>
      <OnboardingHeader />
      <main className="flex-1">
        <HeroSection />
        <FlowSection />
        <RolesSection />
        <FaqSection />
      </main>
      <OnboardingFooter />
    </div>
  );
}
