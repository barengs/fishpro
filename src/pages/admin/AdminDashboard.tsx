import { Search } from 'lucide-react'
import { KpiCard } from '../../components/KpiCard'
import { PnbpChart } from './components/PnbpChart'
import { BlockchainCard } from './components/BlockchainCard'
import { CriticalQuotaTable } from './components/CriticalQuotaTable'
import { WppBarChart } from './components/WppBarChart'

const kpis = [
  { label: 'Kapal aktif', value: '1.284', delta: '12 kapal baru bulan ini' },
  { label: 'Laporan bulan ini', value: '3.472', delta: '4,2% dari bulan lalu' },
  { label: 'Total tangkapan', value: '842 ton', delta: '3,1% dari bulan lalu' },
  { label: 'PNBP terhitung', value: 'Rp 4,4 M', delta: '6,8% dari bulan lalu' }
]

export function AdminDashboard() {
  return (
    <div>
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="m-0 text-3xl font-extrabold tracking-tight">Ringkasan nasional</h1>
            <div className="text-sm text-soft mt-1">Tangkapan, PNBP, dan kuota seluruh kapal.</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="text-soft absolute left-3 top-2.5 pointer-events-none" strokeWidth={1.8} aria-hidden="true" />
              <input
                type="search"
                placeholder="Cari kapal atau pemilik"
                className="w-full sm:w-65 h-10 border rounded-fco pl-9.5 pr-3 text-sm field-input focus:outline-none focus:border-fco-blue transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {kpis.map((k) => (
            <KpiCard key={k.label} label={k.label} value={k.value} delta={k.delta} />
          ))}
        </div>

        {/* PNBP Graph & Blockchain Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-2">
            <PnbpChart />
          </div>
          <div>
            <BlockchainCard />
          </div>
        </div>

        {/* Quota & WPP Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
            <CriticalQuotaTable />
          </div>
          <div className="lg:col-span-2">
            <WppBarChart />
          </div>
        </div>
    </div>
  )
}
