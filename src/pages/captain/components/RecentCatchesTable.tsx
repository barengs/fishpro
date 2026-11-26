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
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#111827] shadow-subtle overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
        <h2 className="m-0 text-[15px] font-bold text-ink dark:text-white">
          Laporan terakhir
        </h2>
        <Link
          to="/captain/catches"
          className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 no-underline"
        >
          Lihat semua
        </Link>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-120">
          <div className="flex items-center py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-subtext dark:text-slate-400 bg-[#F9FAFB] dark:bg-slate-800/60 border-b border-[#E5E7EB] dark:border-slate-700 gap-2">
            <div className="w-8 shrink-0 text-center">No</div>
            <div className="basis-3/12">Tanggal</div>
            <div className="basis-3/12">Spesies</div>
            <div className="basis-2/12 text-right">Jumlah</div>
            <div className="basis-2/12 text-right">PNBP</div>
            <div className="basis-2/12 text-right">Status</div>
          </div>

          {reports.length === 0 ? (
            <div className="py-8 text-center text-sm text-subtext dark:text-slate-400">
              Belum ada riwayat tangkapan tercatat untuk kapal ini.
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB] dark:divide-slate-800">
              {reports.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center py-3.5 px-4 text-sm gap-2 hover:bg-[#F9FAFB] dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="w-8 shrink-0 text-center tabular-nums text-xs font-semibold text-subtext dark:text-slate-400">
                    {i + 1}
                  </div>
                  <div className="basis-3/12 tabular-nums text-ink dark:text-slate-200">
                    {r.date}
                  </div>
                  <div className="basis-3/12 font-semibold text-ink dark:text-white">
                    {r.species}
                  </div>
                  <div className="basis-2/12 text-right tabular-nums text-ink dark:text-slate-200">
                    {r.qty}
                  </div>
                  <div className="basis-2/12 text-right tabular-nums font-medium text-brand-600 dark:text-brand-400">
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
                          className="text-brand-600"
                          strokeWidth={2.6}
                          aria-hidden="true"
                        />
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
