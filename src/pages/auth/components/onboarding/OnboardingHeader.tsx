import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageTransition } from "../../../../components/PageTransitionContext";
import { useTheme } from "../../../../components/theme/useTheme";

export function OnboardingHeader() {
  const { navigateWithTransition } = usePageTransition();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Kunci scroll body ketika menu mobile terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleMobileNav = (path: string) => {
    setMobileMenuOpen(false);
    navigateWithTransition(path);
  };

  const handleSectionClick = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className={`onboarding-header ${scrolled ? "scrolled" : ""}`} id="nav">
        <div className="onboarding-wrap onboarding-bar">
          <Link to="/" className="onboarding-logo" onClick={() => setMobileMenuOpen(false)}>
            <i>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 7c3-3 6 3 9 0s6-3 9 0M3 12c3-3 6 3 9 0s6-3 9 0M3 17c3-3 6 3 9 0s6-3 9 0" />
              </svg>
            </i>
            FISHPRO
          </Link>

          {/* Desktop Tools */}
          <div className="onboarding-tools desktop-only">
            <button
              className="onboarding-btn icon"
              id="theme"
              type="button"
              aria-label="Ganti tema"
              onClick={(e) => toggle(e)}
            >
              {theme === "dark" ? (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="onboarding-btn"
              onClick={() => navigateWithTransition("/login")}
            >
              Masuk
            </button>
            <button
              type="button"
              className="onboarding-btn pri"
              onClick={() => navigateWithTransition("/register")}
            >
              Daftar
            </button>
          </div>

          {/* Mobile Tools: Theme Toggle + Hamburger Button */}
          <div className="onboarding-tools mobile-only">
            <button
              className="onboarding-btn icon"
              type="button"
              aria-label="Ganti tema"
              onClick={(e) => toggle(e)}
            >
              {theme === "dark" ? (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              ) : (
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <button
              className="onboarding-btn icon mobile-hamburger-btn"
              type="button"
              aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Content */}
      <aside className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`} aria-label="Menu navigasi mobile">
        <div className="mobile-drawer-header">
          <div className="onboarding-logo">
            <i>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M3 7c3-3 6 3 9 0s6-3 9 0M3 12c3-3 6 3 9 0s6-3 9 0M3 17c3-3 6 3 9 0s6-3 9 0" />
              </svg>
            </i>
            FISHPRO
          </div>
          <button
            className="onboarding-btn icon"
            type="button"
            aria-label="Tutup menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          <button
            type="button"
            className="mobile-drawer-link"
            onClick={() => handleSectionClick("top")}
          >
            Beranda
          </button>
          <button
            type="button"
            className="mobile-drawer-link"
            onClick={() => handleSectionClick("alur")}
          >
            Alur Penimbangan
          </button>
          <button
            type="button"
            className="mobile-drawer-link"
            onClick={() => handleSectionClick("peran")}
          >
            Peran & Pengguna
          </button>
          <button
            type="button"
            className="mobile-drawer-link"
            onClick={() => handleSectionClick("tanya")}
          >
            Pertanyaan (FAQ)
          </button>
        </nav>

        <div className="mobile-drawer-actions">
          <button
            type="button"
            className="onboarding-btn pri mobile-action-btn"
            onClick={() => handleMobileNav("/register")}
          >
            Daftar Sekarang
          </button>
          <button
            type="button"
            className="onboarding-btn mobile-action-btn"
            onClick={() => handleMobileNav("/login")}
          >
            Masuk ke Akun
          </button>
        </div>
      </aside>
    </>
  );
}
