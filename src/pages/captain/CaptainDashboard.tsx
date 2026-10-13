import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Plus } from 'lucide-react'
import { KpiCard } from '../../components/KpiCard'
import { StatusChip } from '../../components/StatusChip'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'
import { CatchReportWizard } from '../../components/CatchReportWizard'
import type { CatchReportFormData } from '../../components/catchReportTypes'
import { QuotaHeroCard } from './components/QuotaHeroCard'
import { ShipSpecsCard } from './components/ShipSpecsCard'
import { RecentCatchesTable, type CatchReport } from './components/RecentCatchesTable'

const initialReports: CatchReport[] = [
  { date: '08 Okt 2026', species: 'Tongkol', qty: '120 kg', pnbp: 'Rp 120.000' },
  { date: '06 Okt 2026', species: 'Cakalang', qty: '95 kg', pnbp: 'Rp 95.000' },
  { date: '03 Okt 2026', species: 'Tuna sirip kuning', qty: '60 kg', pnbp: 'Rp 180.000' },
  { date: '29 Sep 2026', species: 'Tongkol', qty: '140 kg', pnbp: 'Rp 140.000' },
  { date: '25 Sep 2026', species: 'Cakalang', qty: '110 kg', pnbp: 'Rp 110.000' }
]

export function CaptainDashboard() {
  const [reports, setReports] = useState<CatchReport[]>(initialReports)
  const [toast, setToast] = useState<string | null>(null)
  const { open, openModal, closeModal } = useCrudModal()

  const handleReportAdded = (data: CatchReportFormData) => {
    const newReport: CatchReport = {
      date: data.catch_date,
      species: data.fish_species,
      qty: `${data.quantity} ${data.unit}`,
      pnbp: data.value ? `Rp ${Number(data.value).toLocaleString('id-ID')}` : 'Rp 150.000'
    }
    setReports((prev) => [newReport, ...prev])
    setToast(`Laporan ${data.fish_species} (${data.quantity} ${data.unit}) berhasil dicatat & disegel ke blockchain!`)
    setTimeout(() => setToast(null), 4000)
    closeModal()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="m-0 text-3xl font-extrabold tracking-tight">Ringkasan Nahkoda</h1>
          <div className="text-sm text-soft mt-1">KM Samudra Jaya · REG-0412 · Pelabuhan asal Benoa</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 h-10 px-4.5 rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
            Lapor tangkapan
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-3.5 px-4.5 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-semibold mb-5 border border-fco-blue-border">
          ✓ {toast}
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard label="Sisa kuota 2026" value="8.400 kg" delta="70% dari kuota 12.000 kg" />
        <KpiCard label="Tangkapan bulan ini" value="430 kg" delta="5 laporan tercatat" />
        <KpiCard label="PNBP terhitung" value="Rp 535.000" delta="Berdasarkan tarif resmi KKP" />
        <KpiCard label="Status kapal" value="Aktif" delta="42,5 GT · SIPI berlaku s.d. Des 2026" />
      </div>

      {/* Hero Quota & Blockchain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4 items-stretch">
        <div className="lg:col-span-3">
          <QuotaHeroCard remainingKg="8.400 kg" totalKg="12.000 kg" percentage={70} validUntil="31 Des 2026" />
        </div>
        <div className="lg:col-span-2">
          <section className="surface-card border rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="m-0 text-base font-bold text-strong">Status blockchain</h2>
                <StatusChip
                  label="Terverifikasi"
                  bg="#E8F0FE"
                  color="#1A56DB"
                  icon={<Check size={14} className="text-fco-blue" strokeWidth={2.6} aria-hidden="true" />}
                />
              </div>
              <p className="m-0 text-xs text-soft mb-4 leading-relaxed">
                Semua laporan tangkapan KM Samudra Jaya disegel permanen ke buku besar blockchain terdistribusi.
              </p>
              <div className="flex flex-col divide-y divide-fco-border-subtle text-sm">
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Blok terakhir</span>
                  <span className="font-semibold tabular-nums">#2318</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Hash verifikasi</span>
                  <span className="font-semibold tabular-nums text-fco-blue">c04d…88a7</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-soft">Total laporan kapal</span>
                  <span className="font-semibold tabular-nums">48 transaksi</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-fco-border-subtle flex items-center justify-between text-xs text-soft">
              <span>Kepatuhan audit: 100%</span>
              <Link to="/captain/catches" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
                Lihat riwayat →
              </Link>
            </div>
          </section>
        </div>
      </div>

      {/* Recent Catches Table & Ship Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-3">
          <RecentCatchesTable reports={reports} />
        </div>
        <div className="lg:col-span-2">
          <ShipSpecsCard />
        </div>
      </div>

      {/* Modal Lapor Tangkapan (Wizard) */}
      <CrudModal
        open={open}
        title="Lapor tangkapan baru"
        subtitle="3 langkah: waktu & lokasi, hasil, cek."
        onClose={closeModal}
        hideFooter
      >
        <CatchReportWizard onSubmit={handleReportAdded} onCancel={closeModal} />
      </CrudModal>
    </div>
  )
}
