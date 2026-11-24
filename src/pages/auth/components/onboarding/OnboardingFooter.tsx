import { Link } from "react-router-dom";

export function OnboardingFooter() {
  return (
    <footer className="border-t bd py-8">
      <div className="wrap flex flex-col md:flex-row gap-4 justify-between text-sm t2">
        <p>
          <span className="font-semibold text-[var(--pr,#0f3562)]">FISHPRO</span> · © 2026 Kementerian Kelautan
          dan Perikanan RI
        </p>
        <div className="flex gap-6">
          <Link to="/login" className="hover:underline">
            Masuk portal
          </Link>
          <Link to="/register" className="hover:underline">
            Registrasi
          </Link>
          <Link to="/reset-password" className="hover:underline">
            Bantuan sandi
          </Link>
        </div>
      </div>
    </footer>
  );
}
