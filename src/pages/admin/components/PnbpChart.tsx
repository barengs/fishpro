import { useEffect, useState } from "react";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { AdminDashboardData } from "../../../services/dashboard/types";
import { pnbpService, type PnbpHistoryRecord } from "../../../services/pnbp";
import { formatRupiah } from "../../../utils";

interface MonthlyPoint {
  label: string;
  fullLabel: string;
  value: number; // in Rupiah
  isPrediction?: boolean;
}

interface PnbpChartProps {
  monthlySeries?: AdminDashboardData["monthly_pnbp_chart"];
  totalPnbpOverride?: number;
  loading?: boolean;
}

const MONTH_ID: Record<number, string> = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "Mei",
  6: "Jun",
  7: "Jul",
  8: "Agu",
  9: "Sep",
  10: "Okt",
  11: "Nov",
  12: "Des",
};

function formatMonthParts(
  monthStr?: string,
  fallbackLabel?: string,
): { shortLabel: string; fullLabel: string; year?: string } {
  if (monthStr && /^\d{4}-\d{2}/.test(monthStr)) {
    const [yr, mo] = monthStr.split("-");
    const mNum = parseInt(mo, 10);
    const shortM = MONTH_ID[mNum] || fallbackLabel || monthStr;
    return {
      shortLabel: shortM,
      fullLabel: `${shortM} ${yr}`,
      year: yr,
    };
  }
  const clean = fallbackLabel || monthStr || "—";
  return { shortLabel: clean, fullLabel: clean };
}

