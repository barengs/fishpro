import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Logo } from "../../../components/Logo";
import { UserProfileBadge } from "../../../components/UserProfileBadge";
import {
  Anchor,
  BarChart3,
  Building2,
  ChevronDown,
  ClipboardList,
  Fish,
  LayoutDashboard,
  Link2,
  MapPin,
  ShieldCheck,
  Ship,
  Users,
} from "lucide-react";
import { MobileTopbar } from "../../../components/MobileTopbar";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { FullscreenToggle } from "../../../components/FullscreenToggle";
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { useToast } from "../../../components/toast";

export function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const isUserPath =
    location.pathname.startsWith("/admin/owners") ||
    location.pathname.startsWith("/admin/captains") ||
    location.pathname.startsWith("/admin/users");
  const [userToggled, setUserToggled] = useState<boolean | null>(null);
  const usersOpen = userToggled ?? isUserPath;

  return (
    <div className="flex flex-col gap-1">
      <NavLink
        to="/admin"
        end
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <LayoutDashboard
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Ringkasan
      </NavLink>

      <NavLink
        to="/admin/ships"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <Ship
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Kapal
      </NavLink>

      {/* Submenu Pengguna */}
      <div>
        <button
          type="button"
          onClick={() => setUserToggled(!usersOpen)}
          className={`w-full flex items-center justify-between h-10.5 px-3 rounded-fco text-sm font-semibold border-none cursor-pointer transition-all text-left ${
            isUserPath
              ? "text-fco-blue bg-fco-blue-light/50 dark:bg-fco-blue/15"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Users
              size={20}
              className="shrink-0"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span>Pengguna</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 shrink-0 ${
              usersOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {usersOpen && (
          <div className="relative pl-3 mt-1 flex flex-col gap-0.5">
            <div className="absolute left-6 top-1 bottom-1 w-px bg-fco-border-subtle dark:bg-fco-border-dark" />
            <NavLink
              to="/admin/owners"
              onClick={onNavigate}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 h-9 pl-6 pr-3 rounded-fco text-xs sm:text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-fco-blue bg-fco-blue-light"
                    : "text-soft hover:surface-page hover:text-strong"
                }`
              }
            >
              <Building2
                size={15}
                className="shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>Pemilik</span>
            </NavLink>
            <NavLink
              to="/admin/captains"
              onClick={onNavigate}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 h-9 pl-6 pr-3 rounded-fco text-xs sm:text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-fco-blue bg-fco-blue-light"
                    : "text-soft hover:surface-page hover:text-strong"
                }`
              }
            >
              <Anchor
                size={15}
                className="shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>Nahkoda</span>
            </NavLink>
          </div>
        )}
      </div>

      <NavLink
        to="/admin/catches"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <ClipboardList
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Laporan Tangkapan
      </NavLink>

      <NavLink
        to="/admin/species"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <Fish
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Spesies Ikan
      </NavLink>

      <NavLink
        to="/admin/areas"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <MapPin
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Wilayah (WPP)
      </NavLink>

      <NavLink
        to="/admin/quota"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <BarChart3
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Kuota dan PNBP
      </NavLink>

      <NavLink
        to="/admin/blockchain"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <Link2
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Blockchain
      </NavLink>

      <NavLink
        to="/admin/roles"
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${
            isActive
              ? "bg-fco-blue-light text-fco-blue"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`
        }
      >
        <ShieldCheck
          size={20}
          className="shrink-0"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Peran dan Menu
      </NavLink>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <nav
      aria-label="Menu utama Admin"
      className="hidden lg:flex flex-col basis-62 shrink-0 surface-topbar border-r p-4"
    >
      <div className="px-2 pb-7">
        <Link to="/admin" className="no-underline">
          <Logo />
        </Link>
      </div>
      <div className="flex-1">
        <SidebarBody />
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
          <SidebarBody onNavigate={() => setOpen(false)} />
        </MobileTopbar>
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
