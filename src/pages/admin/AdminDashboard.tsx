import { authService } from "../../services/auth";
import { SuperAdminDashboard } from "./SuperAdminDashboard";
import { StaffDashboard } from "./StaffDashboard";

export function AdminDashboard() {
  const isSuperAdmin = authService.isSuperAdmin();

  return isSuperAdmin ? <SuperAdminDashboard /> : <StaffDashboard />;
}
