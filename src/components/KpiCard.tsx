import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export type KpiColor =
  | "blue"
  | "teal"
  | "navy"
  | "purple"
  | "emerald"
  | "amber"
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

// Background colors matching sample CSS:
// 1. #2563eb (Royal Blue)
// 2. #0f766e (Deep Teal)
// 3. #0e1f4d (Deep Navy)
// 4. #6d28d9 (Vibrant Purple)
const colorMap: Record<KpiColor, { bg: string; shadow: string; spark: string }> = {
  blue: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #2563eb",
    shadow: "0 14px 28px -18px #2563eb",
    spark: "#ffffff",
  },
  teal: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #0f766e",
    shadow: "0 14px 28px -18px #0f766e",
    spark: "#ffffff",
  },
  navy: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #0e1f4d",
    shadow: "0 14px 28px -18px #0e1f4d",
    spark: "#ffffff",
  },
  purple: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #6d28d9",
    shadow: "0 14px 28px -18px #6d28d9",
    spark: "#ffffff",
  },
  emerald: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #0f766e",
    shadow: "0 14px 28px -18px #0f766e",
    spark: "#ffffff",
  },
  rose: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #0f766e",
    shadow: "0 14px 28px -18px #0f766e",
    spark: "#ffffff",
  },
  amber: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #b45309",
    shadow: "0 14px 28px -18px #b45309",
    spark: "#ffffff",
  },
  cyan: {
    bg: "radial-gradient(160px 110px at 100% 0, rgba(255,255,255,0.22), transparent), #0e7490",
    shadow: "0 14px 28px -18px #0e7490",
    spark: "#ffffff",
  },
};

const DEFAULT_SPARKLINE_PATH =
  "M2 24 C20 22 28 8 46 12 S76 26 96 15 S140 3 178 6";

function buildSparklinePath(data?: number[]): string {
  if (!data || data.length < 2) return DEFAULT_SPARKLINE_PATH;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const pts = data.map((v, idx) => {
    const x = 2 + (idx / (data.length - 1)) * 176;
    const y = range === 0 ? 15 : 25 - ((v - min) / range) * 20;
    return { x, y };
  });

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function KpiCard({
  label,
  value = "0",
  delta,
  showSparkline = false,
  sparklineData,
  color = "blue",
  Icon,
  loading = false,
  href,
  linkText = "Buka detail",
}: KpiCardProps) {
  const theme = colorMap[color] || colorMap.blue;
  const sparklinePath = showSparkline ? buildSparklinePath(sparklineData) : "";

  const cardContent = (
    <>
      {/* Icon Badge Top-Right */}
      {Icon && (
        <span
          className="absolute right-[18px] top-[18px] w-[42px] h-[42px] rounded-full bg-white/18 flex items-center justify-center text-white shrink-0 pointer-events-none"
          aria-hidden="true"
        >
          <Icon size={20} strokeWidth={1.9} />
        </span>
      )}

      {/* Label */}
      <span className="text-[14px] font-medium text-white/85 pr-14 leading-tight">
        {label}
      </span>

      {/* Main Value */}
      {loading ? (
        <div className="py-2 animate-pulse">
          <div className="h-9 bg-white/20 rounded-lg w-28" />
        </div>
      ) : (
        <strong className="text-[34px] font-bold tracking-tight text-white my-2.5 leading-tight tabular-nums block">
          {value}
        </strong>
      )}

      {/* Subtitle / Delta Description */}
      {delta && (
        <em className="not-italic text-[13px] text-white/75 font-normal block mb-4">
          {delta}
        </em>
      )}

      {/* Sparkline curve matching sample HTML */}
      {showSparkline && (
        <div className="w-full aspect-[6/1] mb-4 overflow-visible">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 180 30" aria-hidden="true">
            <path
              pathLength="1"
              d={sparklinePath}
              fill="none"
              stroke={theme.spark}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Footer Link matching sample HTML: .lk */}
      {href && (
        <span className="mt-auto inline-flex items-center gap-1.5 text-white font-semibold text-[13px] transition-all">
          <span>{linkText}</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      )}
    </>
  );

  const containerStyle = {
    background: theme.bg,
    boxShadow: theme.shadow,
    border: "1px solid rgba(255, 255, 255, 0.14)",
  };

  const containerClasses =
    "relative rounded-[20px] p-[22px_24px] text-white flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group min-h-[160px]";

  if (href) {
    return (
      <Link
        to={href}
        style={containerStyle}
        className={`${containerClasses} no-underline`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div style={containerStyle} className={containerClasses}>
      {cardContent}
    </div>
  );
}
