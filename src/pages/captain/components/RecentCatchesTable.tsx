import { Check } from 'lucide-react'
import { StatusChip } from '../../../components/StatusChip'

export interface CatchReport {
  date: string
  species: string
  qty: string
  pnbp: string
}

interface RecentCatchesTableProps {
  reports?: CatchReport[]
}

const defaultReports: CatchReport[] = [
  { date: '08 Okt 2026', species: 'Tongkol', qty: '120 kg', pnbp: 'Rp 120.000' },
  { date: '06 Okt 2026', species: 'Cakalang', qty: '95 kg', pnbp: 'Rp 95.000' },
  { date: '03 Okt 2026', species: 'Tuna sirip kuning', qty: '60 kg', pnbp: 'Rp 180.000' },
  { date: '29 Sep 2026', species: 'Tongkol', qty: '140 kg', pnbp: 'Rp 140.000' },
  { date: '25 Sep 2026', species: 'Cakalang', qty: '110 kg', pnbp: 'Rp 110.000' }
]

export function RecentCatchesTable({ reports = defaultReports }: RecentCatchesTableProps) {
  return (
    <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-base font-bold text-fco-dark">Laporan terakhir</h2>
        <a href="#riwayat" className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover">
          Lihat semua
        </a>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-115">
          <div className="flex items-center py-2.5 text-xs font-semibold text-fco-muted">
            <div className="basis-3/12">Tanggal</div>
            <div className="basis-3/12">Spesies</div>
            <div className="basis-2/12 text-right">Jumlah</div>
            <div className="basis-2/12 text-right">PNBP</div>
            <div className="basis-2/12 text-right">Status</div>
          </div>

          {reports.map((r, i) => (
            <div key={i} className="flex items-center py-3.5 border-t border-fco-border-subtle text-sm">
              <div className="basis-3/12 tabular-nums text-fco-dark">{r.date}</div>
              <div className="basis-3/12 font-semibold text-fco-dark">{r.species}</div>
              <div className="basis-2/12 text-right tabular-nums text-fco-dark">{r.qty}</div>
              <div className="basis-2/12 text-right tabular-nums text-fco-dark">{r.pnbp}</div>
              <div className="basis-2/12 text-right">
                <StatusChip
                  label="Tercatat"
                  bg="#E8F0FE"
                  color="#1A56DB"
                  icon={
                    <Check size={13} className="text-fco-blue" strokeWidth={2.6} aria-hidden="true" />
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
