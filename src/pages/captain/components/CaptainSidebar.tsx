import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { NotificationBell } from "../../../components/NotificationBell";
import { UserProfileBadge } from "../../../components/UserProfileBadge";
import { ClipboardList, LayoutDashboard, Ship } from "lucide-react";
import { MobileTopbar } from "../../../components/MobileTopbar";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { FullscreenToggle } from "../../../components/FullscreenToggle";
import { authService, getUserDisplayInfo } from "../../../services/auth";

const navItems = [
  { label: "Ringkasan", to: "/captain", end: true, Icon: LayoutDashboard },
  { label: "Riwayat Tangkapan", to: "/captain/catches", Icon: ClipboardList },
  { label: "Kapal Saya", to: "/captain/ship", Icon: Ship },
];

function SidebarBody() {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((n) => (
        <NavLink
          key={n.label}
          to={n.to}
          end={n.end}
          className={({ isActive }) =>
            `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline transition-all ${
              isActive
                ? "bg-fco-blue-light text-fco-blue"
                : "bg-transparent text-soft hover:surface-page hover:text-strong"
            }`
          }
        >
          {
            <n.Icon
              size={20}
              className="shrink-0"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
          {n.label}
        </NavLink>
      ))}
    </div>
  );
}

export function CaptainSidebar() {
  return (
    <nav
      aria-label="Menu utama Nahkoda"
      className="hidden lg:flex flex-col basis-62 shrink-0 surface-topbar border-r p-4"
    >
      <div className="px-2 pb-7">
        <Link to="/captain" className="no-underline">
          <Logo />
        </Link>
      </div>
      <div className="flex-1">
        <SidebarBody />
      </div>
    </nav>
  );
}

export function CaptainLayout() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userInfo = getUserDisplayInfo();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex surface-page text-strong">
      <CaptainSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-end gap-3 px-10 h-18 surface-topbar border-b sticky top-0 z-30">
          <NotificationBell />
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
          <div onClick={() => setOpen(false)}>
            <SidebarBody />
          </div>
        </MobileTopbar>
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
