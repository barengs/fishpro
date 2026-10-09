import { useState } from 'react'
import { KpiCard } from '../../components/KpiCard'
import { QuotaAuditTable, type ShipQuotaItem } from './components/QuotaAuditTable'
import { ManualQuotaModal } from './components/ManualQuotaModal'
import { ComplianceOverview } from './components/ComplianceOverview'
import { BlockchainCard } from '../admin/components/BlockchainCard'

const initialShips: ShipQuotaItem[] = [
  { name: 'KM Bahari Satu', reg: 'REG-0087', owner: 'PT Samudra Biru', allocatedQuota: '15.000 kg', usedQuota: '12.900 kg', percentRemaining: '14%', aiRecommendedQuota: '18.500 kg', status: 'Mendekati Batas', statusBg: '#FFF1E0', statusColor: '#B54708' },
  { name: 'KM Cahaya Timur', reg: 'REG-0319', owner: 'CV Bahari Jaya', allocatedQuota: '10.000 kg', usedQuota: '9.100 kg', percentRemaining: '9%', aiRecommendedQuota: '12.000 kg', status: 'Kritis', statusBg: '#FFF1E0', statusColor: '#B54708' },
  { name: 'KM Mutiara Laut', reg: 'REG-0233', owner: 'PT Mina Perkasa', allocatedQuota: '25.000 kg', usedQuota: '19.500 kg', percentRemaining: '22%', aiRecommendedQuota: '24.000 kg', status: 'Waspada', statusBg: '#E8F0FE', statusColor: '#1A56DB' },
  { name: 'KM Samudra Jaya', reg: 'REG-0412', owner: 'PT Laut Nusantara', allocatedQuota: '12.000 kg', usedQuota: '3.600 kg', percentRemaining: '70%', aiRecommendedQuota: '14.000 kg', status: 'Normal', statusBg: '#E8F0FE', statusColor: '#1A56DB' }
]

export function RegulatorDashboard() {
  const [ships, setShips] = useState<ShipQuotaItem[]>(initialShips)
  const [selectedShip, setSelectedShip] = useState<ShipQuotaItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleOpenModal = (ship: ShipQuotaItem) => {
    setSelectedShip(ship)
    setIsModalOpen(true)
  }

  const handleSaveQuota = (data: { shipReg: string; year: number; newQuota: number; reason: string }) => {
    setShips((prev) =>
      prev.map((s) =>
        s.reg === data.shipReg
          ? {
              ...s,
              allocatedQuota: `${data.newQuota.toLocaleString('id-ID')} kg`,
              status: 'Disesuaikan',
              statusBg: '#E8F0FE',
              statusColor: '#1A56DB'
            }
          : s
      )
    )
    setToastMessage(`Kuota kapal ${data.shipReg} berhasil diupdate ke ${data.newQuota.toLocaleString('id-ID')} kg`)
    setTimeout(() => setToastMessage(null), 4000)
  }

  return (
    <div>
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="m-0 text-3xl font-extrabold tracking-tight">Portal Pengawas & Regulator</h1>
            <div className="text-sm text-fco-muted mt-1">
              Verifikasi kepatuhan kuota, audit pelaporan tangkapan, dan instrumen penyesuaian manual kuota KKP.
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedShip(null)
                setIsModalOpen(true)
              }}
              className="inline-flex items-center gap-2 h-10 px-4 border-none rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-sm font-semibold cursor-pointer transition-colors shadow-xs"
            >
              + Override Kuota Manual
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-3.5 px-4.5 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-semibold mb-5 border border-fco-blue-border">
            ✓ {toastMessage}
          </div>
        )}

        {/* Global KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <KpiCard label="Total Kapal Diawasi" value="1.284" note="Aktif izin berlayar (SIPI/SIKPI)" />
          <KpiCard label="Kapal Over-Quota" value="8" delta="Perlu tindakan regulator" trendUp={false} />
          <KpiCard label="Kepatuhan Blockchain" value="100%" note="Seluruh tx tersinkronisasi hash" />
          <KpiCard label="Potensi PNBP Berjalan" value="Rp 4,4 M" delta="+6,8% dari estimasi bulan lalu" />
        </div>

        {/* Audit Table */}
        <div className="mb-5">
          <QuotaAuditTable ships={ships} onAdjustQuota={handleOpenModal} />
        </div>

        {/* Side by side: Compliance + Blockchain */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ComplianceOverview />
          <BlockchainCard />
        </div>

      <ManualQuotaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuota}
        initialShipReg={selectedShip?.reg || ''}
      />
    </div>
  )
}
