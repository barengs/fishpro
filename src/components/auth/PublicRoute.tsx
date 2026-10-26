import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../services/auth";

interface PublicRouteProps {
  children?: React.ReactNode;
}

/**
 * PublicRoute:
 * Mencegah pengguna yang sudah login melihat halaman publik/auth (login, register, onboard).
 * Jika sesi aktif, pengguna langsung dialihkan ke dashboard tanpa render form login.
 */
export function PublicRoute({ children }: PublicRouteProps) {
  if (authService.isAuthenticated()) {
    return <Navigate to={authService.getDashboardUrl()} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
