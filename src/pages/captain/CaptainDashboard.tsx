import { useState } from 'react'
import { QuotaHeroCard } from './components/QuotaHeroCard'
import { ShipSpecsCard } from './components/ShipSpecsCard'
import { RecentCatchesTable, type CatchReport } from './components/RecentCatchesTable'
import { CatchReportForm } from './components/CatchReportForm'

export function CaptainDashboard() {
  const [reports, setReports] = useState<CatchReport[]>([
    { date: '08 Okt 2026', species: 'Tongkol', qty: '120 kg', pnbp: 'Rp 120.000' },
    { date: '06 Okt 2026', species: 'Cakalang', qty: '95 kg', pnbp: 'Rp 95.000' },
    { date: '03 Okt 2026', species: 'Tuna sirip kuning', qty: '60 kg', pnbp: 'Rp 180.000' },
    { date: '29 Sep 2026', species: 'Tongkol', qty: '140 kg', pnbp: 'Rp 140.000' },
    { date: '25 Sep 2026', species: 'Cakalang', qty: '110 kg', pnbp: 'Rp 110.000' }
  ])

  const handleReportAdded = () => {
    setReports((prev) => [{ date: '09 Okt 2026', species: 'Tongkol', qty: '150 kg', pnbp: 'Rp 150.000' }, ...prev])
  }

  return (
    <main className="max-w-360 mx-auto p-4 sm:p-7 lg:p-10">
      <div className="mb-7">
        <h1 className="m-0 mb-1.5 text-3xl font-extrabold tracking-tight">Selamat siang, Budi</h1>
        <div className="text-sm text-fco-muted">KM Samudra Jaya · REG-0412 · Pelabuhan asal Benoa</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">
        <div className="lg:col-span-3 flex flex-col gap-4 min-w-0">
          <QuotaHeroCard remainingKg="8.400 kg" totalKg="12.000 kg" percentage={70} validUntil="31 Des 2026" />
          <ShipSpecsCard />
          <RecentCatchesTable reports={reports} />
        </div>
        <div className="lg:col-span-2">
          <CatchReportForm onSuccess={handleReportAdded} />
        </div>
      </div>
    </main>
  )
}
