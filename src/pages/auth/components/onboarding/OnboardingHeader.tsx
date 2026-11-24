import { Link } from "react-router-dom";
import { usePageTransition } from "../../../../components/PageTransitionContext";

export function OnboardingHeader() {
    const { navigateWithTransition } = usePageTransition();

    return (
        <header className="border-b bd bg-[var(--sf,#ffffff)] transition-colors">
            <div className="wrap flex items-center justify-between h-16">
                <Link
                    to="/"
                    className="flex items-center gap-2 font-semibold tracking-tight text-[var(--pr,#0f3562)] no-underline"
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
                <nav className="hidden md:flex gap-7 text-sm t2">
                    <a href="#alur" className="hover:text-[var(--pr,#0f3562)] transition-colors no-underline">
                        Alur
                    </a>
                    <a href="#peran" className="hover:text-[var(--pr,#0f3562)] transition-colors no-underline">
                        Peran
                    </a>
                    <a href="#tanya" className="hover:text-[var(--pr,#0f3562)] transition-colors no-underline">
                        Tanya jawab
                    </a>
                </nav>
                <div className="flex gap-5 text-sm">
                    <button
                        type="button"
                        onClick={() => navigateWithTransition("/login")}
                        className="t2 hover:text-[var(--pr,#0f3562)] transition-colors bg-transparent border-0 p-0 cursor-pointer font-inherit text-sm"
                    >
                        Masuk
                    </button>
                    <button
                        type="button"
                        onClick={() => navigateWithTransition("/register")}
                        className="font-medium text-[var(--pr,#0f3562)] hover:text-[var(--ph,#0a2748)] transition-colors bg-transparent border-0 p-0 cursor-pointer font-inherit text-sm"
                    >
                        Daftar
                    </button>
                </div>
            </div>
        </header>
    );
}
