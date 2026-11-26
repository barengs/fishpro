import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { regionsService, type FishingArea } from "../../../services/regions";
import { catchesService } from "../../../services/catches";
import { formatWeight } from "../../../utils";

interface WppItem {
  label: string;
  value: string;
  width: string;
}

export function WppBarChart() {
  const [items, setItems] = useState<WppItem[]>([]);

  useEffect(() => {
    async function loadWppStats() {
      try {
        const [areas, catches] = await Promise.all([
          regionsService.getAll().catch(() => [] as FishingArea[]),
          catchesService.getAll().catch(() => []),
        ]);

        const defaultCodes = ["571", "572", "573", "711", "712"];
        const counts: Record<string, number> = {};
        for (const c of defaultCodes) {
          counts[c] = 0;
        }

        if (areas.length > 0) {
          for (const a of areas) {
            counts[a.code] = 0;
          }
        }

        // Count catch details in each area
        for (const c of catches) {
          for (const d of c.catch_details || []) {
            const code = String(d.wpp_name || "573").replace(/WPP[-\s]*/i, "");
            counts[code] = (counts[code] || 0) + (parseFloat(String(d.quantity)) || 0);
          }
        }

        const codesToShow = areas.length > 0 ? areas.slice(0, 5).map((a) => a.code.replace(/WPP[-\s]*/i, "")) : defaultCodes;
        const maxVal = Math.max(...codesToShow.map((c) => counts[c] || 0), 1);

        const formatted = codesToShow.map((code) => {
          const qty = counts[code] || 0;
          return {
            label: code,
            value: formatWeight(qty),
            width: maxVal > 0 && qty > 0 ? `${Math.round((qty / maxVal) * 100)}%` : "0%",
          };
        });

        setItems(formatted);
      } catch {
        // Fallback matching sample
        setItems(["571", "572", "573", "711", "712"].map((c) => ({
          label: c,
          value: "0 kg",
          width: "0%",
        })));
      }
    }

    loadWppStats();
  }, []);

  const totalCatches = items.reduce((acc, curr) => acc + (parseFloat(curr.value) || 0), 0);

  return (
    <section className="bg-white dark:bg-[#0f1729] border border-[#e6e9ef] dark:border-[#1f2a42] rounded-2xl shadow-subtle overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Card Header matching sample: .ch */}
        <div className="p-5 sm:p-6 pb-2">
          <h2 className="text-[16px] font-bold text-ink dark:text-[#e8edf7] m-0 tracking-tight">
            Tangkapan per wilayah (WPP)
          </h2>
          <p className="text-[13px] text-subtext dark:text-[#98a6c0] m-0 mt-0.5">
            Distribusi menurut zona
          </p>
        </div>

        {/* Zone bars matching sample: .wp .bl .bar */}
        <div className="px-5 sm:px-6 py-2 space-y-4">
          {items.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between items-center text-[13px]">
                <b className="font-semibold text-ink dark:text-[#e8edf7]">{item.label}</b>
                <span className="text-[#64718a] dark:text-[#98a6c0] tabular-nums font-medium">{item.value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#f1f4f9] dark:bg-[#141d33] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#0d9488] transition-all duration-700 ease-out"
                  style={{ width: item.width }}
                />
              </div>
            </div>
          ))}
        </div>

        {totalCatches === 0 && (
          <div className="text-[13px] text-[#94a0b8] px-5 sm:px-6 py-3">
            Belum ada data tangkapan tercatat.
          </div>
        )}
      </div>

      <div className="p-4 sm:px-6 border-t border-[#e6e9ef] dark:border-[#1f2a42] mt-auto">
        <Link
          to="/admin/areas"
          className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-[13px] no-underline group hover:underline"
        >
          <span>Buka peta wilayah tangkapan (WPP)</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
