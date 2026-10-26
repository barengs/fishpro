import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export type KpiColor =
  "blue" | "emerald" | "amber" | "purple" | "cyan" | "rose";

interface KpiCardProps {
  label: string;
  value?: string;
  delta?: string;
  note?: string;
  trendUp?: boolean;
  color?: KpiColor;
  Icon?: LucideIcon;
  loading?: boolean;
  href?: string;
  linkText?: string;
}

const colorMap: Record<
  KpiColor,
  {
    card: string;
    footer: string;
    iconBg: string;
  }
> = {
  blue: {
    card: "bg-fco-blue text-white",
    footer: "bg-black/20 hover:bg-black/30 text-white",
    iconBg: "bg-white/20 text-white",
  },
  emerald: {
    card: "bg-emerald-700 text-white",
    footer: "bg-black/20 hover:bg-black/30 text-white",
    iconBg: "bg-white/20 text-white",
  },
  amber: {
    card: "bg-amber-700 text-white",
    footer: "bg-black/20 hover:bg-black/30 text-white",
    iconBg: "bg-white/20 text-white",
  },
  purple: {
    card: "bg-purple-700 text-white",
    footer: "bg-black/20 hover:bg-black/30 text-white",
    iconBg: "bg-white/20 text-white",
  },
  cyan: {
    card: "bg-cyan-700 text-white",
    footer: "bg-black/20 hover:bg-black/30 text-white",
    iconBg: "bg-white/20 text-white",
  },
  rose: {
    card: "bg-rose-700 text-white",
    footer: "bg-black/20 hover:bg-black/30 text-white",
    iconBg: "bg-white/20 text-white",
  },
};

export function KpiCard({
  label,
  value = "0",
  delta,
  note,
  trendUp = true,
  color = "blue",
  Icon,
  loading = false,
  href,
  linkText = "Lihat Detail",
}: KpiCardProps) {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`rounded-lg flex flex-col justify-between overflow-hidden shadow-xs border-0 min-h-37 transition-transform duration-150 hover:-translate-y-0.5 ${styles.card}`}
    >
      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-1 truncate">
              {label}
            </div>
            {loading ? (
              <div className="space-y-1.5 py-1 animate-pulse">
                <div className="h-7 bg-white/25 rounded w-24" />
              </div>
            ) : (
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white truncate">
                {value}
              </div>
            )}
          </div>
          {Icon && (
            <div
              className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${styles.iconBg}`}
            >
              <Icon size={20} strokeWidth={2.2} aria-hidden="true" />
            </div>
          )}
        </div>

        {delta && !loading && (
          <div className="flex items-center gap-1.5 text-xs text-white mt-2 font-medium">
            {trendUp ? (
              <TrendingUp
                size={14}
                className="text-white shrink-0"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            ) : (
              <TrendingDown
                size={14}
                className="text-white shrink-0"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            )}
            <span className="truncate">{delta}</span>
          </div>
        )}

        {note && !loading && (
          <div className="text-2xs text-white/85 mt-1 truncate">{note}</div>
        )}
      </div>

      {/* SB Admin Style Footer Bar */}
      {href ? (
        <Link
          to={href}
          className={`px-4 sm:px-5 py-2.5 flex items-center text-xs font-semibold no-underline transition-colors ${styles.footer}`}
        >
          <span>{linkText}</span>
        </Link>
      ) : delta ? (
        <div
          className={`px-4 sm:px-5 py-2 flex items-center text-xs font-medium ${styles.footer}`}
        >
          <span className="truncate">{delta}</span>
        </div>
      ) : null}
    </div>
  );
}
