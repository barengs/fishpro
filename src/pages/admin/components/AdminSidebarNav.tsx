import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Anchor,
  BarChart3,
  Building2,
  ChevronDown,
  ClipboardList,
  Compass,
  Fish,
  KeyRound,
  LayoutDashboard,
  Link2,
  MapPin,
  Scale,
  Ship,
  Users,
} from "lucide-react";

export function AdminSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  const isUserPath =
    location.pathname.startsWith("/admin/owners") ||
    location.pathname.startsWith("/admin/captains") ||
    location.pathname.startsWith("/admin/users");

  const isCatalogPath =
    location.pathname.startsWith("/admin/species") ||
    location.pathname.startsWith("/admin/areas");

  const isAuditPath =
    location.pathname.startsWith("/admin/quota") ||
    location.pathname.startsWith("/admin/blockchain");

  const [userToggled, setUserToggled] = useState<boolean | null>(null);
  const [catalogToggled, setCatalogToggled] = useState<boolean | null>(null);
  const [auditToggled, setAuditToggled] = useState<boolean | null>(null);

  const usersOpen = userToggled ?? isUserPath;
  const catalogOpen = catalogToggled ?? isCatalogPath;
  const auditOpen = auditToggled ?? isAuditPath;

  return (
    <div className="flex flex-col gap-1">
      {/* 1. Ringkasan */}
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

      {/* 2. Kapal */}
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

      {/* 3. Submenu Pengguna */}
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

      {/* 4. Laporan Tangkapan */}
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

      {/* 5. Submenu Katalog Perikanan */}
      <div>
        <button
          type="button"
          onClick={() => setCatalogToggled(!catalogOpen)}
          className={`w-full flex items-center justify-between h-10.5 px-3 rounded-fco text-sm font-semibold border-none cursor-pointer transition-all text-left ${
            isCatalogPath
              ? "text-fco-blue bg-fco-blue-light/50 dark:bg-fco-blue/15"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Compass
              size={20}
              className="shrink-0"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span>Katalog Perikanan</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 shrink-0 ${
              catalogOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {catalogOpen && (
          <div className="relative pl-3 mt-1 flex flex-col gap-0.5">
            <div className="absolute left-6 top-1 bottom-1 w-px bg-fco-border-subtle dark:bg-fco-border-dark" />
            <NavLink
              to="/admin/species"
              onClick={onNavigate}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 h-9 pl-6 pr-3 rounded-fco text-xs sm:text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-fco-blue bg-fco-blue-light"
                    : "text-soft hover:surface-page hover:text-strong"
                }`
              }
            >
              <Fish
                size={15}
                className="shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>Spesies Ikan</span>
            </NavLink>
            <NavLink
              to="/admin/areas"
              onClick={onNavigate}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 h-9 pl-6 pr-3 rounded-fco text-xs sm:text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-fco-blue bg-fco-blue-light"
                    : "text-soft hover:surface-page hover:text-strong"
                }`
              }
            >
              <MapPin
                size={15}
                className="shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>Wilayah (WPP)</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* 6. Submenu Regulasi & Audit */}
      <div>
        <button
          type="button"
          onClick={() => setAuditToggled(!auditOpen)}
          className={`w-full flex items-center justify-between h-10.5 px-3 rounded-fco text-sm font-semibold border-none cursor-pointer transition-all text-left ${
            isAuditPath
              ? "text-fco-blue bg-fco-blue-light/50 dark:bg-fco-blue/15"
              : "bg-transparent text-soft hover:surface-page hover:text-strong"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Scale
              size={20}
              className="shrink-0"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span>Regulasi & Audit</span>
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 shrink-0 ${
              auditOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {auditOpen && (
          <div className="relative pl-3 mt-1 flex flex-col gap-0.5">
            <div className="absolute left-6 top-1 bottom-1 w-px bg-fco-border-subtle dark:bg-fco-border-dark" />
            <NavLink
              to="/admin/quota"
              onClick={onNavigate}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 h-9 pl-6 pr-3 rounded-fco text-xs sm:text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-fco-blue bg-fco-blue-light"
                    : "text-soft hover:surface-page hover:text-strong"
                }`
              }
            >
              <BarChart3
                size={15}
                className="shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>Kuota & PNBP</span>
            </NavLink>
            <NavLink
              to="/admin/blockchain"
              onClick={onNavigate}
              className={({ isActive }) =>
                `relative flex items-center gap-2.5 h-9 pl-6 pr-3 rounded-fco text-xs sm:text-sm font-semibold no-underline transition-colors ${
                  isActive
                    ? "text-fco-blue bg-fco-blue-light"
                    : "text-soft hover:surface-page hover:text-strong"
                }`
              }
            >
              <Link2
                size={15}
                className="shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>Blockchain</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* 7. Peran & Akses */}
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
        <KeyRound
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

// Re-export alias for backward compatibility
export const SidebarBody = AdminSidebarNav;
