import { ProgressBar } from "../../../components/ProgressBar";
import { StatusChip } from "../../../components/StatusChip";

export interface ShipQuotaItem {
  name: string;
  reg: string;
  owner: string;
  allocatedQuota: string;
  usedQuota: string;
  percentRemaining: string;
  aiRecommendedQuota: string;
  status: string;
  statusBg: string;
  statusColor: string;
}

interface QuotaAuditTableProps {
  ships: ShipQuotaItem[];
  onAdjustQuota: (ship: ShipQuotaItem) => void;
}

export function QuotaAuditTable({
  ships,
  onAdjustQuota,
}: QuotaAuditTableProps) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#111827] shadow-subtle overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#E5E7EB] dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="m-0 text-[15px] font-bold text-ink dark:text-white">
            Audit & Monitoring Kuota Kapal
          </h2>
          <div className="text-xs text-subtext dark:text-slate-400 mt-0.5">
            Data perbandingan alokasi kuota vs rekomendasi optimasi AI
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-185">
          <div className="flex items-center py-3 px-4 text-[11px] font-semibold uppercase tracking-wider text-subtext dark:text-slate-400 bg-[#F9FAFB] dark:bg-slate-800/60 border-b border-[#E5E7EB] dark:border-slate-700 gap-2">
            <div className="w-8 shrink-0 text-center">No</div>
            <div className="basis-3/12">Kapal & Pemilik</div>
            <div className="basis-2/12">Alokasi Kuota</div>
            <div className="basis-2/12">Rekomendasi AI</div>
            <div className="basis-3/12">Sisa Kuota</div>
            <div className="basis-2/12 text-center">Status</div>
            <div className="basis-2/12 text-right">Aksi</div>
          </div>

          <div className="divide-y divide-[#E5E7EB] dark:divide-slate-800">
            {ships.map((s, i) => (
              <div
                key={s.reg}
                className="flex items-center py-3.5 px-4 gap-2 hover:bg-[#F9FAFB] dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="w-8 shrink-0 text-center tabular-nums text-xs font-semibold text-subtext dark:text-slate-400">
                  {i + 1}
                </div>
                <div className="basis-3/12">
                  <div className="text-sm font-semibold text-ink dark:text-white">
                    {s.name}
                  </div>
                  <div className="text-xs text-subtext dark:text-slate-400">
                    {s.reg} · {s.owner}
                  </div>
                </div>
                <div className="basis-2/12 text-sm font-semibold text-ink dark:text-white">
                  {s.allocatedQuota}
                </div>
                <div className="basis-2/12 text-sm font-semibold text-brand-600 dark:text-brand-400">
                  {s.aiRecommendedQuota}
                </div>
                <div className="basis-3/12 pr-5">
                  <ProgressBar width={s.percentRemaining} showText />
                </div>
                <div className="basis-2/12 text-center">
                  <StatusChip
                    label={s.status}
                    bg={s.statusBg}
                    color={s.statusColor}
                  />
                </div>
                <div className="basis-2/12 text-right">
                  <button
                    type="button"
                    onClick={() => onAdjustQuota(s)}
                    className="px-2.5 py-1 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-xs font-semibold text-ink dark:text-white transition-colors cursor-pointer"
                  >
                    Sesuaikan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
