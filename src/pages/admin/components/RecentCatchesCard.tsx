import { Link } from "react-router-dom";
import { Fish } from "lucide-react";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { FishCatch } from "../../../services/catches";
import { formatRupiah, formatWeight } from "../../../utils";

interface RecentCatchesCardProps {
  catches: FishCatch[];
  loading?: boolean;
}

function getCatchVolumeKg(c: FishCatch): number {
  return (c.catch_details || []).reduce(
    (sum, d) => sum + (Number(d.quantity) || 0),
    0,
  );
}

function getCatchPnbp(c: FishCatch): number {
  return (c.catch_details || []).reduce(
    (sum, d) => sum + (Number(d.pnbp) || 0),
    0,
  );
}

function getSpeciesSummary(c: FishCatch): string {
  const details = c.catch_details || [];
  if (details.length === 0) return c.catch_type || "Tangkapan laut";
  const first = details[0].fish_species_name || "Ikan tangkapan";
  return details.length > 1 ? `${first} +${details.length - 1}` : first;
}

function formatShortDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RecentCatchesCard({
  catches,
  loading = false,
}: RecentCatchesCardProps) {
  return (
    <section className="bg-white dark:bg-[#0f1729] border border-[#e6e9ef] dark:border-[#1f2a42] rounded-2xl flex flex-col justify-between h-full shadow-subtle overflow-hidden">
      <div>
        <div className="p-5 sm:p-6 pb-2">
          <h2 className="text-[16px] font-bold text-ink dark:text-[#e8edf7] m-0 tracking-tight">
            Tangkapan terbaru
          </h2>
          <p className="text-[13px] text-subtext dark:text-[#98a6c0] m-0 mt-0.5">
            Pendaratan kapal tercatat
          </p>
        </div>

        {loading ? (
          <div className="p-5 sm:px-6 space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ) : catches.length === 0 ? (
          <div className="px-5 sm:px-6 py-10 text-center text-[13px] text-[#94a0b8] border-t border-[#e6e9ef] dark:border-[#1f2a42] mt-2">
            Belum ada laporan tangkapan tercatat.
          </div>
        ) : (
          <div className="px-5 sm:px-6 pt-1 divide-y divide-[#e6e9ef] dark:divide-[#1f2a42]">
            {catches.slice(0, 4).map((c) => {
              const volKg = getCatchVolumeKg(c);
              const pnbp = getCatchPnbp(c);
              const shipLabel = c.ship_name || String(c.ship || "Kapal");

              return (
                <div
                  key={c.id}
                  className="py-3.5 flex items-center justify-between gap-3 first:border-t first:border-[#e6e9ef] dark:first:border-[#1f2a42]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-[#eaf1ff] dark:bg-[#14264d] text-[#2563eb] dark:text-[#5b94ff] grid place-items-center shrink-0">
                      <Fish size={15} strokeWidth={1.9} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <strong className="block text-[13.5px] font-semibold text-ink dark:text-[#e8edf7] truncate">
                        {shipLabel}
                      </strong>
                      <span className="block text-[12px] text-subtext dark:text-[#98a6c0] truncate">
                        {getSpeciesSummary(c)} · {formatShortDate(c.catch_date)}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-[13.5px] font-bold text-ink dark:text-white tabular-nums">
                      {formatWeight(volKg)}
                    </span>
                    <span className="block text-[11.5px] text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
                      {formatRupiah(pnbp, true)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 sm:px-6 border-t border-[#e6e9ef] dark:border-[#1f2a42] mt-2">
        <Link
          to="/admin/catches"
          className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-[13px] no-underline group hover:underline"
        >
          <span>Lihat semua laporan</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
