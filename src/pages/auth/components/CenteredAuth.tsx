import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { LayoutDashboard } from "lucide-react";

interface CenteredAuthProps {
  children: React.ReactNode;
  wide?: boolean;
  register?: boolean;
  hideBrand?: boolean;
}

export function CenteredAuth({
  children,
  wide = false,
  register = false,
  hideBrand = false,
}: CenteredAuthProps) {
  const location = useLocation();
  const pathname = location.pathname;

  const isLoggedIn = authService.isAuthenticated();
  const dashboardUrl = authService.getDashboardUrl();
  const userInfo = getUserDisplayInfo();

  const isHomeActive = pathname === "/" || pathname === "/onboard";
  const isLoginActive = pathname === "/login";
  const isRegisterActive = pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col surface-page text-strong selection:bg-fco-blue selection:text-white">
      <header className="sticky top-0 z-50 surface-card/85 backdrop-blur-md border-b border-fco-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {!hideBrand ? (
              <Link
                to="/onboard"
                className="no-underline flex items-center shrink-0"
                aria-label="Kembali ke beranda"
              >
                <Logo size={32} />
              </Link>
            ) : (
              <Link
                to="/onboard"
                className="no-underline flex items-center shrink-0"
                aria-label="Kembali ke beranda"
              >
                <Logo size={28} />
              </Link>
            )}
          </div>

          <nav
            aria-label="Navigasi Autentikasi"
            className="flex items-center gap-2.5 sm:gap-3 ml-auto"
          >
            <ThemeToggle compact />

            <Link
              to="/onboard"
              className={`h-10 px-3.5 sm:px-4 inline-flex items-center rounded-xs text-xs font-bold transition-all no-underline ${
                isHomeActive
                  ? "bg-fco-blue text-white shadow-xs font-extrabold"
                  : "border border-fco-border-subtle surface-card hover:surface-page text-strong"
              }`}
            >
              Beranda
            </Link>

            {isLoggedIn ? (
              <Link
                to={dashboardUrl}
                className="h-10 px-4.5 inline-flex items-center gap-2 rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-xs font-bold transition-all shadow-xs no-underline active:scale-[0.99]"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard ({userInfo.name})</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`h-10 px-3.5 sm:px-4 inline-flex items-center rounded-xs text-xs font-bold transition-all no-underline ${
                    isLoginActive
                      ? "bg-fco-blue text-white shadow-xs font-extrabold"
                      : "border border-fco-border-subtle surface-card hover:surface-page text-strong"
                  }`}
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className={`h-10 px-4 sm:px-5 inline-flex items-center rounded-xs text-xs font-bold transition-all shadow-xs no-underline active:scale-[0.99] ${
                    isRegisterActive
                      ? "bg-fco-blue text-white shadow-sm ring-2 ring-fco-blue/30 font-extrabold"
                      : "bg-fco-blue hover:bg-fco-blue-hover text-white"
                  }`}
                >
                  Daftar
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center w-full px-3 sm:px-6 py-6 sm:py-10 my-auto">
        <div
          className={`w-full ${register ? "max-w-160" : wide ? "max-w-220" : "max-w-135"}`}
        >
          {children}
        </div>
      </main>

      <footer className="border-t border-fco-border-subtle surface-card py-6 text-center text-xs text-soft">
        © 2026 Kementerian Kelautan dan Perikanan RI
      </footer>
    </div>
  );
}
