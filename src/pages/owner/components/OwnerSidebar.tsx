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
      className="flex flex-col gap-0.5 py-1 pb-4 w-full min-w-0 overflow-hidden"
      aria-label="Navigasi Pemilik"
    >
      <p className="px-2.5 mb-1.5 mt-2 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-faint dark:text-slate-400">
        Menu Utama
      </p>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          onMouseEnter={item.prefetch}
          className={({ isActive }) =>
            `w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13.5px] transition-colors cursor-pointer no-underline ${
              isActive
                ? "bg-[#F3F4F6] dark:bg-slate-800 text-ink dark:text-white font-semibold"
                : "text-inkSoft dark:text-slate-300 hover:bg-[#F3F4F6]/70 dark:hover:bg-slate-800/60 font-medium"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.Icon
                size={17}
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-ink dark:text-white"
                    : "text-charcoal dark:text-slate-400"
                }`}
                strokeWidth={isActive ? 2.2 : 1.75}
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
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("fco-owner-sidebar-open");
      if (saved !== null) return saved === "true";
    }
    return true;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );
  const navigate = useNavigate();
  const toast = useToast();
  const userInfo = getUserDisplayInfo();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isDesktop) {
      setSidebarOpen((prev) => {
        const next = !prev;
        localStorage.setItem("fco-owner-sidebar-open", String(next));
        return next;
      });
    } else {
      setMobileOpen((prev) => !prev);
    }
  };

  const handleCloseDesktopSidebar = () => {
    setSidebarOpen(false);
    localStorage.setItem("fco-owner-sidebar-open", "false");
  };

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
    toast.success("Anda telah berhasil keluar dari akun.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0b1220] text-ink dark:text-white flex">
      {/* 1. Desktop Left Sidebar */}
      <aside
        aria-label="Menu Navigasi Pemilik"
        className={`hidden md:flex flex-col bg-white dark:bg-[#111827] text-ink dark:text-white fixed top-0 bottom-0 left-0 z-30 transition-all duration-200 overflow-hidden ${
          sidebarOpen ? "w-[240px] border-r border-[#E5E7EB] dark:border-slate-800" : "w-0 border-r-0"
        }`}
      >
        <div className="w-[240px] flex flex-col h-full shrink-0 overflow-hidden justify-between">
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="h-16 px-4 border-b border-[#E5E7EB]/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <Link to="/owner" className="no-underline flex items-center gap-2">
                <Logo variant="light" size={26} />
              </Link>
              <button
                type="button"
                onClick={handleCloseDesktopSidebar}
                title="Tutup Sidebar"
                className="w-7 h-7 rounded-md border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center text-charcoal hover:text-ink dark:text-slate-300 transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
              <OwnerSidebarNav />
            </div>
          </div>

          <div className="p-3 border-t border-[#E5E7EB]/80 dark:border-slate-800 space-y-2 shrink-0">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  OWN
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-subtext leading-none">Armada</p>
                  <p className="text-[12px] font-semibold text-ink dark:text-white truncate mt-0.5">
                    Pemilik Kapal
                  </p>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-[#09090B]/25 backdrop-blur-[1px] cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
        <div
          role="dialog"
          aria-label="Menu navigasi mobile"
          className={`relative w-[240px] max-w-[80vw] h-full bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-slate-800 text-ink dark:text-white flex flex-col shadow-popover z-10 transition-transform duration-300 ease-in-out overflow-hidden justify-between ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="h-16 px-4 border-b border-[#E5E7EB]/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <Link to="/owner" className="no-underline">
                <Logo variant="light" size={26} />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="w-7 h-7 rounded-md border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-charcoal hover:text-ink border-none cursor-pointer transition-colors"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
              <OwnerSidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>

          <div className="p-3 border-t border-[#E5E7EB]/80 dark:border-slate-800 shrink-0">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700 text-xs">
              <span className="font-semibold text-ink dark:text-white text-2xs uppercase">
                Armada Aktif
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main View Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "md:pl-[240px]" : "md:pl-0"
        }`}
      >
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={handleToggleSidebar}
              title={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
              aria-label={isOpen ? "Tutup Sidebar" : "Buka Sidebar"}
              aria-expanded={isOpen}
              className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center text-charcoal hover:text-ink dark:text-slate-300 transition-colors cursor-pointer shrink-0"
            >
              {isOpen ? (
                <X size={15} aria-hidden="true" />
              ) : (
                <Menu size={15} aria-hidden="true" />
              )}
            </button>

            {/* Search Menu */}
            <QuickSearchMenu
              items={ownerSearchItems}
              placeholder="Search armada / menu... (Ctrl+K)"
            />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <FullscreenToggle compact />
            <ThemeToggle compact />
            <div className="h-5 w-px bg-[#E5E7EB] dark:bg-slate-700 mx-1 hidden sm:block" />
            <UserProfileBadge
              initials={userInfo.initials}
              name={userInfo.name}
              role={userInfo.roleLabel}
              rawRole={userInfo.rawRole}
              onLogout={handleLogout}
            />
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 max-w-[1440px] w-full mx-auto space-y-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
