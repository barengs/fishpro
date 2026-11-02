import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Building2,
  ClipboardList,
  Fish,
  LayoutDashboard,
  MapPin,
  Scale,
  Ship,
} from "lucide-react";
import { authService } from "../../../services/auth";

interface StaffSidebarNavProps {
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

const staffNavGroups: NavGroup[] = [
  {
    title: "Utama",
    items: [
      {
        label: "Dashboard",
        to: "/staff",
        end: true,
        Icon: LayoutDashboard,
        prefetch: () => import("../StaffDashboard"),
      },
    ],
  },
  {
    title: "Operasional Lapangan",
    items: [
      {
        label: "Timbangan IoT (Live)",
        to: "/staff/scales",
        Icon: Scale,
        prefetch: () => import("../../regulator/IotScalesPage"),
      },
      {
        label: "Laporan Tangkapan",
        to: "/staff/catches",
        Icon: ClipboardList,
        prefetch: () => import("../../admin/CatchesPage"),
      },
    ],
  },
  {
    title: "Administrasi Armada",
    items: [
      {
        label: "Kapal",
        to: "/staff/ships",
        Icon: Ship,
        prefetch: () => import("../../admin/ShipsPage"),
      },
      {
        label: "Pemilik Kapal",
        to: "/staff/owners",
        Icon: Building2,
        prefetch: () => import("../../admin/OwnersTab"),
      },
      {
        label: "Nahkoda",
        to: "/staff/captains",
        Icon: Anchor,
        prefetch: () => import("../../admin/CaptainsTab"),
      },
    ],
  },
  {
    title: "Katalog & Wilayah",
    items: [
      {
        label: "Spesies Ikan",
        to: "/staff/species",
        Icon: Fish,
        prefetch: () => import("../../admin/SpeciesPage"),
      },
      {
        label: "Wilayah (WPP)",
        to: "/staff/areas",
        Icon: MapPin,
        prefetch: () => import("../../admin/AreasPage"),
      },
    ],
  },
];

export function StaffSidebarNav({ onNavigate }: StaffSidebarNavProps) {
  const visibleGroups = staffNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        authService.hasMenuPermission(item.to),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <nav
      className="flex flex-col gap-4 py-1 pb-4 w-full min-w-0 overflow-hidden"
      aria-label="Navigasi Staf Lapangan"
    >
      {visibleGroups.map((group) => (
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
