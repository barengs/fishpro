import { useEffect } from "react";
import { OnboardingHeader } from "./components/onboarding/OnboardingHeader";
import { HeroSection } from "./components/onboarding/HeroSection";
import { FlowSection } from "./components/onboarding/FlowSection";
import { RolesSection } from "./components/onboarding/RolesSection";
import { FaqSection } from "./components/onboarding/FaqSection";
import { OnboardingFooter } from "./components/onboarding/OnboardingFooter";

export function OnboardingPage() {
  useEffect(() => {
    document.title = "FISHPRO – Catat hasil tangkapan langsung dari dermaga";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg,#f8fafc)] text-[var(--tx,#0f172a)] font-sans antialiased overflow-x-hidden selection:bg-[#2563eb] selection:text-white">
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
