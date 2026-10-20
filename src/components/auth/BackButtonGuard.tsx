import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";

const PUBLIC_AUTH_PATHS = [
  "/",
  "/onboard",
  "/login",
  "/register",
  "/reset-password",
];

/**
 * BackButtonGuard:
 * Mencegah pengguna yang sudah login menekan tombol 'Back' browser
 * dan kembali ke halaman login atau keluar ke halaman landing.
 * Jika pengguna menekan back saat sesi aktif, guard langsung menjaga
 * agar tetap berada di dashboard privat.
 */
export function BackButtonGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!authService.isAuthenticated()) return;

    // Pasang trap history barrier pada rute terotentikasi
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      if (authService.isAuthenticated()) {
        const currentPath = window.location.pathname;

        // Jika tombol back mengarah ke rute publik / login
        if (PUBLIC_AUTH_PATHS.includes(currentPath)) {
          window.history.pushState(null, "", authService.getDashboardUrl());
          navigate(authService.getDashboardUrl(), { replace: true });
        } else {
          // Re-trap history state
          window.history.pushState(null, "", window.location.href);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [location.pathname, navigate]);

  return null;
}
