import { Navigate } from "react-router-dom";
import { authService } from "../../services/auth";
import { SuperAdminDashboard } from "./SuperAdminDashboard";

export function AdminDashboard() {
  const isSuperAdmin = authService.isSuperAdmin();

  if (!isSuperAdmin) {
    return <Navigate to="/staff" replace />;
  }

  return <SuperAdminDashboard />;
}
