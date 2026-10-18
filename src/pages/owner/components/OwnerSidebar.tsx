import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Anchor, LayoutDashboard, Menu, Search, Ship, X } from "lucide-react";
import { Logo } from "../../../components/Logo";
import { NotificationBell } from "../../../components/NotificationBell";
import { UserProfileBadge } from "../../../components/UserProfileBadge";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { FullscreenToggle } from "../../../components/FullscreenToggle";
import { authService, getUserDisplayInfo } from "../../../services/auth";
import { useToast } from "../../../components/toast";

const navItems = [
  { label: "Dashboard", to: "/owner", end: true, Icon: LayoutDashboard },
  { label: "Armada Kapal", to: "/owner/fleet", Icon: Ship },
  { label: "Nahkoda", to: "/owner/captains", Icon: Anchor },
];

export function OwnerSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav
      className="flex flex-col gap-1 py-1 pb-4"
      aria-label="Navigasi Pemilik"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3.5 h-10 px-3.5 rounded-lg text-sm transition-all no-underline cursor-pointer ${
              isActive
                ? "bg-white text-[#0e2756] font-bold shadow-sm"
                : "text-blue-100/75 hover:text-white hover:bg-white/10 font-medium"
            }`
          }
        >
          <item.Icon
            size={18}
            className="shrink-0 transition-colors"
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span className="truncate">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export const SidebarBody = OwnerSidebarNav;

export function OwnerSidebar() {
  return (
    <aside
      aria-label="Menu Navigasi Pemilik"
      className="hidden lg:flex flex-col w-64 bg-[#0e2756] dark:bg-[#0a1a3a] text-white fixed top-0 bottom-0 left-0 z-30 shadow-md border-r border-[#1a3875]"
    >
      <div className="w-64 flex flex-col h-full shrink-0">
        <div className="h-16 px-5 border-b border-white/10 flex items-center shrink-0">
          <Link to="/owner" className="no-underline">
            <Logo variant="dark" size={28} />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          <OwnerSidebarNav />
        </div>
        <div className="p-3 px-4 border-t border-white/10 flex items-center justify-between bg-black/20 text-xs text-blue-200/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white text-2xs uppercase tracking-wider">
              Armada Aktif
            </span>
          </div>
          <span className="text-2xs font-mono text-blue-200 px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
            v1.0.0
          </span>
        </div>
      </div>
    </aside>
  );
}

export function OwnerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const userInfo = getUserDisplayInfo();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isOpen = isDesktop ? sidebarOpen : mobileOpen;

  const handleLogout = async () => {
    await authService.logout();
    toast.success("Logout berhasil. Sesi telah diakhiri.");
    navigate("/login");
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/owner/fleet?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <div className="min-h-screen surface-page text-strong flex">
      {/* 1. Desktop Left Sidebar */}
      <aside
        aria-label="Menu Navigasi Pemilik"
        className={`hidden lg:flex flex-col bg-[#0e2756] dark:bg-[#0a1a3a] text-white fixed top-0 bottom-0 left-0 z-30 shadow-md transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? "w-64 border-r border-[#1a3875]"
            : "w-0 border-r-0 overflow-hidden"
        }`}
      >
        <div className="w-64 flex flex-col h-full shrink-0">
          <div className="h-16 px-5 border-b border-white/10 flex items-center shrink-0">
            <Link to="/owner" className="no-underline">
              <Logo variant="dark" size={28} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-3 min-h-0">
            <OwnerSidebarNav />
          </div>

          <div className="p-3 px-4 border-t border-white/10 flex items-center justify-between bg-black/20 text-xs text-blue-200/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white text-2xs uppercase tracking-wider">
                Armada Aktif
              </span>
            </div>
            <span className="text-2xs font-mono text-blue-200 px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
              v1.0.0
            </span>
          </div>
        </div>
      </aside>

      {/* 2. Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
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
          className={`relative w-64 max-w-[80vw] h-full bg-[#0e2756] dark:bg-[#0a1a3a] border-r border-[#1a3875] text-white flex flex-col shadow-2xl z-10 transition-transform duration-300 ease-in-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <Link to="/owner" className="no-underline">
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

          <div className="flex-1 overflow-y-auto p-3 min-h-0">
            <OwnerSidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>

          <div className="p-3 px-4 border-t border-white/10 flex items-center justify-between bg-black/20 text-xs text-blue-200/80 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white text-2xs uppercase tracking-wider">
                Armada Aktif
              </span>
            </div>
            <span className="text-2xs font-mono text-blue-200 px-1.5 py-0.5 rounded bg-white/10 border border-white/10">
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

            <form
              onSubmit={handleHeaderSearch}
              className="relative w-full max-w-72 sm:max-w-88"
            >
              <Search
                size={16}
                className="text-soft absolute left-3 top-2.5 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari armada kapal..."
                className="w-full h-9 pl-9 pr-3.5 rounded-lg border border-fco-border-subtle surface-inset text-xs sm:text-sm field-input focus:outline-hidden focus:border-fco-blue transition-colors"
              />
            </form>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <NotificationBell count={1} />
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
