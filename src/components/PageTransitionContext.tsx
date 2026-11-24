import React, { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface TransitionContextType {
  navigateWithTransition: (to: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"up" | "right">("up");

  const navigateWithTransition = useCallback(
    (to: string) => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        navigate(to);
        return;
      }

      // Deteksi tipe transisi: jika desktop ke auth / ke onboard, atau di mobile curtain
      const isMobile = window.innerWidth <= 900;
      setDirection(isMobile ? "up" : "right");
      setAnimating(true);

      // Pada separuh durasi transisi (0.4s), ganti rute & scroll ke atas
      setTimeout(() => {
        navigate(to);
        window.scrollTo(0, 0);
      }, 400);

      // Selesai transisi setelah 0.8s (durasi sinkron dengan var(--dur) .8s cubic-bezier(.65,0,.25,1))
      setTimeout(() => {
        setAnimating(false);
      }, 800);
    },
    [navigate]
  );

  return (
    <PageTransitionContext.Provider
      value={{ navigateWithTransition, isTransitioning: animating }}
    >
      {children}
      {/* Global Page Transition Curtain Overlay */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none transition-curtain ${
          animating ? `active anim-${direction}` : ""
        }`}
        aria-hidden="true"
      />
    </PageTransitionContext.Provider>
  );
}
