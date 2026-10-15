import { useEffect, useState } from "react";
import { ProgressBar } from "../../../components/ProgressBar";
import { regionsService, type FishingArea } from "../../../services/regions";
import { catchesService } from "../../../services/catches";
import { formatWeight } from "../../../utils";
import { Loader2 } from "lucide-react";

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
    <section className="surface-card border rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="m-0 text-base font-bold text-strong">
          Tangkapan per WPP
        </h2>
        <span className="text-xs text-soft">Wilayah Tangkapan</span>
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center gap-2 text-sm text-soft">
          <Loader2 size={18} className="animate-spin text-fco-blue" />
          <span>Memuat statistik WPP...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-sm text-soft">
          Belum ada data wilayah tangkapan tercatat.
        </div>
      ) : (
        <div className="flex flex-col gap-4.5">
          {items.map((w) => (
            <div key={w.label}>
              <div className="flex justify-between mb-2 text-fco-sm">
                <span className="font-semibold text-strong">{w.label}</span>
                <span className="text-soft tabular-nums">{w.value}</span>
              </div>
              <ProgressBar width={w.width} height={8} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
