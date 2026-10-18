import { useEffect, useState } from "react";
import { pnbpService } from "../../../services/pnbp";
import { formatRupiah } from "../../../utils";
import { Skeleton } from "../../../components/ui/Skeleton";
import { BarChart3 } from "lucide-react";

const past = "#1A56DB";
const next = "#BCD3F8";

interface BarItem {
  label: string;
  h: string;
  color: string;
  top: string;
}

export function PnbpPredictionBars() {
  const [bars, setBars] = useState<BarItem[]>([]);
  const [summaryInfo, setSummaryInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pnbpService
      .getUnifiedChartData()
      .then((res) => {
        const stats = res.charts_data?.summary_stats;
        if (stats && stats.total_pnbp_sum && stats.total_pnbp_sum > 0) {
          setSummaryInfo(
            `Total tercatat: ${formatRupiah(stats.total_pnbp_sum)}`,
          );
        }

        const preds = res.charts_data?.pnbp_predictions?.data;
        if (
          preds &&
          preds.monthly_forecasts &&
          preds.monthly_forecasts.length > 0
        ) {
          const maxPnbp = Math.max(
            ...preds.monthly_forecasts.map(
              (f: { predicted_pnbp: number }) => f.predicted_pnbp || 1,
            ),
            1,
          );

          const dynamicBars: BarItem[] = preds.monthly_forecasts
            .slice(0, 6)
            .map(
              (f: { month: string; predicted_pnbp: number }, idx: number) => ({
                label: f.month || `M${idx + 1}`,
                h: `${Math.round(((f.predicted_pnbp || 0) / maxPnbp) * 85 + 15)}%`,
                color: idx < 3 ? past : next,
                top:
                  idx === preds.monthly_forecasts!.length - 1
                    ? formatRupiah(f.predicted_pnbp)
                    : "",
              }),
            );

          setBars(dynamicBars);
        } else {
          setBars([]);
        }
      })
      .catch(() => {
        setBars([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <section className="surface-card border rounded-xl p-6 shadow-xs">
      <div className="flex justify-between items-start mb-1">
        <h2 className="m-0 text-base font-bold text-strong">
          Prediksi PNBP Armada
        </h2>
        {summaryInfo && (
          <span className="text-xs text-fco-blue font-semibold tabular-nums">
            {summaryInfo}
          </span>
        )}
      </div>
      <div className="text-fco-sm text-soft mb-5">
        Proyeksi tren penerimaan armada berbasis pipeline machine learning
      </div>

      {loading ? (
        <div className="flex items-end gap-3 h-37.5 py-1">
          {["h-16", "h-24", "h-20", "h-28", "h-32", "h-22"].map((h, idx) => (
            <div
              key={idx}
              className="flex-1 h-full flex flex-col justify-end items-center gap-2"
            >
              <Skeleton className={`w-full rounded-t-md ${h}`} />
              <Skeleton className="h-3 w-8 rounded" />
            </div>
          ))}
        </div>
      ) : bars.length === 0 ? (
        <div className="py-8 px-4 flex flex-col items-center justify-center text-center gap-2 border border-dashed border-fco-border rounded-xl">
          <BarChart3 size={20} className="text-soft" />
          <p className="m-0 text-xs text-soft">
            Belum ada data proyeksi PNBP untuk armada Anda. Data grafik akan
            muncul setelah laporan tangkapan terakumulasi.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-3 h-37.5">
            {bars.map((b) => (
              <div
                key={b.label}
                className="flex-1 h-full flex flex-col justify-end items-center gap-1.5"
              >
                <div className="text-fco-xs font-bold text-strong h-3.5">
                  {b.top}
                </div>
                <div
                  className="w-full rounded-t-md transition-all duration-300"
                  style={{ height: b.h, backgroundColor: b.color }}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            {bars.map((b) => (
              <div
                key={b.label}
                className="flex-1 text-center text-xs text-soft"
              >
                {b.label}
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-4 text-xs text-soft">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-fco-blue" />
              Aktual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-fco-blue-border" />
              Prediksi
            </span>
          </div>
        </>
      )}
    </section>
  );
}
