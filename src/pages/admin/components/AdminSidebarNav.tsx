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
  Scale,
  Ship,
  Users,
} from "lucide-react";
import { authService } from "../../../services/auth";

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
  superAdminOnly?: boolean;
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
    title: "Pelayanan Armada",
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
    title: "Operasional & Penimbangan",
    items: [
      {
        label: "Timbangan IoT",
        to: "/admin/scales",
        Icon: Scale,
        prefetch: () => import("../../regulator/IotScalesPage"),
      },
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
    title: "Tata Kelola Sistem",
    superAdminOnly: true,
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
        label: "Manajemen Pengguna",
        to: "/admin/users",
        Icon: Users,
        prefetch: () => import("../UsersPage"),
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
  const isSuperAdmin = authService.isSuperAdmin();
  const visibleGroups = navGroups
    .filter((group) => !group.superAdminOnly || isSuperAdmin)
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
      aria-label="Navigasi Admin"
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

export const SidebarBody = AdminSidebarNav;
