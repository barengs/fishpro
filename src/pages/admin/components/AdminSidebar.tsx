import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { UserProfileBadge } from "../../../components/UserProfileBadge";
import { MobileTopbar } from "../../../components/MobileTopbar";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { FullscreenToggle } from "../../../components/FullscreenToggle";
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { useToast } from "../../../components/toast";
import { AdminSidebarNav } from "./AdminSidebarNav";

export {
  AdminSidebarNav,
  AdminSidebarNav as SidebarBody,
} from "./AdminSidebarNav";

export function AdminSidebar() {
  return (
    <nav
      aria-label="Menu utama Admin"
      className="hidden lg:flex flex-col basis-62 shrink-0 surface-topbar border-r p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto"
    >
      <div className="px-2 pb-7 shrink-0">
        <Link to="/admin" className="no-underline">
          <Logo />
        </Link>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        <AdminSidebarNav />
      </div>
    </nav>
  );
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const userInfo = getUserDisplayInfo();

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logout berhasil. Sesi telah diakhiri.");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex surface-page text-strong">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-end gap-3 px-10 h-18 surface-topbar border-b sticky top-0 z-30">
          <FullscreenToggle />
          <ThemeToggle />
          <UserProfileBadge
            initials={userInfo.initials}
            name={userInfo.name}
            role={userInfo.roleLabel}
            onLogout={handleLogout}
          />
        </header>
        <MobileTopbar
          open={open}
          onToggle={() => setOpen(!open)}
          onClose={() => setOpen(false)}
          profile={{
            initials: userInfo.initials,
            name: userInfo.name,
            role: userInfo.roleLabel,
          }}
          onLogout={handleLogout}
        >
          <AdminSidebarNav onNavigate={() => setOpen(false)} />
        </MobileTopbar>
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
