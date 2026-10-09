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
    <section className="bg-white border border-[#DCE6F5] rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <h2 className="m-0 text-base font-bold text-[#0F1F3D]">Laporan terakhir</h2>
        <a href="#riwayat" className="text-sm font-semibold text-[#1A56DB] hover:text-[#123FA8]">
          Lihat semua
        </a>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[460px]">
          <div className="flex items-center py-2.5 text-xs font-semibold text-[#5B6B86]">
            <div className="basis-3/12">Tanggal</div>
            <div className="basis-3/12">Spesies</div>
            <div className="basis-2/12 text-right">Jumlah</div>
            <div className="basis-2/12 text-right">PNBP</div>
            <div className="basis-2/12 text-right">Status</div>
          </div>

          {reports.map((r, i) => (
            <div key={i} className="flex items-center py-3.5 border-t border-[#EEF3FB] text-sm">
              <div className="basis-3/12 tabular-nums text-[#0F1F3D]">{r.date}</div>
              <div className="basis-3/12 font-semibold text-[#0F1F3D]">{r.species}</div>
              <div className="basis-2/12 text-right tabular-nums text-[#0F1F3D]">{r.qty}</div>
              <div className="basis-2/12 text-right tabular-nums text-[#0F1F3D]">{r.pnbp}</div>
              <div className="basis-2/12 text-right">
                <StatusChip
                  label="Tercatat"
                  bg="#E8F0FE"
                  color="#1A56DB"
                  icon={
                    <svg className="w-3.5 h-3.5 stroke-[#1A56DB]" viewBox="0 0 24 24" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7" />
                    </svg>
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
