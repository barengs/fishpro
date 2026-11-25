import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import {
  Anchor,
  BarChart3,
  Building2,
  ClipboardList,
  Cpu,
  Fish,
  KeyRound,
  LayoutDashboard,
  Link2,
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
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { useToast } from "../../../components/toast";
import { AdminSidebarNav } from "./AdminSidebarNav";

export {
  AdminSidebarNav,
  AdminSidebarNav as SidebarBody,
} from "./AdminSidebarNav";

const adminSearchItems: QuickSearchItem[] = [
  {
    label: "Dashboard",
    to: "/admin",
    category: "Overview",
    icon: LayoutDashboard,
    keywords: ["ringkasan", "beranda", "statistik", "overview", "kpi"],
  },
  {
    label: "Kapal",
    to: "/admin/ships",
    category: "Armada",
    icon: Ship,
    keywords: ["kapal", "registrasi", "sipi", "gt", "gross tonnage", "armada"],
  },
  {
    label: "Pemilik Kapal",
    to: "/admin/owners",
    category: "Armada",
    icon: Building2,
    keywords: ["pemilik", "owner", "perusahaan", "pt", "cv", "badan usaha"],
  },
  {
    label: "Nahkoda",
    to: "/admin/captains",
    category: "Armada",
    icon: Anchor,
    keywords: ["nahkoda", "captain", "lisensi", "sikpi", "pelaut", "kapten"],
  },
  {
    label: "Timbangan IoT (Live)",
    to: "/admin/scales",
    category: "Operasional Lapangan",
    icon: Scale,
    keywords: [
      "timbangan",
      "iot",
      "timbang",
      "scale",
      "live",
      "bobot",
      "dermaga",
      "pelabuhan",
    ],
  },
  {
    label: "Laporan Tangkapan",
    to: "/admin/catches",
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
    label: "Spesies Ikan",
    to: "/admin/species",
    category: "Katalog",
    icon: Fish,
    keywords: [
      "spesies",
      "taksonomi",
      "nama ilmiah",
      "ikan",
      "biologi",
      "katalog",
    ],
  },
  {
    label: "Wilayah (WPP)",
    to: "/admin/areas",
    category: "Katalog",
    icon: MapPin,
    keywords: ["wpp", "wilayah", "wppnri", "zona", "area", "laut"],
  },
  {
    label: "Kuota & PNBP",
    to: "/admin/quota",
    category: "Regulasi",
    icon: BarChart3,
    keywords: ["kuota", "pnbp", "tarif", "alokasi", "prediksi", "ai", "lstm"],
  },
  {
    label: "Blockchain",
    to: "/admin/blockchain",
    category: "Audit & Keamanan",
    icon: Link2,
    keywords: [
      "blockchain",
      "blok",
      "hash",
      "sha256",
      "ledger",
      "transaksi",
      "verifikasi",
    ],
  },
  {
    label: "Perangkat IoT",
    to: "/admin/iot-devices",
    category: "Hardware & Sensor",
    icon: Cpu,
    keywords: [
      "iot",
      "timbangan",
      "smart scale",
      "sensor",
      "perangkat",
      "device",
    ],
  },
  {
    label: "Peran & Hak Akses",
    to: "/admin/roles",
    category: "Pengaturan Sistem",
    icon: KeyRound,
    keywords: [
      "role",
      "peran",
      "menu",
      "hak akses",
      "izin",
      "petugas",
      "admin",
      "regulator",
    ],
  },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const navigate = useNavigate();
  const toast = useToast();

  const isSuperAdmin = authService.isSuperAdmin();
  const userInfo = getUserDisplayInfo();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Pure role-based guard: if staff visits /admin, direct to /staff
  if (!isSuperAdmin) {
    return <Navigate to="/staff" replace />;
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
        aria-label="Menu Navigasi Admin"
        className={`hidden lg:flex flex-col bg-white dark:bg-[#111827] text-ink dark:text-white fixed top-0 bottom-0 left-0 z-30 transition-all duration-200 overflow-hidden ${
          sidebarOpen ? "w-[240px] border-r border-[#E5E7EB] dark:border-slate-800" : "w-0 border-r-0"
        }`}
      >
        <div className="w-[240px] flex flex-col h-full shrink-0 overflow-hidden justify-between">
          <div className="flex flex-col min-h-0 overflow-hidden">
            {/* Brand Header */}
            <div className="h-16 px-4 border-b border-[#E5E7EB]/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <Link to="/admin" className="no-underline flex items-center gap-2">
                <Logo variant="light" size={26} />
              </Link>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                title="Sembunyikan Sidebar"
                aria-label="Sembunyikan Sidebar"
                className="w-7 h-7 rounded-md border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center justify-center text-charcoal hover:text-ink dark:text-slate-300 transition-colors cursor-pointer shrink-0"
              >
                <X size={14} />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
              <AdminSidebarNav />
            </div>
          </div>

          {/* Bottom status */}
          <div className="p-3 border-t border-[#E5E7EB]/80 dark:border-slate-800 space-y-2 shrink-0">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  ADM
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-subtext leading-none">Akses</p>
                  <p className="text-[12px] font-semibold text-ink dark:text-white truncate mt-0.5">
                    {isSuperAdmin ? "Super Admin" : "Admin"}
                  </p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide rounded-md bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-300">
                {isSuperAdmin ? "Kelola" : "Operasi"}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Overlay with Smooth CSS Transitions */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ease-in-out ${
          mobileOpen
            ? "opacity-100 pointer-events-auto visible"
            : "opacity-0 pointer-events-none invisible"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[#09090B]/25 backdrop-blur-[1px] cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          role="dialog"
          aria-label="Menu navigasi mobile"
          className={`relative w-[240px] max-w-[80vw] h-full bg-white dark:bg-[#111827] border-r border-[#E5E7EB] dark:border-slate-800 text-ink dark:text-white flex flex-col shadow-popover z-10 transition-transform duration-300 ease-in-out overflow-hidden justify-between ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col min-h-0 overflow-hidden">
            <div className="h-16 px-4 border-b border-[#E5E7EB]/80 dark:border-slate-800 flex items-center justify-between shrink-0">
              <Link to="/admin" className="no-underline">
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
              <AdminSidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>

          <div className="p-3 border-t border-[#E5E7EB]/80 dark:border-slate-800 shrink-0">
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-700 text-xs">
              <RoleBadge role="superadmin" size="sm" />
              <span className="text-[10px] font-mono text-subtext">
                Tata Kelola
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main View Area (Offset right of sidebar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "lg:pl-[240px]" : "lg:pl-0"
        }`}
      >
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 bg-white dark:bg-[#111827] border-b border-[#E5E7EB] dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Hamburger / Toggle Button */}
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
              <Menu size={16} aria-hidden="true" />
            </button>

            {/* Quick Search Menu */}
            <QuickSearchMenu
              items={adminSearchItems}
              placeholder="Search... (Ctrl+K)"
            />
          </div>

          {/* Right Header Controls */}
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
