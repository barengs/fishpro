import { Link } from "react-router-dom";

export function OnboardingHeader() {
  return (
    <header className="border-b border-[#e2e8f0] dark:border-[#22304a] bg-white dark:bg-[#111a2c] transition-colors">
      <div className="max-w-[1120px] mx-auto px-5 flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-[#0f3562] dark:text-[#2f6fd6] no-underline"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 15c3 0 3-2 6-2s3 2 6 2 3-2 6-2M3 19c3 0 3-2 6-2s3 2 6 2 3-2 6-2M5 11l7-7 7 7z" />
          </svg>
          <span>FISHPRO</span>
        </Link>
        <nav className="hidden md:flex gap-7 text-sm text-[#64748b] dark:text-[#94a3b8]">
          <a
            href="#alur"
            className="hover:text-[#0f3562] dark:hover:text-[#e5eaf2] transition-colors no-underline"
          >
            Alur
          </a>
          <a
            href="#peran"
            className="hover:text-[#0f3562] dark:hover:text-[#e5eaf2] transition-colors no-underline"
          >
            Peran
          </a>
          <a
            href="#tanya"
            className="hover:text-[#0f3562] dark:hover:text-[#e5eaf2] transition-colors no-underline"
          >
            Tanya jawab
          </a>
        </nav>
        <div className="flex gap-5 text-sm">
          <Link
            to="/login"
            className="text-[#64748b] dark:text-[#94a3b8] hover:text-[#0f3562] dark:hover:text-[#e5eaf2] transition-colors no-underline"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="font-medium text-[#0f3562] dark:text-[#2f6fd6] hover:text-[#0a2748] dark:hover:text-[#3f7ee3] transition-colors no-underline"
          >
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
