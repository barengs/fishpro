import { Navigate, Outlet } from "react-router-dom";
import { authService } from "../../services/auth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

/**
 * ProtectedRoute:
 * Melindungi rute privat agar hanya dapat diakses saat sesi aktif.
 * Jika sesi tidak valid, alihkan ke /login dengan replace: true.
 * Jika peran tidak sesuai, alihkan ke dashboard perannya sendiri.
 */
export function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = authService.getUserRole();
  if (allowedRoles && allowedRoles.length > 0 && userRole) {
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to={authService.getDashboardUrl()} replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
}
