import { useEffect, useState } from "react";
import {
  pnbpService,
  type PnbpHistoryRecord,
  type UnifiedChartSummaryStats,
} from "../../../services/pnbp";
import { formatRupiah } from "../../../utils";
import { Skeleton } from "../../../components/ui/Skeleton";
import { LineChart, TrendingUp } from "lucide-react";

interface MonthlyPoint {
  label: string;
  value: number; // in Rupiah
  isPrediction?: boolean;
}

export function PnbpChart() {
  const [stats, setStats] = useState<UnifiedChartSummaryStats | null>(null);
  const [points, setPoints] = useState<MonthlyPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pnbpService
      .getUnifiedChartData()
      .then((res) => {
        const chartsData = res.charts_data;
        if (chartsData?.summary_stats) {
          setStats(chartsData.summary_stats);
        }

        const historyList: PnbpHistoryRecord[] =
          chartsData?.historical_pnbp?.data || [];
        const predData = chartsData?.pnbp_predictions?.data;

        const dynamicPoints: MonthlyPoint[] = [];

        // 1. Group history by month if available
        if (historyList.length > 0) {
          const monthlyMap: Record<string, number> = {};
          for (const item of historyList) {
            if (item.date) {
              const d = new Date(item.date);
              const mName = d.toLocaleDateString("id-ID", { month: "short" });
              monthlyMap[mName] =
                (monthlyMap[mName] || 0) +
                (item.total_pnbp ? Number(item.total_pnbp) : 0);
            }
          }
          for (const [mName, val] of Object.entries(monthlyMap)) {
            dynamicPoints.push({
              label: mName,
              value: val,
              isPrediction: false,
            });
          }
        }

        // 2. Add forecast points if available
        const forecasts = predData?.monthly_forecasts || [];
        if (forecasts.length > 0) {
          for (const f of forecasts.slice(0, 4)) {
            dynamicPoints.push({
              label: f.month || f.month_name || "Forecast",
              value: f.predicted_pnbp || 0,
              isPrediction: true,
            });
          }
        }

        setPoints(dynamicPoints);
      })
      .catch(() => {
        setPoints([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const hasData = points.length > 0 && points.some((p) => p.value > 0);

  // SVG dimensions
  const svgWidth = 640;
  const svgHeight = 240;
  const padLeft = 60;
  const padRight = 30;
  const padTop = 30;
  const padBottom = 40;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const maxValue = hasData ? Math.max(...points.map((p) => p.value), 1) : 1;

  // Calculate SVG coordinates
  const coords = points.map((p, idx) => {
    const x =
      points.length > 1
        ? padLeft + (idx / (points.length - 1)) * plotWidth
        : padLeft + plotWidth / 2;
    const y = padTop + plotHeight - (p.value / maxValue) * plotHeight;
    return { ...p, x, y };
  });

  const actualPoints = coords.filter((p) => !p.isPrediction);
  const predPoints = coords.filter((p) => p.isPrediction);

  // Path generators
  const actualPolyline = actualPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const predPolyline =
    actualPoints.length > 0 && predPoints.length > 0
      ? `${actualPoints[actualPoints.length - 1].x},${actualPoints[actualPoints.length - 1].y} ` +
        predPoints.map((p) => `${p.x},${p.y}`).join(" ")
      : predPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <section className="surface-card border rounded-lg shadow-xs overflow-hidden">
      {/* SB Admin Card Header */}
      <div className="px-4.5 py-3 border-b border-fco-border-subtle surface-inset flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LineChart
            size={16}
            className="text-fco-blue shrink-0"
            aria-hidden="true"
          />
          <h2 className="m-0 text-sm font-bold text-strong">
            PNBP Bulanan: Aktual dan Prediksi
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs text-soft">
          <span className="flex items-center gap-1.5">
            <svg width="18" height="4" viewBox="0 0 20 4" aria-hidden="true">
              <line
                x1="0"
                y1="2"
                x2="20"
                y2="2"
                stroke="#1A56DB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Aktual</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="18" height="4" viewBox="0 0 20 4" aria-hidden="true">
              <line
                x1="0"
                y1="2"
                x2="20"
                y2="2"
                stroke="#3F82E8"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />
            </svg>
            <span>Prediksi AI</span>
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {stats &&
        stats.total_pnbp_sum !== undefined &&
        stats.total_pnbp_sum > 0 ? (
          <div className="text-xs text-soft mb-4">
            Akumulasi tercatat:{" "}
            <span className="font-semibold text-fco-blue tabular-nums">
              {formatRupiah(stats.total_pnbp_sum, false)}
            </span>
            {stats.unique_ships ? ` dari ${stats.unique_ships} kapal` : ""}
          </div>
        ) : (
          <div className="text-xs text-soft mb-4">
            Visualisasi deret waktu berbasis data transaksi laporan tangkapan
          </div>
        )}

        {loading ? (
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-56 w-full rounded-lg" />
            <div className="flex justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-10 rounded" />
              ))}
            </div>
          </div>
        ) : !hasData ? (
          <div className="py-16 px-4 flex flex-col items-center justify-center text-center gap-3 border border-dashed border-fco-border rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-fco-blue-light dark:bg-fco-blue/15 text-fco-blue flex items-center justify-center">
              <TrendingUp size={24} aria-hidden="true" />
            </div>
            <div>
              <h3 className="m-0 text-sm font-bold text-strong">
                Belum Ada Transaksi Tangkapan untuk Grafik PNBP
              </h3>
              <p className="m-0 text-xs text-soft max-w-md mt-1 leading-relaxed">
                Saat laporan penangkapan ikan dicatat di sistem, kurva aktual
                dan proyeksi 4 model analitis AI akan terbentuk secara otomatis
                di sini.
              </p>
            </div>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            role="img"
            aria-label="Grafik garis PNBP bulanan"
            className="w-full h-auto block"
          >
            {/* Y Axis Grid Lines */}
            {[0, 0.33, 0.66, 1].map((ratio) => {
              const y = padTop + plotHeight * (1 - ratio);
              const val = maxValue * ratio;
              return (
                <g key={ratio}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#E6EDF8"
                    strokeWidth="1"
                    className="dark:stroke-slate-800"
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    fontSize="11"
                    fill="#5B6B86"
                    textAnchor="end"
                    className="font-mono text-soft"
                  >
                    {formatRupiah(val).replace("Rp ", "")}
                  </text>
                </g>
              );
            })}

            {/* Actual Polyline */}
            {actualPolyline && (
              <polyline
                points={actualPolyline}
                fill="none"
                stroke="#1A56DB"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Prediction Polyline (Dashed) */}
            {predPolyline && (
              <polyline
                points={predPolyline}
                fill="none"
                stroke="#3F82E8"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
            )}

            {/* Points circles and X labels */}
            {coords.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4.5}
                  fill={p.isPrediction ? "#FFFFFF" : "#1A56DB"}
                  stroke={p.isPrediction ? "#3F82E8" : "#FFFFFF"}
                  strokeWidth="2"
                />
                <text
                  x={p.x}
                  y={svgHeight - 12}
                  fontSize="11"
                  fill="#5B6B86"
                  textAnchor="middle"
                  className="font-semibold text-soft"
                >
                  {p.label}
                </text>
              </g>
            ))}
          </svg>
        )}
      </div>
    </section>
  );
}
