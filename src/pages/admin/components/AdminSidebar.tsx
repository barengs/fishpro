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
  Ship,
  X,
} from "lucide-react";
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
  if (userRole && userRole !== "admin") {
    return <Navigate to={authService.getDashboardUrl()} replace />;
  }

  const isOpen = isDesktop ? sidebarOpen : mobileOpen;

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logout berhasil. Sesi telah diakhiri.");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen surface-page text-strong flex">
      {/* 1. Desktop Left Sidebar (Deep Navy Oceanic Blue) */}
      <aside
        aria-label="Menu Navigasi Admin"
        className={`hidden lg:flex flex-col bg-[#0e2756] dark:bg-[#0a1a3a] text-white fixed top-0 bottom-0 left-0 z-30 shadow-md transition-all duration-300 ease-in-out overflow-hidden ${
          sidebarOpen ? "w-64 border-r border-[#1a3875]" : "w-0 border-r-0"
        }`}
      >
        <div className="w-64 flex flex-col h-full shrink-0 overflow-hidden">
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-white/10 flex items-center shrink-0">
            <Link to="/admin" className="no-underline">
              <Logo variant="dark" size={28} />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
            <AdminSidebarNav />
          </div>

          {/* Bottom-left: Clean System Status Indicator */}
          <div className="p-3 px-4 border-t border-white/10 flex items-center justify-between bg-black/20 text-xs text-blue-200/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white text-2xs uppercase tracking-wider">
                Sistem KKP
              </span>
            </div>
            <span className="text-2xs font-mono text-blue-200 px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
              v1.0.0
            </span>
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
          className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          onClick={() => setMobileOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          role="dialog"
          aria-label="Menu navigasi mobile"
          className={`relative w-64 max-w-[80vw] h-full bg-[#0e2756] dark:bg-[#0a1a3a] border-r border-[#1a3875] text-white flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-in-out overflow-hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <Link to="/admin" className="no-underline">
              <Logo variant="dark" size={28} />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/80 hover:text-white border-none cursor-pointer transition-colors"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 min-h-0">
            <AdminSidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>

          <div className="p-3 px-4 border-t border-white/10 flex items-center justify-between bg-black/20 text-xs text-blue-200/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white text-2xs uppercase tracking-wider">
                Sistem KKP
              </span>
            </div>
            <span className="text-2xs font-mono text-blue-200 px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main View Area (Offset right of sidebar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "lg:pl-64" : "lg:pl-0"
        }`}
      >
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-7 surface-card border-b border-fco-border-subtle sticky top-0 z-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Hamburger / Close Toggle Button */}
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

            {/* Quick Search Menu */}
            <QuickSearchMenu
              items={adminSearchItems}
              placeholder="Cari menu... (Ctrl+K)"
            />
          </div>

          {/* Right Header Controls */}
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

        {/* Content Body */}
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
