import type { LucideIcon } from "lucide-react";
import { Anchor, Building2, Eye, ShieldCheck, UserCheck } from "lucide-react";

export type RoleType =
  | "superadmin"
  | "admin"
  | "regulator"
  | "owner"
  | "captain"
  | string;

interface RoleBadgeProps {
  role?: RoleType | null;
  label?: string;
  className?: string;
  size?: "sm" | "md";
  showDot?: boolean;
}

interface RoleConfig {
  defaultLabel: string;
  Icon: LucideIcon;
  badgeClass: string;
  dotClass: string;
}

const roleConfigs: Record<string, RoleConfig> = {
  superadmin: {
    defaultLabel: "Super Admin",
    Icon: ShieldCheck,
    badgeClass:
      "bg-slate-900/90 text-slate-100 border-slate-700/80 dark:bg-slate-100 dark:text-slate-900 dark:border-white/90 shadow-2xs",
    dotClass: "bg-indigo-400 dark:bg-indigo-600",
  },
  admin: {
    defaultLabel: "Staf Admin",
    Icon: UserCheck,
    badgeClass:
      "surface-card text-strong border-slate-200/90 dark:border-slate-700/80 shadow-2xs",
    dotClass: "bg-emerald-500 dark:bg-emerald-400",
  },
  regulator: {
    defaultLabel: "Regulator",
    Icon: Eye,
    badgeClass:
      "bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-500/20",
    dotClass: "bg-sky-500 dark:bg-sky-400",
  },
  owner: {
    defaultLabel: "Pemilik Kapal",
    Icon: Building2,
    badgeClass:
      "bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-500/20",
    dotClass: "bg-teal-500 dark:bg-teal-400",
  },
  captain: {
    defaultLabel: "Nahkoda",
    Icon: Anchor,
    badgeClass:
      "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20",
    dotClass: "bg-amber-500 dark:bg-amber-400",
  },
};

export function RoleBadge({
  role = "admin",
  label,
  className = "",
  size = "md",
  showDot = true,
}: RoleBadgeProps) {
  const normRole = (role || "").toLowerCase().replace(/[\s_-]+/g, "");
  const config =
    roleConfigs[normRole] ||
    (normRole.includes("super") ? roleConfigs.superadmin : roleConfigs.admin);

  const displayLabel = label || config.defaultLabel;
  const isSmall = size === "sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md tracking-tight select-none transition-all ${
        isSmall ? "px-2 py-0.5 text-2xs" : "px-2.5 py-1 text-xs"
      } ${config.badgeClass} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`}
          aria-hidden="true"
        />
      )}
      <config.Icon
        size={isSmall ? 11 : 13}
        className="shrink-0 opacity-80"
        strokeWidth={2}
        aria-hidden="true"
      />
      <span className="font-semibold">{displayLabel}</span>
    </span>
  );
}

