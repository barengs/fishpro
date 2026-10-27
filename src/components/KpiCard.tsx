import type { LucideIcon } from "lucide-react";
import { ArrowRight, MoreHorizontal, TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export type KpiColor =
  | "blue"
  | "emerald"
  | "amber"
  | "purple"
  | "cyan"
  | "rose";

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
    iconBg: string;
    iconColor: string;
    sparklineColor: string;
  }
> = {
  blue: {
    iconBg: "bg-blue-50 dark:bg-blue-950/40",
    iconColor: "text-fco-blue dark:text-blue-400",
    sparklineColor: "#1a56db",
  },
  emerald: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    sparklineColor: "#059669",
  },
  amber: {
    iconBg: "bg-amber-50 dark:bg-amber-950/40",
    iconColor: "text-amber-600 dark:text-amber-400",
    sparklineColor: "#d97706",
  },
  purple: {
    iconBg: "bg-purple-50 dark:bg-purple-950/40",
    iconColor: "text-purple-600 dark:text-purple-400",
    sparklineColor: "#7c3aed",
  },
  cyan: {
    iconBg: "bg-cyan-50 dark:bg-cyan-950/40",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    sparklineColor: "#0891b2",
  },
  rose: {
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    sparklineColor: "#e11d48",
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

  // ponytail: SVG cubic sparkline hardcoded curve; upgrade to dynamic time-series path when endpoint provides historical array
  const sparkline = (
    <svg
      className="w-16 sm:w-18 h-8 shrink-0 overflow-visible"
      viewBox="0 0 76 32"
      fill="none"
      aria-hidden="true"
    >
      {trendUp ? (
        <>
          <path
            d="M 2 24 C 18 26, 32 10, 48 16 C 58 20, 62 8, 72 6"
            stroke={styles.sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="72"
            cy="6"
            r="3"
            fill={styles.sparklineColor}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </>
      ) : (
        <>
          <path
            d="M 2 8 C 18 6, 32 22, 48 16 C 58 12, 62 24, 72 26"
            stroke={styles.sparklineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle
            cx="72"
            cy="26"
            r="3"
            fill={styles.sparklineColor}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </>
      )}
    </svg>
  );

  const cardContent = (
    <>
      <div>
        {/* Header: Icon + Title + More Action */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${styles.iconBg} ${styles.iconColor}`}
              >
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            )}
            <span className="text-xs sm:text-sm font-semibold text-strong truncate">
              {label}
            </span>
          </div>
          <div className="text-soft/60 group-hover:text-soft transition-colors shrink-0">
            <MoreHorizontal size={16} aria-hidden="true" />
          </div>
        </div>

        {/* Main Value */}
        {loading ? (
          <div className="py-2 animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700/60 rounded-md w-28" />
          </div>
        ) : (
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-strong truncate my-1">
            {value}
          </div>
        )}
      </div>

      {/* Bottom Area: Trend/Delta & Sparkline */}
      <div className="mt-3">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            {delta && !loading && (
              <div className="flex items-center gap-1.5 text-xs">
                <span
                  className={`inline-flex items-center shrink-0 ${
                    trendUp
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {trendUp ? (
                    <TrendingUp size={13} strokeWidth={2.6} aria-hidden="true" />
                  ) : (
                    <TrendingDown size={13} strokeWidth={2.6} aria-hidden="true" />
                  )}
                </span>
                <span className="text-soft font-medium truncate">{delta}</span>
              </div>
            )}
            {note && !loading && (
              <div className="text-2xs text-soft truncate mt-0.5">{note}</div>
            )}
          </div>
          {!loading && sparkline}
        </div>

        {/* Footer Link if href is passed */}
        {href && linkText && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-fco-border-dark/60 flex items-center justify-between text-xs font-semibold text-fco-blue group-hover:text-fco-blue-hover transition-colors">
            <span>{linkText}</span>
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </>
  );

  const containerClasses =
    "surface-card border border-slate-200/80 dark:border-fco-border-dark rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group min-h-38";

  if (href) {
    return (
      <Link to={href} className={`${containerClasses} no-underline`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={containerClasses}>{cardContent}</div>;
}
