import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProgressBar } from "../../../components/ProgressBar";
import { StatusChip } from "../../../components/StatusChip";
import { shipsService, type Ship } from "../../../services/ships";
import { Loader2 } from "lucide-react";

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
    <section className="surface-card border rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-base font-bold text-strong">
          Kuota hampir habis (Kapal Prioritas)
        </h2>
        <Link
          to="/admin/ships"
          className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
        >
          Semua kapal →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-115">
          <div className="flex items-center py-2.5 text-xs font-semibold text-soft">
            <div className="basis-3/8">Kapal</div>
            <div className="basis-3/8">Sisa kuota</div>
            <div className="basis-2/8 text-right">Status</div>
          </div>

          {loading ? (
            <div className="py-8 flex items-center justify-center gap-2 text-sm text-soft">
              <Loader2 size={18} className="animate-spin text-fco-blue" />
              <span>Memuat status kuota kapal...</span>
            </div>
          ) : rows.length === 0 ? (
            <div className="py-8 text-center text-sm text-soft border-t border-fco-border-subtle">
              Belum ada data kapal terdaftar di database KKP.
            </div>
          ) : (
            rows.map((q) => (
              <div
                key={q.reg}
                className="flex items-center py-3.5 border-t border-fco-border-subtle"
              >
                <div className="basis-3/8">
                  <div className="text-sm font-semibold text-strong">
                    {q.name}
                  </div>
                  <div className="text-xs text-soft tabular-nums">{q.reg}</div>
                </div>
                <div className="basis-3/8 pr-6">
                  <ProgressBar width={q.width} showText />
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
