import { Link } from "react-router-dom";

export function OnboardingFooter() {
  return (
    <footer className="border-t bd py-6 sm:py-8">
      <div className="wrap flex flex-col sm:flex-row gap-4 justify-between items-center text-xs sm:text-sm t2 text-center sm:text-left">
        <p className="m-0">
          <span
            className="font-semibold"
            style={{ color: "var(--pr, #0f3562)" }}
          >
            FISHPRO
          </span>{" "}
          · © 2026 Kementerian Kelautan dan Perikanan RI
        </p>
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
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
