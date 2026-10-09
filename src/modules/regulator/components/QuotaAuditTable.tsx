import { ProgressBar } from '../../../components/ProgressBar'
import { StatusChip } from '../../../components/StatusChip'

export interface ShipQuotaItem {
  name: string
  reg: string
  owner: string
  allocatedQuota: string
  usedQuota: string
  percentRemaining: string
  aiRecommendedQuota: string
  status: string
  statusBg: string
  statusColor: string
}

interface QuotaAuditTableProps {
  ships: ShipQuotaItem[]
  onAdjustQuota: (ship: ShipQuotaItem) => void
}

export function QuotaAuditTable({ ships, onAdjustQuota }: QuotaAuditTableProps) {
  return (
    <section className="bg-white border border-[#DCE6F5] rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="m-0 text-base font-bold text-[#0F1F3D]">Audit & Monitoring Kuota Kapal</h2>
          <div className="text-[13px] text-[#5B6B86] mt-0.5">
            Data perbandingan alokasi kuota vs rekomendasi optimasi AI
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="flex items-center py-2.5 text-xs font-semibold text-[#5B6B86]">
            <div className="basis-3/12">Kapal & Pemilik</div>
            <div className="basis-2/12">Alokasi Kuota</div>
            <div className="basis-2/12">Rekomendasi AI</div>
            <div className="basis-3/12">Sisa Kuota</div>
            <div className="basis-2/12 text-center">Status</div>
            <div className="basis-2/12 text-right">Aksi</div>
          </div>

          {ships.map((s) => (
            <div key={s.reg} className="flex items-center py-4 border-t border-[#EEF3FB]">
              <div className="basis-3/12">
                <div className="text-sm font-semibold text-[#0F1F3D]">{s.name}</div>
                <div className="text-xs text-[#5B6B86]">
                  {s.reg} · {s.owner}
                </div>
              </div>
              <div className="basis-2/12 text-[13px] font-semibold text-[#0F1F3D]">{s.allocatedQuota}</div>
              <div className="basis-2/12 text-[13px] font-semibold text-[#1A56DB]">
                {s.aiRecommendedQuota}
              </div>
              <div className="basis-3/12 pr-5">
                <ProgressBar width={s.percentRemaining} showText />
              </div>
              <div className="basis-2/12 text-center">
                <StatusChip label={s.status} bg={s.statusBg} color={s.statusColor} />
              </div>
              <div className="basis-2/12 text-right">
                <button
                  type="button"
                  onClick={() => onAdjustQuota(s)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE6F5] bg-white hover:bg-[#F6F9FE] text-[#1A56DB] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Sesuaikan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
