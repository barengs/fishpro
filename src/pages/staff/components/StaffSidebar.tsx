import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  Anchor,
  Building2,
  ClipboardList,
  Fish,
  LayoutDashboard,
  MapPin,
  Menu,
  Scale,
  Ship,
  X,
} from "lucide-react";
import { Logo } from "../../../components/Logo";
import { UserProfileBadge } from "../../../components/UserProfileBadge";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { FullscreenToggle } from "../../../components/FullscreenToggle";
import { RoleBadge } from "../../../components/RoleBadge";
import {
  QuickSearchMenu,
  type QuickSearchItem,
} from "../../../components/QuickSearchMenu";
import { StaffSidebarNav } from "./StaffSidebarNav";
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { useToast } from "../../../components/toast";

const staffSearchItems: QuickSearchItem[] = [
  {
    label: "Dashboard",
    to: "/staff",
    category: "Overview",
    icon: LayoutDashboard,
    keywords: ["beranda", "ringkasan", "overview", "staf", "statistik"],
  },
  {
    label: "Timbangan IoT (Live)",
    to: "/staff/scales",
    category: "Operasional Lapangan",
    icon: Scale,
    keywords: [
      "timbangan",
      "iot",
      "timbang",
      "scale",
      "dermaga",
      "pelabuhan",
      "bobot",
    ],
  },
  {
    label: "Laporan Tangkapan",
    to: "/staff/catches",
    category: "Operasional",
    icon: ClipboardList,
    keywords: [
      "tangkapan",
      "laporan",
      "catch",
      "ikan",
      "bobot",
      "volume",
      "pnbp",
    ],
  },
  {
    label: "Kapal",
    to: "/staff/ships",
    category: "Armada",
    icon: Ship,
    keywords: ["kapal", "ship", "registrasi", "gt", "armada", "perahu"],
  },
  {
    label: "Pemilik Kapal",
    to: "/staff/owners",
    category: "Armada",
    icon: Building2,
    keywords: ["pemilik", "owner", "perusahaan", "pt", "cv"],
  },
  {
    label: "Nahkoda",
    to: "/staff/captains",
    category: "Armada",
    icon: Anchor,
    keywords: ["nahkoda", "captain", "lisensi", "sikpi", "pelaut", "kapten"],
  },
  {
    label: "Spesies Ikan",
    to: "/staff/species",
    category: "Katalog",
    icon: Fish,
    keywords: ["spesies", "taksonomi", "nama ilmiah", "ikan", "katalog"],
  },
  {
    label: "Wilayah (WPP)",
    to: "/staff/areas",
    category: "Katalog",
    icon: MapPin,
    keywords: ["wpp", "wilayah", "wppnri", "zona", "area", "laut"],
  },
];

export function StaffSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const userRole = authService.getUserRole();
  if (userRole && userRole !== "admin" && userRole !== "superadmin") {
    return <Navigate to={authService.getDashboardUrl()} replace />;
  }

  const isOpen = isDesktop ? sidebarOpen : mobileOpen;

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Anda telah berhasil keluar dari akun.");
    navigate("/login", { replace: true });
  };

  const userInfo = getUserDisplayInfo();

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0b1220] text-ink dark:text-white flex">
      {/* 1. Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-30 bg-white dark:bg-[#111827] text-ink dark:text-white transition-all duration-200 overflow-hidden ${
          sidebarOpen ? "w-[240px] border-r border-[#E5E7EB] dark:border-slate-800" : "w-0 -translate-x-full border-r-0"
        }`}
        aria-label="Sidebar Staf Lapangan"
      >
        <div className="w-[240px] h-full flex flex-col shrink-0 overflow-hidden justify-between">
          <div className="flex flex-col min-h-0 overflow-hidden">
            {/* Logo Header */}
            <div className="h-16 px-4 border-b border-[#E5E7EB]/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <Link to="/staff" className="no-underline flex items-center gap-2">
                <Logo variant="light" size={26} />
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                title="Tutup Sidebar"
                className="w-7 h-7 rounded-md border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center text-charcoal hover:text-ink dark:text-slate-300 transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
              <StaffSidebarNav />
            </div>
          </div>

          {/* Bottom-left: Status Indicator */}
          <div className="p-3 border-t border-[#E5E7EB]/80 dark:border-slate-800 space-y-2 shrink-0">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700">
              <RoleBadge role="admin" label="Staf Lapangan" size="sm" />
              <span className="text-[9.5px] font-mono text-subtext px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 shrink-0">
                Operasional
              </span>
            </div>
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
          className="absolute inset-0 bg-[#09090B]/25 backdrop-blur-[1px] cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`relative w-[240px] max-w-[80vw] h-full bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-slate-800 text-ink dark:text-white flex flex-col shadow-popover z-10 transition-transform duration-300 ease-in-out overflow-hidden justify-between ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="h-16 px-4 border-b border-[#E5E7EB]/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <Link to="/staff" className="no-underline">
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
              <StaffSidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>

          <div className="p-3 border-t border-[#E5E7EB]/80 dark:border-slate-800 shrink-0">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700 text-xs">
              <RoleBadge role="admin" label="Staf Lapangan" size="sm" />
              <span className="text-[10px] font-mono text-subtext px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 shrink-0">
                Operasional
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main View Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "lg:pl-[240px]" : "lg:pl-0"
        }`}
      >
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-md">
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
              className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center text-charcoal hover:text-ink dark:text-slate-300 transition-colors cursor-pointer shrink-0"
            >
              {isOpen ? (
                <X size={15} aria-hidden="true" />
              ) : (
                <Menu size={15} aria-hidden="true" />
              )}
            </button>

            <QuickSearchMenu
              items={staffSearchItems}
              placeholder="Search... (Ctrl+K)"
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

        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-7 max-w-[1440px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export const StaffLayout = StaffSidebar;
