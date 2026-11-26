import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "../../../components/ui/Skeleton";
import type { AdminDashboardData } from "../../../services/dashboard/types";
import { shipsService, type Ship } from "../../../services/ships";
import { formatWeight } from "../../../utils";

interface CriticalShipItem {
  name: string;
  reg: string;
  hasQuota: boolean;
  pct: number | null;
  remainingKg?: number;
  statusText: string;
  isWarning: boolean;
  isCritical: boolean;
}

interface CriticalQuotaTableProps {
  ships?: AdminDashboardData["critical_quota_ships"];
  loading?: boolean;
}

function mapDashboardShip(
  s: AdminDashboardData["critical_quota_ships"][number],
): CriticalShipItem {
  const pct = typeof s.quota_percentage === "number" ? s.quota_percentage : null;
  const isCritical = s.status === "Kritis" || (pct !== null && pct < 15);
  const isWarning =
    isCritical || s.status === "Waspada" || (pct !== null && pct < 35);
  return {
    name: s.name,
    reg: s.registration_number,
    hasQuota: pct !== null,
    pct,
    remainingKg: s.remaining_quota_kg,
    statusText: isCritical ? "Kritis" : isWarning ? "Perhatian" : "Normal",
    isWarning,
    isCritical,
  };
}

function mapStandaloneShip(s: Ship): CriticalShipItem {
  const quota = s.current_year_quota;
  const hasQuota = Boolean(quota && typeof quota.quota_percentage === "number");
  const pct = hasQuota ? quota!.quota_percentage : null;
  const isCritical = pct !== null && pct < 15;
  const isWarning = isCritical || (pct !== null && pct < 35);
  return {
    name: s.name,
    reg: s.registration_number,
    hasQuota,
    pct,
    remainingKg: hasQuota ? Number(quota!.remaining_quota) : undefined,
    statusText: !hasQuota
      ? "Belum Diatur"
      : isCritical
        ? "Kritis"
        : isWarning
          ? "Perhatian"
          : "Normal",
    isWarning,
    isCritical,
  };
}

