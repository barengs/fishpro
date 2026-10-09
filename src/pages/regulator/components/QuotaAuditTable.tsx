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
    <section className="surface-card border rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="m-0 text-base font-bold text-strong">Audit & Monitoring Kuota Kapal</h2>
          <div className="text-fco-sm text-soft mt-0.5">
            Data perbandingan alokasi kuota vs rekomendasi optimasi AI
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-180">
          <div className="flex items-center py-2.5 text-xs font-semibold text-soft">
            <div className="basis-3/12">Kapal & Pemilik</div>
            <div className="basis-2/12">Alokasi Kuota</div>
            <div className="basis-2/12">Rekomendasi AI</div>
            <div className="basis-3/12">Sisa Kuota</div>
            <div className="basis-2/12 text-center">Status</div>
            <div className="basis-2/12 text-right">Aksi</div>
          </div>

          {ships.map((s) => (
            <div key={s.reg} className="flex items-center py-4 border-t border-fco-border-subtle">
              <div className="basis-3/12">
                <div className="text-sm font-semibold text-strong">{s.name}</div>
                <div className="text-xs text-soft">
                  {s.reg} · {s.owner}
                </div>
              </div>
              <div className="basis-2/12 text-fco-sm font-semibold text-strong">{s.allocatedQuota}</div>
              <div className="basis-2/12 text-fco-sm font-semibold text-fco-blue">
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
                  className="px-3 py-1.5 rounded-lg border border-fco-border bg-white hover:surface-page text-fco-blue text-xs font-semibold cursor-pointer transition-colors"
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
