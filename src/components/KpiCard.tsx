import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

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
}

const colorMap: Record<
  KpiColor,
  {
    card: string;
    iconBg: string;
  }
> = {
  blue: {
    card: "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20",
    iconBg: "bg-white/20 text-white",
  },
  emerald: {
    card: "bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/20",
    iconBg: "bg-white/20 text-white",
  },
  amber: {
    card: "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20",
    iconBg: "bg-white/20 text-white",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-600/20",
    iconBg: "bg-white/20 text-white",
  },
  cyan: {
    card: "bg-gradient-to-br from-cyan-600 to-cyan-700 text-white shadow-lg shadow-cyan-600/20",
    iconBg: "bg-white/20 text-white",
  },
  rose: {
    card: "bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/20",
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
}: KpiCardProps) {
  const styles = colorMap[color];

  return (
    <div
      className={`rounded-2xl p-5 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl relative overflow-hidden group border-none min-h-[140px] ${styles.card}`}
    >
      {/* Decorative background glow circles */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10 pointer-events-none transition-transform group-hover:scale-125 duration-300" />
      <div className="absolute -right-2 -top-2 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-2 relative z-10">
        <div className="text-sm font-semibold text-white/85">{label}</div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-200 ${styles.iconBg}`}
          >
            <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 py-1 animate-pulse relative z-10">
          <div className="h-8 bg-white/25 rounded-lg w-28" />
          <div className="h-3.5 bg-white/20 rounded w-40" />
        </div>
      ) : (
        <>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight my-1 tabular-nums text-white relative z-10">
            {value}
          </div>

          {delta && (
            <div className="flex items-center gap-1.5 text-xs text-white/90 mt-1 relative z-10 font-medium">
              {trendUp ? (
                <TrendingUp
                  size={14}
                  className="text-white shrink-0"
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
              ) : (
                <TrendingDown
                  size={14}
                  className="text-white shrink-0"
                  strokeWidth={2.6}
                  aria-hidden="true"
                />
              )}
              <span>{delta}</span>
            </div>
          )}

          {note && (
            <div className="text-xs text-white/80 mt-1 relative z-10">
              {note}
            </div>
          )}
        </>
      )}
    </div>
  );
}
