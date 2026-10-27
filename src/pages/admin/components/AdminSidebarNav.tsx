import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
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
  Ship,
} from "lucide-react";

interface AdminSidebarNavProps {
  onNavigate?: () => void;
}

interface NavItem {
  label: string;
  to: string;
  end?: boolean;
  Icon: LucideIcon;
  prefetch?: () => Promise<unknown>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Main Menu",
    items: [
      {
        label: "Dashboard",
        to: "/admin",
        end: true,
        Icon: LayoutDashboard,
        prefetch: () => import("../AdminDashboard"),
      },
    ],
  },
  {
    title: "Armada",
    items: [
      {
        label: "Kapal",
        to: "/admin/ships",
        Icon: Ship,
        prefetch: () => import("../ShipsPage"),
      },
      {
        label: "Pemilik Kapal",
        to: "/admin/owners",
        Icon: Building2,
        prefetch: () => import("../OwnersTab"),
      },
      {
        label: "Nahkoda",
        to: "/admin/captains",
        Icon: Anchor,
        prefetch: () => import("../CaptainsTab"),
      },
    ],
  },
  {
    title: "Operasional",
    items: [
      {
        label: "Laporan Tangkapan",
        to: "/admin/catches",
        Icon: ClipboardList,
        prefetch: () => import("../CatchesPage"),
      },
      {
        label: "Spesies Ikan",
        to: "/admin/species",
        Icon: Fish,
        prefetch: () => import("../SpeciesPage"),
      },
      {
        label: "Wilayah (WPP)",
        to: "/admin/areas",
        Icon: MapPin,
        prefetch: () => import("../AreasPage"),
      },
    ],
  },
  {
    title: "Kepatuhan & Sistem",
    items: [
      {
        label: "Kuota & PNBP",
        to: "/admin/quota",
        Icon: BarChart3,
        prefetch: () => import("../QuotaPnbpPage"),
      },
      {
        label: "Blockchain",
        to: "/admin/blockchain",
        Icon: Link2,
        prefetch: () => import("../BlockchainPage"),
      },
      {
        label: "Perangkat IoT",
        to: "/admin/iot-devices",
        Icon: Cpu,
        prefetch: () => import("../IotDevicesPage"),
      },
      {
        label: "Peran & Hak Akses",
        to: "/admin/roles",
        Icon: KeyRound,
        prefetch: () => import("../RolesMenusPage"),
      },
    ],
  },
];

export function AdminSidebarNav({ onNavigate }: AdminSidebarNavProps) {
  // ponytail: static nav groups array; upgrade to dynamic permission-filtered tree when role-menus API supports hierarchical nesting
  return (
    <nav
      className="flex flex-col gap-4 py-1 pb-4 w-full min-w-0 overflow-hidden"
      aria-label="Navigasi Admin"
    >
      {navGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <div className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {group.title}
          </div>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => (
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
          </div>
        </div>
      ))}
    </nav>
  );
}

export const SidebarBody = AdminSidebarNav;
