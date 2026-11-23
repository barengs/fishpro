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
      className="flex flex-col gap-3 py-1 pb-4 w-full min-w-0 overflow-hidden"
      aria-label="Navigasi Staf Lapangan"
    >
      {visibleGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-0.5">
          <p className="px-2.5 mb-1.5 mt-2 text-[10.5px] font-semibold uppercase tracking-[0.07em] text-faint dark:text-slate-400">
            {group.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => (
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
          </div>
        </div>
      ))}
    </nav>
  );
}
