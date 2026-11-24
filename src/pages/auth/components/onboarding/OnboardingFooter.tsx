import { usePageTransition } from "../../../../components/PageTransitionContext";

export function OnboardingFooter() {
  const { navigateWithTransition } = usePageTransition();

  return (
    <footer className="border-t bd py-8">
      <div className="wrap flex flex-col md:flex-row gap-4 justify-between text-sm t2">
        <p>
          <span className="font-semibold text-[var(--pr,#0f3562)]">FISHPRO</span> · © 2026 Kementerian Kelautan
          dan Perikanan RI
        </p>
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => navigateWithTransition("/login")}
            className="hover:underline bg-transparent border-0 p-0 text-inherit font-inherit cursor-pointer text-sm"
          >
            Masuk portal
          </button>
          <button
            type="button"
            onClick={() => navigateWithTransition("/register")}
            className="hover:underline bg-transparent border-0 p-0 text-inherit font-inherit cursor-pointer text-sm"
          >
            Registrasi
          </button>
          <button
            type="button"
            onClick={() => navigateWithTransition("/reset-password")}
            className="hover:underline bg-transparent border-0 p-0 text-inherit font-inherit cursor-pointer text-sm"
          >
            Bantuan sandi
          </button>
        </div>
      </div>
    </footer>
  );
}
