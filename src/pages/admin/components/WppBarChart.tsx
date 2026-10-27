import { useEffect, useState } from "react";
import { ProgressBar } from "../../../components/ProgressBar";
import { Skeleton } from "../../../components/ui/Skeleton";
import { regionsService, type FishingArea } from "../../../services/regions";
import { catchesService } from "../../../services/catches";
import { formatWeight } from "../../../utils";
import { BarChart3 } from "lucide-react";

interface WppItem {
  label: string;
  value: string;
  width: string;
}

export function WppBarChart() {
  const [items, setItems] = useState<WppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWppStats() {
      setLoading(true);
      try {
        const [areas, catches] = await Promise.all([
          regionsService.getAll().catch(() => [] as FishingArea[]),
          catchesService.getAll().catch(() => []),
        ]);

        if (areas.length > 0) {
          const counts: Record<string, number> = {};
          for (const a of areas) {
            counts[a.code] = 0;
          }

          // Count catch details in each area
          for (const c of catches) {
            for (const d of c.catch_details || []) {
              const code = d.wpp_name || "WPP 573";
              counts[code] =
                (counts[code] || 0) + (parseFloat(String(d.quantity)) || 0);
            }
          }

          const list: { label: string; qty: number }[] = areas
            .slice(0, 5)
            .map((a) => {
              const raw = counts[a.code] || 0;
              return {
                label: `${a.code}`,
                qty: Math.round(raw),
              };
            });

          const maxVal = Math.max(...list.map((x) => x.qty), 1);
          const formatted = list.map((x) => ({
            label: x.label,
            value: formatWeight(x.qty),
            width:
              maxVal > 0 && x.qty > 0
                ? `${Math.round((x.qty / maxVal) * 90 + 10)}%`
                : "0%",
          }));

          setItems(formatted);
        } else {
          setItems([]);
        }
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadWppStats();
  }, []);

  return (
    <section className="surface-card border border-slate-200/80 dark:border-fco-border-dark rounded-2xl shadow-2xs overflow-hidden">
      {/* Modern Card Header */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-fco-border-dark flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-fco-blue dark:text-blue-400 flex items-center justify-center shrink-0">
            <BarChart3
              size={16}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </div>
          <h2 className="m-0 text-sm font-semibold text-strong">
            Tangkapan per Wilayah (WPP)
          </h2>
        </div>
        <span className="text-2xs font-semibold text-soft uppercase tracking-wider">
          Distribusi Zona
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {loading ? (
          <div className="flex flex-col gap-4 py-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`skel-wpp-${i}`} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-sm text-soft">
            Belum ada data wilayah tangkapan tercatat.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((w) => (
              <div key={w.label}>
                <div className="flex justify-between mb-1.5 text-xs sm:text-sm">
                  <span className="font-semibold text-strong">{w.label}</span>
                  <span className="text-soft tabular-nums">{w.value}</span>
                </div>
                <ProgressBar width={w.width} height={8} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
