import { Link } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { Logo } from "../../components/Logo";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useToast } from "../../components/toast";

export function LoginPage() {
  const toast = useToast();

  const handleGoogleLogin = () => {
    toast.warning("Fitur login Google SSO sedang dalam tahap integrasi.");
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-white dark:bg-[#111827] text-ink dark:text-white font-sans antialiased selection:bg-brand-100 selection:text-brand-800 px-4 sm:px-8 lg:px-12 py-6">
      {/* Top Bar: Brand Logo & Navigasi Cepat / Theme */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between gap-3">
        <Link
          to="/onboard"
          className="inline-flex items-center gap-2.5 group focus:outline-hidden no-underline"
          aria-label="Kembali ke Beranda FishPro"
        >
          <Logo size={32} />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle compact />

          <Link
            to="/onboard"
            className="h-8.5 px-3 inline-flex items-center rounded-lg border border-line dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#F9FAFB] dark:hover:bg-slate-700 text-xs font-medium text-inkSoft dark:text-slate-200 shadow-subtle transition-colors no-underline"
          >
            Beranda
          </Link>

          <Link
            to="/register"
            className="h-8.5 px-3.5 inline-flex items-center rounded-lg bg-brand-600 hover:bg-brand-700 text-xs font-semibold text-white transition-colors no-underline shadow-subtle"
          >
            Daftar
          </Link>
        </div>
      </header>

      {/* Center Container: Formulir Masuk (Nexus Style) */}
      <main className="w-full max-w-[400px] mx-auto my-auto py-8 sm:py-12 space-y-5">
        <div>
          <h1 className="text-[24px] sm:text-[26px] font-bold tracking-tight text-ink dark:text-white m-0">
            Masuk ke FishPro
          </h1>
          <p className="text-[13.5px] text-subtext dark:text-slate-400 mt-1.5 m-0">
            Kelola operasional armada kapal, penimbangan ikan, dan perizinan laut.
          </p>
        </div>

        {/* Form Login Utama */}
        <LoginForm />

        {/* Divider */}
        <div className="relative flex items-center pt-1">
          <div className="flex-grow border-t border-line dark:border-slate-800" />
          <span className="shrink-0 px-3 text-[11.5px] font-medium text-subtext dark:text-slate-400">
            atau masuk dengan
          </span>
          <div className="flex-grow border-t border-line dark:border-slate-800" />
        </div>

        {/* Social SSO: Google Button di Bawah */}
        <div className="grid grid-cols-1">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full inline-flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-line dark:border-slate-700 hover:bg-[#F9FAFB] dark:hover:bg-slate-700 text-[13px] font-medium text-inkSoft dark:text-white shadow-subtle transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
              />
              <path
                fill="#34A853"
                d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Masuk dengan Google</span>
          </button>
        </div>

        {/* Switch to Register */}
        <p className="text-center text-[13px] text-subtext dark:text-slate-400 m-0 pt-1">
          Belum punya akun?
          <Link
            to="/register"
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-blue-400 ml-1.5 no-underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </main>

      {/* Bottom Minimal Footer */}
      <footer className="w-full max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[12px] text-subtext dark:text-slate-500 pt-4 border-t border-line/60 dark:border-slate-800">
        <span>© 2026 Kementerian Kelautan dan Perikanan RI</span>
        <div className="flex items-center gap-4">
          <Link
            to="/onboard"
            className="hover:text-ink dark:hover:text-white transition-colors no-underline text-subtext dark:text-slate-500"
          >
            Beranda
          </Link>
          <Link
            to="/onboard#alur"
            className="hover:text-ink dark:hover:text-white transition-colors no-underline text-subtext dark:text-slate-500"
          >
            Alur
          </Link>
          <Link
            to="/onboard#tanya"
            className="hover:text-ink dark:hover:text-white transition-colors no-underline text-subtext dark:text-slate-500"
          >
            Bantuan
          </Link>
        </div>
      </footer>
    </div>
  );
}