export function CriticalQuotaTable({
  ships,
  loading: externalLoading = false,
}: CriticalQuotaTableProps) {
  const [fetchedRows, setFetchedRows] = useState<CriticalShipItem[]>([]);
  const [internalLoading, setInternalLoading] = useState(ships === undefined);
  const [filter, setFilter] = useState<"all" | "warn" | "normal">("all");

  const hasExternalShips = ships !== undefined;

  useEffect(() => {
    if (hasExternalShips) return;

    let ignore = false;
    async function loadCriticalShips() {
      try {
        const list: Ship[] = await shipsService.getAll();
        if (ignore) return;
        const parsed = list.map(mapStandaloneShip);
        parsed.sort((a, b) => {
          if (a.pct !== null && b.pct !== null) return a.pct - b.pct;
          if (a.pct !== null) return -1;
          if (b.pct !== null) return 1;
          return 0;
        });
        setFetchedRows(parsed.slice(0, 5));
      } catch {
        if (!ignore) setFetchedRows([]);
      } finally {
        if (!ignore) setInternalLoading(false);
      }
    }

    loadCriticalShips();
    return () => {
      ignore = true;
    };
  }, [hasExternalShips]);

  const rows = hasExternalShips ? ships.map(mapDashboardShip) : fetchedRows;
  const isLoading = hasExternalShips ? externalLoading : internalLoading;

  const filteredRows = rows.filter((r) => {
    if (filter === "all") return true;
    if (filter === "warn") return r.isWarning;
    if (filter === "normal") return r.hasQuota && !r.isWarning;
    return true;
  });

  const getInitials = (name: string) => {
    const parts = name.replace(/^KM\s+/i, "").split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <section className="bg-white dark:bg-[#0f1729] border border-[#e6e9ef] dark:border-[#1f2a42] rounded-2xl shadow-subtle overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Card Header with segmented toggle */}
        <div className="p-5 sm:p-6 pb-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[16px] font-bold text-ink dark:text-[#e8edf7] m-0 tracking-tight">
              Peringatan kuota kapal
            </h2>
            <p className="text-[13px] text-subtext dark:text-[#98a6c0] m-0 mt-0.5">
              Diurutkan dari sisa kuota terendah
            </p>
          </div>

          <div className="flex gap-1 bg-[#f1f4f9] dark:bg-slate-800/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`border-none text-[12.5px] font-semibold py-1 px-3 rounded-full cursor-pointer transition-all ${
                filter === "all"
                  ? "bg-white text-ink shadow-xs dark:bg-slate-700 dark:text-white"
                  : "bg-transparent text-subtext hover:text-ink dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setFilter("warn")}
              className={`border-none text-[12.5px] font-semibold py-1 px-3 rounded-full cursor-pointer transition-all ${
                filter === "warn"
                  ? "bg-white text-ink shadow-xs dark:bg-slate-700 dark:text-white"
                  : "bg-transparent text-subtext hover:text-ink dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Perhatian
            </button>
            <button
              type="button"
              onClick={() => setFilter("normal")}
              className={`border-none text-[12.5px] font-semibold py-1 px-3 rounded-full cursor-pointer transition-all ${
                filter === "normal"
                  ? "bg-white text-ink shadow-xs dark:bg-slate-700 dark:text-white"
                  : "bg-transparent text-subtext hover:text-ink dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Normal
            </button>
          </div>
        </div>

        {/* Table Column Headers */}
        <div className="grid grid-cols-[40px_minmax(120px,1.2fr)_minmax(120px,1.3fr)_90px] gap-4 items-center px-6 py-2.5 text-[12px] font-semibold text-[#94a0b8] border-t border-[#e6e9ef] dark:border-[#1f2a42]">
          <span />
          <span>Kapal</span>
          <span>Sisa kuota</span>
          <span className="text-right">Status</span>
        </div>

        {/* Table Rows */}
        {isLoading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="text-[13px] text-[#94a0b8] px-6 py-6 text-center">
            Tidak ada kapal pada kategori ini.
          </div>
        ) : (
          <div className="divide-y divide-[#e6e9ef] dark:divide-[#1f2a42]">
            {filteredRows.map((q) => {
              const pctNum = q.pct ?? 0;
              const barColor = q.isCritical
                ? "#dc2626"
                : q.isWarning
                  ? "#d97706"
                  : "#0d9488";

              return (
                <div
                  key={q.reg}
                  className="grid grid-cols-[40px_minmax(120px,1.2fr)_minmax(120px,1.3fr)_90px] gap-4 items-center px-6 py-3.5 hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-[#eaf1ff] dark:bg-[#14264d] text-[#2563eb] dark:text-[#5b94ff] grid place-items-center font-bold text-[12px] shrink-0">
                    {getInitials(q.name)}
                  </span>

                  <div className="min-w-0 pr-2">
                    <strong className="block text-[13.5px] font-semibold text-ink dark:text-[#e8edf7] truncate">
                      {q.name}
                    </strong>
                    <small className="block text-[12px] font-mono text-[#94a0b8] truncate">
                      {q.reg}
                    </small>
                  </div>

                  <div>
                    <div className="flex justify-between gap-2 text-[13px] text-[#64718a] dark:text-[#98a6c0] mb-1.5">
                      <b className="font-semibold text-ink dark:text-[#e8edf7] tabular-nums">
                        {q.pct !== null
                          ? `${q.pct.toFixed(2).replace(".", ",")}%`
                          : "—"}
                      </b>
                      <span className="truncate tabular-nums">
                        {q.remainingKg !== undefined
                          ? formatWeight(q.remainingKg)
                          : "tersisa"}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#f1f4f9] dark:bg-[#141d33] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${Math.min(100, Math.max(0, pctNum))}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </div>

                  <span className="text-right text-[13px] font-medium text-[#64718a] dark:text-[#98a6c0] whitespace-nowrap flex items-center justify-end gap-1.5">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        q.isCritical
                          ? "bg-rose-500"
                          : q.isWarning
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                    />
                    {q.statusText}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Foot action link */}
      <div className="p-4 sm:px-6 border-t border-[#e6e9ef] dark:border-[#1f2a42] mt-auto">
        <Link
          to="/admin/ships"
          className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-semibold text-[13px] no-underline group hover:underline"
        >
          <span>Lihat semua kapal</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
