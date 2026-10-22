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
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-base font-bold text-strong">
          Laporan terakhir
        </h2>
        <Link
          to="/captain/catches"
          className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
        >
          Lihat semua
        </Link>
      </div>

      <div className="border border-fco-border-subtle surface-card rounded-xs overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <div className="min-w-120">
            <div className="flex items-center py-3 px-3 text-xs font-bold text-white bg-fco-blue gap-2">
              <div className="w-8 shrink-0 text-center">No</div>
              <div className="basis-3/12">Tanggal</div>
              <div className="basis-3/12">Spesies</div>
              <div className="basis-2/12 text-right">Jumlah</div>
              <div className="basis-2/12 text-right">PNBP</div>
              <div className="basis-2/12 text-right">Status</div>
            </div>

            {reports.length === 0 ? (
              <div className="py-8 text-center text-sm text-soft border-t border-fco-border-subtle bg-white dark:bg-fco-card-dark">
                Belum ada riwayat tangkapan tercatat untuk kapal ini.
              </div>
            ) : (
              reports.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center py-3 px-3 border-t border-fco-border-subtle text-sm bg-white dark:bg-fco-card-dark gap-2"
                >
                  <div className="w-8 shrink-0 text-center tabular-nums text-xs font-semibold text-soft">
                    {i + 1}
                  </div>
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
      </div>
    </div>
  );
}
