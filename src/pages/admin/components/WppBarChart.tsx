import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import type {
  AdminDashboardData,
  WppPotentialItem,
} from "../../../services/dashboard/types";
import { regionsService, type FishingArea } from "../../../services/regions";
import { catchesService } from "../../../services/catches";
import { formatWeight } from "../../../utils";

interface WppItem {
  code: string;
  label: string;
  subtitle?: string;
  value: string;
  width: string;
}

interface WppBarChartProps {
  distribution?: AdminDashboardData["wpp_distribution"];
  potential?: WppPotentialItem[];
  loading?: boolean;
}

export function WppBarChart({
  distribution,
  potential,
  loading: externalLoading = false,
}: WppBarChartProps) {
  const [fetchedItems, setFetchedItems] = useState<WppItem[]>([]);
  const [internalLoading, setInternalLoading] = useState(
    distribution === undefined,
  );

  const hasExternalDistribution = distribution !== undefined;

  useEffect(() => {
    if (hasExternalDistribution) return;

    let ignore = false;
    async function loadWppStats() {
      try {
        const [areas, catches] = await Promise.all([
          regionsService.getAll().catch(() => [] as FishingArea[]),
          catchesService.getAll().catch(() => []),
        ]);
        if (ignore) return;

        const counts: Record<string, { qty: number; trips: number }> = {};
        for (const a of areas) {
          const code = String(a.code).replace(/WPP[-\s]*/i, "");
          counts[code] = { qty: 0, trips: 0 };
        }

        for (const c of catches) {
          for (const d of c.catch_details || []) {
            const code = String(d.wpp_name || "573").replace(/WPP[-\s]*/i, "");
            if (!counts[code]) counts[code] = { qty: 0, trips: 0 };
            counts[code].qty += parseFloat(String(d.quantity)) || 0;
            counts[code].trips += 1;
          }
        }

        const activeCodes = Object.keys(counts)
          .filter((c) => counts[c].qty > 0)
          .sort((a, b) => counts[b].qty - counts[a].qty)
          .slice(0, 5);

        const maxVal = Math.max(
          ...activeCodes.map((c) => counts[c]?.qty || 0),
          1,
        );

        const formatted: WppItem[] = activeCodes.map((code) => {
          const entry = counts[code];
          return {
            code,
            label: `WPP ${code}`,
            subtitle: `${entry.trips} pencatatan`,
            value: formatWeight(entry.qty),
            width: `${Math.round((entry.qty / maxVal) * 100)}%`,
          };
        });

        setFetchedItems(formatted);
      } catch {
        if (!ignore) setFetchedItems([]);
      } finally {
        if (!ignore) setInternalLoading(false);
      }
    }

    loadWppStats();
    return () => {
      ignore = true;
    };
  }, [hasExternalDistribution]);

  const potentialByCode = new Map<string, WppPotentialItem>();
  for (const item of potential || []) {
    const clean = String(item.wpp_code)
      .toUpperCase()
      .replace(/WPP|NRI|-|\s+/g, "")
      .trim();
    potentialByCode.set(clean, item);
  }

  const externalItems: WppItem[] = hasExternalDistribution
    ? (() => {
        const sorted = [...distribution]
          .filter((d) => d.total_volume_kg > 0)
          .sort((a, b) => b.total_volume_kg - a.total_volume_kg)
          .slice(0, 5);
        const maxVal = Math.max(
          ...sorted.map((d) => d.total_volume_kg),
          1,
        );
        return sorted.map((d) => {
          const cleanCode = String(d.wpp_code)
            .toUpperCase()
            .replace(/WPP|NRI|-|\s+/g, "")
            .trim();
          const pot = potentialByCode.get(cleanCode);
          const subParts: string[] = [];
          if (pot?.dominant_species && pot.dominant_species !== "Belum ada laporan") {
            subParts.push(pot.dominant_species);
          }
          if (pot?.peak_months && pot.peak_months !== "Belum ada riwayat") {
            subParts.push(`Puncak ${pot.peak_months}`);
          } else if (d.transaction_count > 0) {
            subParts.push(`${d.transaction_count} pencatatan`);
          }

          return {
            code: cleanCode,
            label: `WPP ${cleanCode}`,
            subtitle: subParts.join(" · ") || d.wpp_name,
            value: formatWeight(d.total_volume_kg),
            width: `${Math.round((d.total_volume_kg / maxVal) * 100)}%`,
          };
        });
      })()
    : [];

  const items = hasExternalDistribution ? externalItems : fetchedItems;
  const isLoading = hasExternalDistribution ? externalLoading : internalLoading;

  return (
    <section className="bg-white dark:bg-[#0f1729] border border-[#e6e9ef] dark:border-[#1f2a42] rounded-2xl shadow-subtle overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="p-5 sm:p-6 pb-2">
          <h2 className="text-[16px] font-bold text-ink dark:text-[#e8edf7] m-0 tracking-tight">
            Tangkapan per wilayah (WPP)
          </h2>
          <p className="text-[13px] text-subtext dark:text-[#98a6c0] m-0 mt-0.5">
            Zona aktif &amp; komoditas dominan
          </p>
        </div>

        {isLoading ? (
          <div className="px-5 sm:px-6 py-4 space-y-3">
            <Skeleton className="h-9 w-full rounded" />
            <Skeleton className="h-9 w-full rounded" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-[13px] text-[#94a0b8] px-5 sm:px-6 py-10 text-center">
            Belum ada data tangkapan tercatat di wilayah WPP.
          </div>
        ) : (
          <div className="px-5 sm:px-6 py-2 space-y-4">
            {items.map((item) => (
              <div key={item.code} className="space-y-1.5">
                <div className="flex justify-between items-baseline gap-3 text-[13px]">
                  <div className="min-w-0">
                    <b className="font-semibold text-ink dark:text-[#e8edf7]">
                      {item.label}
                    </b>
                    {item.subtitle && (
                      <span className="ml-2 text-[12px] text-subtext dark:text-[#98a6c0] truncate">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  <span className="text-ink dark:text-[#e8edf7] tabular-nums font-semibold shrink-0">
                    {item.value}
                  </span>
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
        )}
      </div>

      <div className="p-4 sm:px-6 border-t border-[#e6e9ef] dark:border-[#1f2a42] mt-auto">
        <Link
          to="/admin/areas"
          className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-[13px] no-underline group hover:underline"
        >
          <span>Buka peta wilayah tangkapan (WPP)</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
