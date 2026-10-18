import { NavLink } from "react-router-dom";
import {
  Anchor,
  BarChart3,
  Building2,
  ClipboardList,
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

const navItems = [
  { label: "Dashboard", to: "/admin", end: true, Icon: LayoutDashboard },
  { label: "Kapal", to: "/admin/ships", Icon: Ship },
  { label: "Pemilik Kapal", to: "/admin/owners", Icon: Building2 },
  { label: "Nahkoda", to: "/admin/captains", Icon: Anchor },
  { label: "Laporan Tangkapan", to: "/admin/catches", Icon: ClipboardList },
  { label: "Spesies Ikan", to: "/admin/species", Icon: Fish },
  { label: "Wilayah (WPP)", to: "/admin/areas", Icon: MapPin },
  { label: "Kuota & PNBP", to: "/admin/quota", Icon: BarChart3 },
  { label: "Blockchain", to: "/admin/blockchain", Icon: Link2 },
  { label: "Peran & Hak Akses", to: "/admin/roles", Icon: KeyRound },
];

export function AdminSidebarNav({ onNavigate }: AdminSidebarNavProps) {
  return (
    <nav
      className="flex flex-col gap-1 py-1 pb-4 w-full min-w-0 overflow-hidden"
      aria-label="Navigasi Admin"
    >
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `w-full min-w-0 max-w-full box-border flex items-center gap-3.5 h-10 px-3.5 rounded-lg text-sm transition-colors duration-150 no-underline cursor-pointer ${
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

export const SidebarBody = AdminSidebarNav;
