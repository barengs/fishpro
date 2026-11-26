import React, { createContext, useContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Preload chunk AuthPage agar tidak ada delay network/parsing saat tirai naik
const preloadAuth = () => {
  import("../pages/auth/AuthPage").catch(() => {});
};

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

  const navigateWithTransition = useCallback(
    (to: string) => {
      // Pastikan chunk target sudah di-preload
      preloadAuth();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        navigate(to);
        return;
      }

      setAnimating(true);

      // Pada puncak tirai menutupi layar (280ms), pindah rute secara instan
      setTimeout(() => {
        navigate(to);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 280);

      // Tirai turun dan selesai dalam 600ms
      setTimeout(() => {
        setAnimating(false);
      }, 620);
    },
    [navigate]
  );

  return (
    <PageTransitionContext.Provider
      value={{ navigateWithTransition, isTransitioning: animating }}
    >
      {children}
      {/* Global Page Transition Curtain Overlay: GPU-accelerated navy curtain */}
      <div
        className={`fixed inset-0 pointer-events-none transition-curtain ${
          animating ? "active" : ""
        }`}
        aria-hidden="true"
      />
    </PageTransitionContext.Provider>
  );
}
