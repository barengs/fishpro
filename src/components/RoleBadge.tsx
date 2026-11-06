import type { LucideIcon } from "lucide-react";
import { Anchor, Building2, Eye, Scale, ShieldCheck } from "lucide-react";

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
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  variant?: "solid" | "subtle";
}

interface RoleConfig {
  defaultLabel: string;
  Icon: LucideIcon;
  solidClass: string;
  subtleClass: string;
  dotClass: string;
}

const roleConfigs: Record<string, RoleConfig> = {
  superadmin: {
    defaultLabel: "Super Admin",
    Icon: ShieldCheck,
    solidClass:
      "bg-purple-600 text-white shadow-2xs",
    subtleClass:
      "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20",
    dotClass: "bg-purple-400 dark:bg-purple-500",
  },
  admin: {
    defaultLabel: "Staf",
    Icon: Scale,
    solidClass:
      "bg-emerald-600 text-white shadow-2xs",
    subtleClass:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20",
    dotClass: "bg-emerald-400 dark:bg-emerald-500",
  },
  regulator: {
    defaultLabel: "Regulator",
    Icon: Eye,
    solidClass:
      "bg-blue-600 text-white shadow-2xs",
    subtleClass:
      "bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20",
    dotClass: "bg-blue-400 dark:bg-blue-500",
  },
  owner: {
    defaultLabel: "Pemilik Kapal",
    Icon: Building2,
    solidClass:
      "bg-teal-600 text-white shadow-2xs",
    subtleClass:
      "bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20",
    dotClass: "bg-teal-400 dark:bg-teal-500",
  },
  captain: {
    defaultLabel: "Nahkoda",
    Icon: Anchor,
    solidClass:
      "bg-amber-500 text-white shadow-2xs",
    subtleClass:
      "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20",
    dotClass: "bg-amber-400 dark:bg-amber-500",
  },
};

export function RoleBadge({
  role = "admin",
  label,
  className = "",
  size = "md",
  showDot = false,
  variant = "solid",
}: RoleBadgeProps) {
  const normRole = (role || "").toLowerCase().replace(/[\s_-]+/g, "");
  const config =
    roleConfigs[normRole] ||
    (normRole.includes("super") ? roleConfigs.superadmin : roleConfigs.admin);

  const displayLabel = label || config.defaultLabel;
  const badgeStyle =
    variant === "solid" ? config.solidClass : config.subtleClass;

  const sizeClasses: Record<"sm" | "md" | "lg", string> = {
    sm: "min-w-[70px] h-6 px-2.5 text-[11px] font-bold rounded-md gap-1.5 justify-center text-center shadow-2xs",
    md: "min-w-[84px] h-7 px-3.5 text-xs font-bold rounded-md gap-1.5 justify-center text-center shadow-2xs",
    lg: "min-w-[100px] h-8 px-4 text-sm font-bold rounded-lg gap-2 justify-center text-center shadow-xs",
  };

  const iconSizes: Record<"sm" | "md" | "lg", number> = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const currentSize = size || "md";

  return (
    <span
      className={`inline-flex items-center font-bold tracking-tight select-none whitespace-nowrap transition-all ${sizeClasses[currentSize]} ${badgeStyle} ${className}`}
    >
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotClass}`}
          aria-hidden="true"
        />
      )}
      <config.Icon
        size={iconSizes[currentSize]}
        className="shrink-0 opacity-95"
        strokeWidth={2.4}
        aria-hidden="true"
      />
      <span>{displayLabel}</span>
    </span>
  );
}


