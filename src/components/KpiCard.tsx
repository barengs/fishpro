import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
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
  showSparkline?: boolean;
  sparklineData?: number[];
  color?: KpiColor;
  Icon?: LucideIcon;
  loading?: boolean;
  href?: string;
  linkText?: string;
}

function renderSparklineSvg(data?: number[], trendUp = true) {
  const width = 72;
  const height = 28;
  const padY = 4;
  const padX = 2;

  const strokeColor = trendUp ? "#10B981" : "#F43F5E";

  if (!data || data.length < 2) {
    return trendUp ? (
      <>
        <path
          d="M 2 22 C 18 24, 32 11, 48 15 C 58 18, 62 7, 70 6"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle
          cx="70"
          cy="6"
          r="2.5"
          fill={strokeColor}
        />
      </>
    ) : (
      <>
        <path
          d="M 2 6 C 18 7, 32 19, 48 15 C 58 12, 62 23, 70 24"
          stroke={strokeColor}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle
          cx="70"
          cy="24"
          r="2.5"
          fill={strokeColor}
        />
      </>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (width - padX * 2) / (data.length - 1);
  const plotH = height - padY * 2;

  const points = data.map((val, idx) => ({
    x: Number((padX + idx * stepX).toFixed(1)),
    y: Number((height - padY - ((val - min) / range) * plotH).toFixed(1)),
  }));

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cx = ((p0.x + p1.x) / 2).toFixed(1);
    pathD += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const lastPoint = points[points.length - 1];

  return (
    <>
      <path
        d={pathD}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="2.5"
        fill={strokeColor}
      />
    </>
  );
}

export function KpiCard({
  label,
  value = "0",
  delta,
  note,
  trendUp = true,
  showSparkline = false,
  sparklineData,
  color: _color = "blue",
  Icon,
  loading = false,
  href,
  linkText = "Lihat Detail",
}: KpiCardProps) {
  // Format delta display with direction arrow if not present
  const formattedDelta = delta
    ? delta.startsWith("↗") || delta.startsWith("↘") || delta.startsWith("+") || delta.startsWith("-")
      ? delta
      : `${trendUp ? "↗ " : "↘ "}${delta}`
    : null;

  const cardContent = (
    <>
      <div>
        {/* Header: Icon badge + Delta pill */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {Icon ? (
            <div className="w-7 h-7 rounded-lg bg-[#F9FAFB] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 flex items-center justify-center text-charcoal dark:text-slate-300 shrink-0">
              <Icon size={14} strokeWidth={1.8} aria-hidden="true" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-[#F9FAFB] dark:bg-slate-800 border border-[#E5E7EB] dark:border-slate-700 shrink-0" />
          )}

          {formattedDelta && !loading && (
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[11.5px] font-semibold tabular-nums ${
                trendUp
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
              }`}
            >
              {formattedDelta}
            </span>
          )}
        </div>

        {/* Label */}
        <p className="text-[13px] font-medium text-subtext dark:text-slate-400 leading-snug line-clamp-1 mb-1">
          {label}
        </p>

        {/* Main Value */}
        {loading ? (
          <div className="py-1 animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-28" />
          </div>
        ) : (
          <div className="text-[26px] font-bold tracking-tight text-ink dark:text-white tabular-nums truncate">
            {value}
          </div>
        )}
      </div>

      {/* Bottom Area: Note & Sparkline */}
      <div className="mt-2.5">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1">
            {note && !loading && (
              <p className="text-[11.5px] text-subtext dark:text-slate-400 truncate">
                {note}
              </p>
            )}
          </div>
          {!loading && showSparkline && (
            <div className="shrink-0 pl-1">
              <svg
                className="w-16 h-7 shrink-0 overflow-visible"
                viewBox="0 0 76 30"
                fill="none"
                aria-hidden="true"
              >
                {renderSparklineSvg(sparklineData, trendUp)}
              </svg>
            </div>
          )}
        </div>

        {/* Footer Link if href is passed */}
        {href && linkText && (
          <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between text-[12px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors">
            <span>{linkText}</span>
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </>
  );

  const containerClasses =
    "bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 p-4 sm:p-5 shadow-subtle hover:border-brand-600/40 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group min-h-[140px]";

  if (href) {
    return (
      <Link to={href} className={`${containerClasses} no-underline`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={containerClasses}>{cardContent}</div>;
}
