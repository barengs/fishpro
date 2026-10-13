import { BarChart3, Coins, Fish, Ship } from 'lucide-react'
import { KpiCard, type KpiColor } from '../../components/KpiCard'
import { FleetTable } from './components/FleetTable'
import { PnbpPredictionBars } from './components/PnbpPredictionBars'
import { AiAdviceCard } from './components/AiAdviceCard'

const kpis = [
  { label: 'Jumlah kapal', value: '5', note: '1 kapal belum punya nahkoda', color: 'blue' as KpiColor, Icon: Ship },
  { label: 'Tangkapan bulan ini', value: '24,6 ton', note: 'Dari seluruh armada', color: 'emerald' as KpiColor, Icon: Fish },
  { label: 'PNBP bulan ini', value: 'Rp 31,2 jt', note: 'Terhitung otomatis dari laporan', color: 'purple' as KpiColor, Icon: Coins },
  { label: 'Sisa kuota gabungan', value: '49%', note: 'Rata-rata lima kapal', color: 'amber' as KpiColor, Icon: BarChart3 }
]

export function OwnerDashboard() {
  return (
    <div>
      <div className="mb-7">
        <h1 className="m-0 text-3xl font-extrabold tracking-tight">Armada Anda</h1>
        <div className="text-sm text-soft mt-1">Pantau kapal, nahkoda, kuota, dan PNBP dalam satu layar.</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {kpis.map((k) => (
          <KpiCard key={k.label} label={k.label} value={k.value} note={k.note} color={k.color} Icon={k.Icon} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <FleetTable />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4 min-w-0">
          <PnbpPredictionBars />
          <AiAdviceCard />
        </div>
      </div>
    </div>
  )
}
