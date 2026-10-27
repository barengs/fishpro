import type { LucideIcon } from "lucide-react";
import { ArrowRight, MoreHorizontal } from "lucide-react";
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

const colorMap: Record<
  KpiColor,
  {
    cardBg: string;
    footerBorder: string;
  }
> = {
  blue: {
    cardBg:
      "bg-gradient-to-br from-[#1a56db] via-[#1d4ed8] to-[#1e3a8a] text-white shadow-md shadow-blue-900/15",
    footerBorder: "border-white/20 text-white/90 hover:text-white",
  },
  amber: {
    cardBg:
      "bg-gradient-to-br from-[#d97706] via-[#b45309] to-[#78350f] text-white shadow-md shadow-amber-900/15",
    footerBorder: "border-white/20 text-white/90 hover:text-white",
  },
  emerald: {
    cardBg:
      "bg-gradient-to-br from-[#059669] via-[#047857] to-[#064e3b] text-white shadow-md shadow-emerald-900/15",
    footerBorder: "border-white/20 text-white/90 hover:text-white",
  },
  rose: {
    cardBg:
      "bg-gradient-to-br from-[#e11d48] via-[#be123c] to-[#881337] text-white shadow-md shadow-rose-900/15",
    footerBorder: "border-white/20 text-white/90 hover:text-white",
  },
  purple: {
    cardBg:
      "bg-gradient-to-br from-[#7c3aed] via-[#6d28d9] to-[#4c1d95] text-white shadow-md shadow-purple-900/15",
    footerBorder: "border-white/20 text-white/90 hover:text-white",
  },
  cyan: {
    cardBg:
      "bg-gradient-to-br from-[#0891b2] via-[#0e7490] to-[#164e63] text-white shadow-md shadow-cyan-900/15",
    footerBorder: "border-white/20 text-white/90 hover:text-white",
  },
};

function renderSparklineSvg(data?: number[], trendUp = true) {
  const width = 72;
  const height = 30;
  const padY = 5;
  const padX = 2;

  if (!data || data.length < 2) {
    return trendUp ? (
      <>
        <path
          d="M 2 23 C 18 25, 32 12, 48 16 C 58 19, 62 8, 70 7"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="70"
          cy="7"
          r="3"
          fill="#ffffff"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />
      </>
    ) : (
      <>
        <path
          d="M 2 7 C 18 8, 32 20, 48 16 C 58 13, 62 24, 70 25"
          stroke="rgba(255, 255, 255, 0.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="70"
          cy="25"
          r="3"
          fill="#ffffff"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.5"
        />
      </>
    );
  }

  // ponytail: smooth cubic bezier interpolation from raw numbers; upgrade to chart.js micro-canvas when multi-metric overlay requested
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
        stroke="rgba(255, 255, 255, 0.9)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="3"
        fill="#ffffff"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.5"
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
  color = "blue",
  Icon,
  loading = false,
  href,
  linkText = "Lihat Detail",
}: KpiCardProps) {
  const styles = colorMap[color] || colorMap.blue;

  const cardContent = (
    <>
      <div>
        {/* Header: Icon + Title + More Action */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/20 backdrop-blur-xs text-white shadow-2xs">
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            )}
            <span className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2">
              {label}
            </span>
          </div>
          <div className="text-white/60 group-hover:text-white transition-colors shrink-0">
            <MoreHorizontal size={16} aria-hidden="true" />
          </div>
        </div>

        {/* Main Value */}
        {loading ? (
          <div className="py-2 animate-pulse">
            <div className="h-8 bg-white/25 rounded-md w-28" />
          </div>
        ) : (
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white truncate my-1">
            {value}
          </div>
        )}
      </div>

      {/* Bottom Area: Trend/Delta & Sparkline */}
      <div className="mt-3">
        <div className="flex items-end justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            {delta && !loading && (
              <div className="flex items-center gap-1.5 text-xs text-white/90 font-medium">
                <span className="truncate">{delta}</span>
              </div>
            )}
            {note && !loading && (
              <div className="text-2xs text-white/75 truncate mt-0.5">{note}</div>
            )}
          </div>
          {!loading && showSparkline && (
            <div className="shrink-0 pl-1">
              <svg
                className="w-16 h-8 shrink-0 overflow-visible"
                viewBox="0 0 76 32"
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
          <div className={`mt-3 pt-2.5 border-t ${styles.footerBorder} flex items-center justify-between text-xs font-semibold transition-colors`}>
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

  const containerClasses = `${styles.cardBg} rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group min-h-38 border-0`;

  if (href) {
    return (
      <Link to={href} className={`${containerClasses} no-underline`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={containerClasses}>{cardContent}</div>;
}
