import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Anchor, LayoutDashboard, Menu, Ship, X } from "lucide-react";
import { Logo } from "../../../components/Logo";
import { UserProfileBadge } from "../../../components/UserProfileBadge";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { FullscreenToggle } from "../../../components/FullscreenToggle";
import {
  QuickSearchMenu,
  type QuickSearchItem,
} from "../../../components/QuickSearchMenu";
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { useToast } from "../../../components/toast";

const ownerSearchItems: QuickSearchItem[] = [
  {
    label: "Dashboard",
    to: "/owner",
    category: "Overview",
    icon: LayoutDashboard,
    keywords: ["ringkasan", "beranda", "statistik", "overview"],
  },
  {
    label: "Armada Kapal",
    to: "/owner/fleet",
    category: "Armada",
    icon: Ship,
    keywords: ["kapal", "armada", "kuota", "sipi", "gt", "gross tonnage"],
  },
  {
    label: "Nahkoda",
    to: "/owner/captains",
    category: "Armada",
    icon: Anchor,
    keywords: ["nahkoda", "captain", "lisensi", "sikpi", "kapten"],
  },
];

const navItems = [
  {
    label: "Dashboard",
    to: "/owner",
    end: true,
    Icon: LayoutDashboard,
    prefetch: () => import("../OwnerDashboard"),
  },
  {
    label: "Armada Kapal",
    to: "/owner/fleet",
    Icon: Ship,
    prefetch: () => import("../FleetPage"),
  },
  {
    label: "Nahkoda",
    to: "/owner/captains",
    Icon: Anchor,
    prefetch: () => import("../CaptainsPage"),
  },
];

export function OwnerSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav
      className="flex flex-col gap-1 py-1 pb-4 w-full min-w-0 overflow-hidden"
      aria-label="Navigasi Pemilik"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          onMouseEnter={item.prefetch}
          className={({ isActive }) =>
            `w-full min-w-0 max-w-full box-border flex items-center gap-3 h-10 px-3.5 rounded-xl text-sm transition-all duration-150 no-underline cursor-pointer group ${
              isActive
                ? "bg-fco-blue text-white font-semibold shadow-xs border border-fco-blue"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40 font-medium border border-transparent"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.Icon
                size={18}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                }`}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span className="truncate">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export const SidebarBody = OwnerSidebarNav;
export const OwnerSidebar = OwnerSidebarNav;

export function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const navigate = useNavigate();
  const toast = useToast();
  const userInfo = getUserDisplayInfo();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = authService.getUserRole();
  if (userRole === "regulator") {
    return <Navigate to="/regulator" replace />;
  }
  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }
  if (userRole === "captain") {
    return <Navigate to="/captain" replace />;
  }

  const isOpen = isDesktop ? sidebarOpen : mobileOpen;

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logout berhasil. Sesi telah diakhiri.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen surface-page text-strong flex">
      {/* 1. Desktop Left Sidebar */}
      <aside
        aria-label="Menu Navigasi Pemilik"
        className={`hidden lg:flex flex-col bg-[#fafbfc] dark:bg-[#121820] text-strong fixed top-0 bottom-0 left-0 z-30 shadow-2xs transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "w-64 border-r border-slate-200/80 dark:border-fco-border-dark" : "w-0 border-r-0"
        }`}
      >
        <div className="w-64 flex flex-col h-full shrink-0 overflow-hidden">
          <div className="h-16 px-5 border-b border-slate-200/80 dark:border-fco-border-dark flex items-center shrink-0">
            <Link to="/owner" className="no-underline">
              <Logo variant="light" size={28} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
            <OwnerSidebarNav />
          </div>

          <div className="p-3 px-4 border-t border-slate-200/80 dark:border-fco-border-dark flex items-center justify-between bg-slate-50/80 dark:bg-[#0f151c] text-xs text-soft shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-strong text-2xs uppercase tracking-wider">
                Armada Aktif
              </span>
            </div>
            <span className="text-2xs font-mono text-soft px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              v1.0.0
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
        <div
          role="dialog"
          aria-label="Menu navigasi mobile"
          className={`relative w-64 max-w-[80vw] h-full bg-[#fafbfc] dark:bg-[#121820] border-r border-slate-200/80 dark:border-fco-border-dark text-strong flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-in-out overflow-hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 px-4 border-b border-slate-200/80 dark:border-fco-border-dark flex items-center justify-between shrink-0">
            <Link to="/owner" className="no-underline">
              <Logo variant="light" size={28} />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-soft hover:text-strong border-none cursor-pointer transition-colors"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
            <OwnerSidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>

          <div className="p-3 px-4 border-t border-slate-200/80 dark:border-fco-border-dark flex items-center justify-between bg-slate-50/80 dark:bg-[#0f151c] text-xs text-soft shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-strong text-2xs uppercase tracking-wider">
                Armada Aktif
              </span>
            </div>
            <span className="text-2xs font-mono text-soft px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main View Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        <header className="h-16 px-4 sm:px-7 surface-card border-b border-fco-border-subtle sticky top-0 z-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                if (isDesktop) {
                  setSidebarOpen((prev) => !prev);
                } else {
                  setMobileOpen((prev) => !prev);
                }
              }}
              title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
              aria-label={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
              aria-expanded={isOpen}
              className="w-9 h-9 rounded-lg surface-inset hover:surface-page text-soft hover:text-strong flex items-center justify-center cursor-pointer border border-fco-border-subtle transition-all duration-200 shrink-0"
            >
              {isOpen ? (
                <X
                  size={18}
                  className="animate-in fade-in zoom-in-75 duration-150 text-strong"
                  aria-hidden="true"
                />
              ) : (
                <Menu
                  size={18}
                  className="animate-in fade-in zoom-in-75 duration-150"
                  aria-hidden="true"
                />
              )}
            </button>

            {/* Search Menu */}
            <QuickSearchMenu
              items={ownerSearchItems}
              placeholder="Cari armada / menu... (Ctrl+K)"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <FullscreenToggle compact />
            <ThemeToggle compact />
            <UserProfileBadge
              initials={userInfo.initials}
              name={userInfo.name}
              role={userInfo.roleLabel}
              onLogout={handleLogout}
            />
          </div>
        </header>

        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
