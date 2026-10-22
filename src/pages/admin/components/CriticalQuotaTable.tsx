import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "../../../components/ProgressBar";
import { StatusChip } from "../../../components/StatusChip";
import { Skeleton } from "../../../components/ui/Skeleton";
import { shipsService, type Ship } from "../../../services/ships";
import { AlertTriangle } from "lucide-react";

interface CriticalShipItem {
  name: string;
  reg: string;
  pct: number;
  width: string;
  chip: string;
  chipBg: string;
  chipColor: string;
}

export function CriticalQuotaTable() {
  const [rows, setRows] = useState<CriticalShipItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCriticalShips() {
      try {
        const ships: Ship[] = await shipsService.getAll();
        if (ships.length > 0) {
          const parsed = ships.map((s) => {
            const quota = s.current_year_quota;
            const pct = quota ? quota.quota_percentage : 70;
            const isNearEmpty = pct < 15;
            const isWarning = pct < 35;
            return {
              name: s.name,
              reg: s.registration_number,
              pct,
              width: `${pct}%`,
              chip: isNearEmpty
                ? "Hampir habis"
                : isWarning
                  ? "Perlu dipantau"
                  : "Normal",
              chipBg: isNearEmpty
                ? "#FFF1E0"
                : isWarning
                  ? "#E8F0FE"
                  : "#EEF1F6",
              chipColor: isNearEmpty
                ? "#B54708"
                : isWarning
                  ? "#1A56DB"
                  : "#4A5872",
            };
          });

          // Sort by lowest remaining quota first, pick top 5
          parsed.sort((a, b) => a.pct - b.pct);
          setRows(parsed.slice(0, 5));
        } else {
          setRows([]);
        }
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    loadCriticalShips();
  }, []);

  return (
    <section className="surface-card border rounded-lg shadow-xs overflow-hidden">
      {/* SB Admin Card Header */}
      <div className="px-4.5 py-3 border-b border-fco-border-subtle surface-inset flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle
            size={16}
            className="text-amber-500 shrink-0"
            aria-hidden="true"
          />
          <h2 className="m-0 text-sm font-bold text-strong">
            Peringatan Kuota Kapal (Prioritas)
          </h2>
        </div>
        <Link
          to="/admin/ships"
          className="text-xs font-semibold text-fco-blue hover:underline no-underline"
        >
          Lihat Semua Kapal
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-120">
          <div className="flex items-center py-3 px-4 text-xs font-bold text-white bg-fco-blue gap-2">
            <div className="w-8 shrink-0 text-center">No</div>
            <div className="basis-3/8">Kapal</div>
            <div className="basis-3/8">Sisa kuota</div>
            <div className="basis-2/8 text-right">Status</div>
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={`skel-${i}`}
                className="flex items-center py-3 px-4 border-t border-fco-border-subtle text-sm gap-2"
              >
                <div className="w-8 shrink-0 flex justify-center">
                  <Skeleton className="h-4 w-5 rounded-xs" />
                </div>
                <div className="basis-3/8 space-y-1.5 pr-2">
                  <Skeleton className="h-4 w-3/4 rounded-xs" />
                  <Skeleton className="h-3 w-1/2 rounded-xs opacity-60" />
                </div>
                <div className="basis-3/8 space-y-1.5 pr-2">
                  <Skeleton className="h-3 w-1/3 rounded-xs" />
                  <Skeleton className="h-2 w-full rounded-xs" />
                </div>
                <div className="basis-2/8 flex justify-end">
                  <Skeleton className="h-5 w-16 rounded-xs" />
                </div>
              </div>
            ))
          ) : rows.length === 0 ? (
            <div className="py-8 text-center text-sm text-soft border-t border-fco-border-subtle bg-white dark:bg-fco-card-dark">
              Belum ada data kapal terdaftar di database KKP.
            </div>
          ) : (
            rows.map((q, i) => (
              <div
                key={q.reg}
                className="flex items-center py-3 px-4 border-t border-fco-border-subtle text-sm gap-2 bg-white dark:bg-fco-card-dark"
              >
                <div className="w-8 shrink-0 text-center tabular-nums text-xs font-semibold text-soft">
                  {i + 1}
                </div>
                <div className="basis-3/8 min-w-0">
                  <div className="font-semibold text-strong truncate">
                    {q.name}
                  </div>
                  <div className="text-2xs text-soft font-mono truncate">
                    {q.reg}
                  </div>
                </div>
                <div className="basis-3/8">
                  <div className="text-xs font-medium text-soft mb-1 tabular-nums">
                    {q.pct}% tersisa
                  </div>
                  <ProgressBar
                    width={q.width}
                    height={6}
                    barBg={
                      q.pct < 15
                        ? "#EF4444"
                        : q.pct < 30
                          ? "#F59E0B"
                          : "#1A56DB"
                    }
                  />
                </div>
                <div className="basis-2/8 text-right">
                  <StatusChip
                    label={q.chip}
                    bg={q.chipBg}
                    color={q.chipColor}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
