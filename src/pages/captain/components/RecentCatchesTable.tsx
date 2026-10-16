import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { StatusChip } from "../../../components/StatusChip";

export interface CatchReport {
  date: string;
  species: string;
  qty: string;
  pnbp: string;
}

interface RecentCatchesTableProps {
  reports?: CatchReport[];
}

export function RecentCatchesTable({ reports = [] }: RecentCatchesTableProps) {
  return (
    <section className="surface-card border rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-base font-bold text-strong">
          Laporan terakhir
        </h2>
        <Link
          to="/captain/catches"
          className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-115">
          <div className="flex items-center py-2.5 text-xs font-semibold text-soft">
            <div className="basis-3/12">Tanggal</div>
            <div className="basis-3/12">Spesies</div>
            <div className="basis-2/12 text-right">Jumlah</div>
            <div className="basis-2/12 text-right">PNBP</div>
            <div className="basis-2/12 text-right">Status</div>
          </div>

          {reports.length === 0 ? (
            <div className="py-8 text-center text-sm text-soft border-t border-fco-border-subtle">
              Belum ada riwayat tangkapan tercatat untuk kapal ini.
            </div>
          ) : (
            reports.map((r, i) => (
              <div
                key={i}
                className="flex items-center py-3.5 border-t border-fco-border-subtle text-sm"
              >
                <div className="basis-3/12 tabular-nums text-strong">
                  {r.date}
                </div>
                <div className="basis-3/12 font-semibold text-strong">
                  {r.species}
                </div>
                <div className="basis-2/12 text-right tabular-nums text-strong">
                  {r.qty}
                </div>
                <div className="basis-2/12 text-right tabular-nums text-strong">
                  {r.pnbp}
                </div>
                <div className="basis-2/12 text-right">
                  <StatusChip
                    label="Tercatat"
                    bg="#E8F0FE"
                    color="#1A56DB"
                    icon={
                      <Check
                        size={13}
                        className="text-fco-blue"
                        strokeWidth={2.6}
                        aria-hidden="true"
                      />
                    }
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
