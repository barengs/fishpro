import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import type { Theme } from "./themeTypes";
import { ThemeContext } from "./themeTypes";

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("fco-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
  localStorage.setItem("fco-theme", theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const activeTransitionRef = useRef<ViewTransitionLike | null>(null);

  useLayoutEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      document.documentElement.classList.remove("theme-switching");
    };
  }, []);

  const toggle = useCallback((event?: React.MouseEvent | MouseEvent) => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    // Cek apakah browser mendukung View Transitions API & pengguna tidak meminta reduced motion
    const doc = document as Document & {
      startViewTransition?: (callback: () => Promise<void> | void) => ViewTransitionLike;
    };

    const isReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (!doc.startViewTransition || isReducedMotion) {
      root.classList.add("theme-switching");
      applyThemeToDocument(nextTheme);
      setTheme(nextTheme);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          root.classList.remove("theme-switching");
        });
      });
      return;
    }

    // Hitung koordinat pusat lingkaran dari tombol yang diklik
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (event) {
      const target = (event.currentTarget || event.target) as HTMLElement | null;
      if (target && typeof target.getBoundingClientRect === "function") {
        const rect = target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (typeof event.clientX === "number" && typeof event.clientY === "number") {
        x = event.clientX;
        y = event.clientY;
      }
    }

    // Radius maksimum hingga sudut terjauh layar
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(() => {
      root.classList.add("theme-switching");
      applyThemeToDocument(nextTheme);
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    activeTransitionRef.current = transition;

    transition.ready
      .then(() => {
        if (activeTransitionRef.current !== transition) return;
        root.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {
        // Abaikan jika transisi dibatalkan oleh pergantian tema berikutnya
      });

    transition.finished.finally(() => {
      if (activeTransitionRef.current === transition) {
        root.classList.remove("theme-switching");
        activeTransitionRef.current = null;
      }
    });
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
