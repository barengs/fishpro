import { authService } from "../../services/auth";
import { SuperAdminDashboard } from "./SuperAdminDashboard";
import { StaffAdminDashboard } from "./StaffAdminDashboard";

export function AdminDashboard() {
  const isSuperAdmin = authService.isSuperAdmin();

  return isSuperAdmin ? <SuperAdminDashboard /> : <StaffAdminDashboard />;
}
