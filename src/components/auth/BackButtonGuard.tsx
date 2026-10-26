import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";

const PUBLIC_AUTH_PATHS = ["/login", "/register", "/reset-password"];

/**
 * BackButtonGuard:
 * Mencegah pengguna yang sudah login menekan tombol 'Back' browser
 * dan kembali ke halaman login atau keluar ke halaman landing.
 * Hanya mencegat navigasi kembali jika rute tujuan adalah halaman publik/auth.
 */
export function BackButtonGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) return;

    const handlePopState = () => {
      if (authService.isAuthenticated()) {
        const currentPath = window.location.pathname;

        // Jika tombol back mengarah ke rute publik / login
        if (PUBLIC_AUTH_PATHS.includes(currentPath)) {
          navigate(authService.getDashboardUrl(), { replace: true });
        }
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return null;
}
