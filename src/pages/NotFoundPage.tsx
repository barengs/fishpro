import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, LayoutDashboard } from "lucide-react";
import { authService } from "../services/auth";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";

export function NotFoundPage() {
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();
  const destinationUrl = isLoggedIn ? authService.getDashboardUrl() : "/onboard";
  const destinationLabel = isLoggedIn
    ? "Kembali ke Dashboard"
    : "Kembali ke Beranda";

  return (
    <div className="min-h-screen flex flex-col surface-page text-strong selection:bg-rose-600 selection:text-white">
      {/* Top Header */}
      <header className="h-16 px-4 sm:px-8 border-b border-fco-border-subtle flex items-center justify-between">
        <Link to={destinationUrl} className="no-underline flex items-center">
          <Logo size={28} />
        </Link>
        <ThemeToggle compact />
      </header>

      {/* Main 404 Body */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center flex flex-col items-center">
          {/* Dizzy / Dead Face (x_x) Large Icon without card box */}
          <svg
            className="w-24 h-24 sm:w-28 sm:h-28 text-rose-600 dark:text-rose-500 mb-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            {/* Left Eye X */}
            <path d="m8 9 2 2" />
            <path d="m10 9-2 2" />
            {/* Right Eye X */}
            <path d="m14 9 2 2" />
            <path d="m16 9-2 2" />
            {/* Mouth Frown */}
            <path d="M16 16c-1-1.5-2.5-2-4-2s-3 .5-4 2" />
          </svg>

          <span className="text-5xl sm:text-6xl font-black tracking-tight text-rose-600 dark:text-rose-500 mb-2 font-mono">
            404
          </span>
          <h1 className="m-0 text-xl sm:text-2xl font-extrabold text-strong mb-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="m-0 text-sm text-soft leading-relaxed max-w-sm mb-8">
            Tautan yang Anda tuju mungkin salah ketik, telah dipindahkan, atau
            tidak lagi tersedia pada sistem FishPro.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto h-11 px-5 rounded-xl border border-slate-200/80 dark:border-fco-border-dark surface-card hover:surface-page text-xs font-semibold text-strong cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-2xs"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>Sebelumnya</span>
            </button>

            <Link
              to={destinationUrl}
              className="w-full sm:w-auto h-11 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs no-underline"
            >
              {isLoggedIn ? <LayoutDashboard size={16} /> : <Home size={16} />}
              <span>{destinationLabel}</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="py-4 text-center text-2xs text-soft border-t border-fco-border-subtle">
        Sistem Manajemen Perikanan Terpadu · Kementerian Kelautan dan Perikanan
      </footer>
    </div>
  );
}

export default NotFoundPage;
