import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePageTransition } from "../../components/PageTransitionContext";
import { AuthHeader } from "./components/sections/AuthHeader";
import { AuthLoginSection } from "./components/sections/AuthLoginSection";
import { AuthRegisterWizardSection } from "./components/sections/AuthRegisterWizardSection";
import { AuthResetPasswordSection } from "./components/sections/AuthResetPasswordSection";
import { AuthPanelSection } from "./components/sections/AuthPanelSection";
import "./authLayout.css";

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { navigateWithTransition } = usePageTransition();

  // Determine current view from pathname
  const getCurrentView = (): "masuk" | "daftar" | "lupa" => {
    if (location.pathname === "/register") return "daftar";
    if (location.pathname === "/reset-password") return "lupa";
    return "masuk";
  };

  const currentView = getCurrentView();

  // Melacak view kanan terakhir (daftar atau lupa) agar form kanan tidak berganti sebelum tertutup panel
  const [lastRightView, setLastRightView] = useState<"daftar" | "lupa">(() => {
    return location.pathname === "/reset-password" ? "lupa" : "daftar";
  });

  const [registeredUser, setRegisteredUser] = useState<string>("");

  useEffect(() => {
    if (currentView === "daftar" || currentView === "lupa") {
      setLastRightView(currentView);
    }
  }, [currentView]);

  const navigateToView = (path: string) => {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (isMobile) {
      // Di layar mobile, gunakan transisi tirai atas-bawah
      navigateWithTransition(path);
    } else {
      // Di layar desktop, langsung navigasi URL agar transisi panel geser kiri-kanan berjalan murni tanpa tirai
      navigate(path);
    }
  };

  useEffect(() => {
    // Sync document title
    if (currentView === "masuk") document.title = "Masuk ke FishPro";
    if (currentView === "daftar") document.title = "Buat akun FishPro";
    if (currentView === "lupa") document.title = "Lupa Kata Sandi - FishPro";
  }, [currentView]);

  return (
    <div
      className="page"
      id="page"
      data-view={currentView}
      data-right={lastRightView}
    >
      {/* Top Header */}
      <AuthHeader onNavigateHome={() => navigateWithTransition("/onboard")} />

      {/* KIRI: Form Masuk */}
      <AuthLoginSection
        onNavigateTo={navigateToView}
        externalLoginUser={registeredUser}
      />

      {/* KANAN: Form Daftar (Wizard 4 Langkah) */}
      <AuthRegisterWizardSection
        onNavigateTo={navigateToView}
        onRegisterSuccess={(username) => setRegisteredUser(username)}
      />

      {/* KANAN: Form Lupa Kata Sandi */}
      <AuthResetPasswordSection onNavigateTo={navigateToView} />

      {/* PANEL SLIDING HERO QUOTE */}
      <AuthPanelSection
        currentView={currentView}
        onNavigateTo={navigateToView}
      />
    </div>
  );
}