export function PnbpChart({
  monthlySeries,
  totalPnbpOverride,
  loading = false,
}: PnbpChartProps) {
  const [fetchedPoints, setFetchedPoints] = useState<MonthlyPoint[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const hasExternalSeries = monthlySeries !== undefined;

  useEffect(() => {
    if (hasExternalSeries) return;

    let ignore = false;
    pnbpService
      .getUnifiedChartData()
      .then((res) => {
        if (ignore) return;
        const chartsData = res.charts_data;
        const historyList: PnbpHistoryRecord[] =
          chartsData?.historical_pnbp?.data || [];
        const predData = chartsData?.pnbp_predictions?.data;

        const dynamicPoints: MonthlyPoint[] = [];

        if (historyList.length > 0) {
          const monthlyMap: Record<
            string,
            { shortLabel: string; fullLabel: string; value: number }
          > = {};
          for (const item of historyList) {
            if (item.date) {
              const d = new Date(item.date);
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
              const parts = formatMonthParts(key);
              if (!monthlyMap[key]) {
                monthlyMap[key] = {
                  shortLabel: parts.shortLabel,
                  fullLabel: parts.fullLabel,
                  value: 0,
                };
              }
              monthlyMap[key].value += item.total_pnbp
                ? Number(item.total_pnbp)
                : 0;
            }
          }
          for (const key of Object.keys(monthlyMap).sort()) {
            dynamicPoints.push({
              label: monthlyMap[key].shortLabel,
              fullLabel: monthlyMap[key].fullLabel,
              value: monthlyMap[key].value,
              isPrediction: false,
            });
          }
        }

        const forecasts = predData?.monthly_forecasts || [];
        if (forecasts.length > 0) {
          for (const f of forecasts.slice(0, 4)) {
            const parts = formatMonthParts(f.month, f.month_name);
            dynamicPoints.push({
              label: parts.shortLabel,
              fullLabel: parts.fullLabel,
              value: f.predicted_pnbp || 0,
              isPrediction: true,
            });
          }
        }

        setFetchedPoints(dynamicPoints);
      })
      .catch(() => {
        if (!ignore) setFetchedPoints([]);
      });

    return () => {
      ignore = true;
    };
  }, [hasExternalSeries]);

  const externalPoints: MonthlyPoint[] = hasExternalSeries
    ? monthlySeries.map((item) => {
        const parts = formatMonthParts(item.month, item.label);
        return {
          label: parts.shortLabel,
          fullLabel: parts.fullLabel,
          value: Number(item.total_pnbp) || 0,
          isPrediction: Boolean(item.is_prediction),
        };
      })
    : [];

  const displayPoints = hasExternalSeries ? externalPoints : fetchedPoints;

  const yearFromData =
    hasExternalSeries && monthlySeries.length > 0
      ? monthlySeries.find((m) => /^\d{4}/.test(m.month))?.month.slice(0, 4)
      : undefined;
  const chartYear = yearFromData || String(new Date().getFullYear());

  // SVG plot geometry
  const svgWidth = 640;
  const svgHeight = 280;
  const padLeft = 64;
  const padRight = 20;
  const padTop = 16;
  const padBottom = 32;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const rawMax = Math.max(...displayPoints.map((p) => p.value), 0);
  const maxVal = rawMax > 0 ? rawMax * 1.18 : 1_000_000;

  const coords = displayPoints.map((p, idx) => {
    const x =
      displayPoints.length > 1
        ? padLeft + (idx / (displayPoints.length - 1)) * plotWidth
        : padLeft + plotWidth / 2;
    const y = padTop + (1 - p.value / maxVal) * plotHeight;
    return { ...p, x, y };
  });

  const lastActualIndex = displayPoints.findLastIndex((p) => !p.isPrediction);
  const actualIndex =
    lastActualIndex >= 0 ? lastActualIndex : Math.max(0, displayPoints.length - 1);

  const activeHoverIndex =
    coords.length === 0
      ? -1
      : hoverIndex !== null && hoverIndex >= 0 && hoverIndex < coords.length
        ? hoverIndex
        : actualIndex;

  const buildSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return "";
    let s = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      s += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return s;
  };

  const actualCoords = coords.slice(0, actualIndex + 1);
  const predCoords = coords.slice(actualIndex);

  const actualPath = buildSmoothPath(actualCoords);
  const predPath = buildSmoothPath(predCoords);

  const basePath =
    actualCoords.length > 1
      ? `${actualPath} L ${actualCoords[actualCoords.length - 1].x} ${padTop + plotHeight} L ${actualCoords[0].x} ${padTop + plotHeight} Z`
      : "";

  const summedActual = displayPoints
    .filter((p) => !p.isPrediction)
    .reduce((acc, curr) => acc + curr.value, 0);
  const totalAccumulated =
    totalPnbpOverride !== undefined ? totalPnbpOverride : summedActual;

  const currentHover = activeHoverIndex >= 0 ? coords[activeHoverIndex] : undefined;
  const prevVal =
    activeHoverIndex > 0
      ? displayPoints[activeHoverIndex - 1].value
      : displayPoints[activeHoverIndex]?.value || 0;
  const currentVal = displayPoints[activeHoverIndex]?.value || 0;
  const deltaPct = prevVal > 0 ? ((currentVal - prevVal) / prevVal) * 100 : 0;

  const yTicks = [0, maxVal * 0.45, maxVal * 0.9];

  return (
    <section className="bg-white dark:bg-[#0f1729] border border-[#E5E7EB] dark:border-[#1f2a42] rounded-2xl shadow-subtle overflow-hidden h-full flex flex-col justify-between">
      {/* Card Header */}
      <div className="p-5 sm:p-6 pb-0 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-bold text-ink dark:text-[#e8edf7] m-0 tracking-tight">
            PNBP bulanan
          </h2>
          <p className="text-[13px] text-subtext dark:text-[#98a6c0] m-0 mt-0.5">
            Aktual dan proyeksi AI sepanjang {chartYear}
          </p>
        </div>

        <div className="flex items-center gap-4 text-[13px] text-subtext dark:text-[#98a6c0]">
          <span className="flex items-center gap-1.5">
            <i className="inline-block w-[18px] h-0 border-t-[2.5px] border-[#2563eb] rounded-xs" />
            Aktual
          </span>
          <span className="flex items-center gap-1.5">
            <i className="inline-block w-[18px] h-0 border-t-[2.5px] border-dashed border-[#94a0b8] rounded-xs" />
            Proyeksi
          </span>
        </div>
      </div>

      {/* Big accumulated summary */}
      <div className="px-5 sm:px-6 pt-3.5 pb-1 flex items-baseline gap-2.5 flex-wrap">
        <strong className="text-[28px] font-bold text-ink dark:text-white tracking-tight tabular-nums">
          {formatRupiah(totalAccumulated, false)}
        </strong>
        <span className="text-[13px] text-subtext dark:text-[#98a6c0]">
          akumulasi tercatat
        </span>
        {activeHoverIndex > 0 && deltaPct !== 0 && (
          <span
            className={`text-[13px] font-semibold ${
              deltaPct >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {deltaPct < 0 ? "↓ " : "↑ "}
            {Math.abs(deltaPct).toFixed(1).replace(".", ",")}% dibanding{" "}
            {displayPoints[activeHoverIndex - 1]?.label}
          </span>
        )}
      </div>

      {loading && displayPoints.length === 0 ? (
        <div className="p-5 sm:p-6">
          <Skeleton className="h-[220px] w-full rounded-xl" />
        </div>
      ) : displayPoints.length === 0 ? (
        <div className="px-6 py-16 text-center text-[13px] text-[#94a0b8]">
          Belum ada data histori PNBP bulanan untuk ditampilkan.
        </div>
      ) : (
        /* SVG Interactive Plot */
        <div className="p-3 sm:p-5 pt-2 relative">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto block overflow-visible select-none"
            onPointerMove={(e) => {
              if (displayPoints.length <= 1) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const clientX = ((e.clientX - rect.left) / rect.width) * svgWidth;
              const ratio = (clientX - padLeft) / plotWidth;
              const index = Math.max(
                0,
                Math.min(
                  displayPoints.length - 1,
                  Math.round(ratio * (displayPoints.length - 1)),
                ),
              );
              setHoverIndex(index);
            }}
            onPointerLeave={() => setHoverIndex(null)}
          >
            <defs>
              <linearGradient
                id="pnbpAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid lines and dynamic Y labels */}
            {yTicks.map((t, idx) => {
              const y = padTop + (1 - t / maxVal) * plotHeight;
              return (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    x2={svgWidth - padRight}
                    y1={y}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray={t ? "3 5" : undefined}
                    className="text-[#e6e9ef] dark:text-[#1f2a42]"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-[#94a0b8] text-[11px] font-sans"
                  >
                    {t === 0 ? "Rp 0" : formatRupiah(t, true)}
                  </text>
                </g>
              );
            })}

            {/* Area under curve */}
            {basePath && <path d={basePath} fill="url(#pnbpAreaGradient)" />}

            {/* Prediction curve (dashed) */}
            {predPath && (
              <path
                d={predPath}
                fill="none"
                stroke="#94a0b8"
                strokeWidth="2.5"
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
            )}

            {/* Actual curve (solid blue) */}
            {actualPath && (
              <path
                d={actualPath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.75"
                strokeLinecap="round"
              />
            )}

            {/* Active pulse dot at last actual point */}
            {actualCoords.length > 0 && (
              <g>
                <circle
                  cx={actualCoords[actualCoords.length - 1].x}
                  cy={actualCoords[actualCoords.length - 1].y}
                  r="5"
                  fill="#2563eb"
                  className="animate-ping opacity-50"
                />
                <circle
                  cx={actualCoords[actualCoords.length - 1].x}
                  cy={actualCoords[actualCoords.length - 1].y}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  className="dark:fill-[#0f1729]"
                />
              </g>
            )}

            {/* Interactive Vertical Guide Line */}
            {currentHover && (
              <g>
                <line
                  x1={currentHover.x}
                  x2={currentHover.x}
                  y1={padTop}
                  y2={padTop + plotHeight}
                  stroke="#94a0b8"
                  strokeDasharray="3 3"
                />
                <circle
                  cx={currentHover.x}
                  cy={currentHover.y}
                  r="5"
                  fill="#ffffff"
                  stroke={currentHover.isPrediction ? "#94a0b8" : "#2563eb"}
                  strokeWidth="2.5"
                  className="dark:fill-[#0f1729]"
                />
              </g>
            )}

            {/* Month labels and pill background for active month */}
            {currentHover && (
              <rect
                x={currentHover.x - 22}
                y={svgHeight - padBottom + 6}
                width={44}
                height={22}
                rx={11}
                className="fill-[#0f172a] dark:fill-[#e8edf7]"
              />
            )}

            {coords.map((p, idx) => (
              <text
                key={p.fullLabel + idx}
                x={p.x}
                y={svgHeight - padBottom + 21}
                textAnchor="middle"
                className={`text-[11px] font-sans transition-all ${
                  idx === activeHoverIndex
                    ? "fill-[#ffffff] dark:fill-[#0a101d] font-bold"
                    : "fill-[#94a0b8]"
                }`}
              >
                {p.label}
              </text>
            ))}
          </svg>

          {/* Floating Tooltip */}
          {currentHover && (
            <div
              style={{
                left: `${Math.min(86, Math.max(14, (currentHover.x / svgWidth) * 100))}%`,
                top: `${Math.max(18, (currentHover.y / svgHeight) * 100)}%`,
                transform: "translate(-50%, -125%)",
              }}
              className="absolute pointer-events-none bg-[#0f172a] dark:bg-[#e8edf7] text-white dark:text-[#0f172a] px-3 py-1.5 rounded-xl text-center shadow-lg whitespace-nowrap z-20 transition-all duration-100"
            >
              <small className="block opacity-75 text-[11px] leading-tight">
                {currentHover.fullLabel} ·{" "}
                {currentHover.isPrediction ? "Proyeksi AI" : "Aktual"}
              </small>
              <b className="text-[14px] font-bold leading-tight tabular-nums">
                {formatRupiah(currentHover.value, false)}
              </b>
              <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-[#0f172a] dark:bg-[#e8edf7] rotate-45" />
            </div>
          )}
        </div>
      )}
    </section>
  );
}
