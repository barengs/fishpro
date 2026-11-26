import { usePageTransition } from "../../../../components/PageTransitionContext";

export function OnboardingFooter() {
  const { navigateWithTransition } = usePageTransition();

  return (
    <footer className="onboarding-footer">
      <div className="onboarding-wrap">
        <span>
          <b>FISHPRO</b> · © 2026 Kementerian Kelautan dan Perikanan RI
        </span>
        <button
          type="button"
          onClick={() => navigateWithTransition("/login")}
          className="footer-link"
        >
          Masuk portal
        </button>
        <button
          type="button"
          onClick={() => navigateWithTransition("/register")}
          className="footer-link"
        >
          Registrasi
        </button>
        <button
          type="button"
          onClick={() => navigateWithTransition("/reset-password")}
          className="footer-link"
        >
          Bantuan sandi
        </button>
      </div>
    </footer>
  );
}
