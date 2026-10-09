import { Link } from 'react-router-dom'
import { KpiCard } from '../../components/KpiCard'
import { NotificationBell } from '../../components/NotificationBell'
import { FleetTable } from './components/FleetTable'
import { PnbpPredictionBars } from './components/PnbpPredictionBars'
import { AiAdviceCard } from './components/AiAdviceCard'

const kpis = [
  { label: 'Jumlah kapal', value: '5', note: '1 kapal belum punya nahkoda' },
  { label: 'Tangkapan bulan ini', value: '24,6 ton', note: 'Dari seluruh armada' },
  { label: 'PNBP bulan ini', value: 'Rp 31,2 jt', note: 'Terhitung otomatis dari laporan' },
  { label: 'Sisa kuota gabungan', value: '49%', note: 'Rata-rata lima kapal' }
]

export function OwnerDashboard() {
  return (
    <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="m-0 text-3xl font-extrabold tracking-tight">Armada Anda</h1>
            <div className="text-sm text-fco-muted mt-1">Pantau kapal, nahkoda, kuota, dan PNBP dalam satu layar.</div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell count={1} />
            <Link
              to="/owner/fleet"
              className="inline-flex items-center gap-2 h-10 px-4.5 border-none rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold no-underline cursor-pointer transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Tambah kapal
            </Link>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {kpis.map((k) => (
            <KpiCard key={k.label} label={k.label} value={k.value} note={k.note} />
          ))}
        </div>

        {/* Fleet & Right Column */}
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
