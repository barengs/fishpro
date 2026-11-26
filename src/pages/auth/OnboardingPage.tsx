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
    document.title = "FishPro – Pelaporan Tangkapan & Kuota Kapal dari Dermaga";

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      document.querySelectorAll(".rv").forEach((e) => e.classList.add("in"));
      return;
    }

    // Jalankan pengecekan IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px 50px 0px" }
    );

    const elements = document.querySelectorAll(".rv");
    elements.forEach((el) => observer.observe(el));

    // Fallback: jika ada elemen yang sudah berada di viewport atau belum tertrigger setelah scroll
    const checkVisibility = () => {
      const vh = window.innerHeight;
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh + 50 && rect.bottom > 0) {
          el.classList.add("in");
        }
      });
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    checkVisibility();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkVisibility);
    };
  }, []);

  return (
    <div
      className="onboarding-page min-h-screen flex flex-col font-sans antialiased overflow-x-hidden selection:bg-[#2563eb] selection:text-white"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
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
