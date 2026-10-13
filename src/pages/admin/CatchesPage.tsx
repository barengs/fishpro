import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'
import { CatchReportWizard } from '../../components/CatchReportWizard'
import type { CatchReportFormData } from '../../components/catchReportTypes'

// FishCatch: ship (FK), catch_date, catch_type (pelagic/demersal/reef), location_latitude, location_longitude, description
// CatchDetail: fish_catch (FK), fish_species (FK), wpp (FK nullable), quantity, unit, value, tarif_index, pnkp, pnbp, notes
interface CatchRow { id: number; ship: string; catch_date: string; catch_type: string; species: string; quantity: string; wpp: string; pnbp: string }

const initial: CatchRow[] = [
  { id: 1, ship: 'KM Samudra Jaya', catch_date: '2026-10-08', catch_type: 'pelagic', species: 'Tongkol', quantity: '120 kg', wpp: 'WPP 573', pnbp: 'Rp 120.000' },
  { id: 2, ship: 'KM Bahari Satu', catch_date: '2026-10-06', catch_type: 'demersal', species: 'Kerapu', quantity: '85 kg', wpp: 'WPP 712', pnbp: 'Rp 212.500' }
]
export function CatchesPage() {
  const [rows, setRows] = useState(initial)
  const [ship, setShip] = useState('')
  const { open, openModal, closeModal } = useCrudModal()

  const cols: Column<CatchRow>[] = [
    { key: 'ship', header: 'Kapal / Tanggal', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.ship}</div><div className="text-xs text-soft tabular-nums">{r.catch_date} · {r.catch_type}</div></div>) },
    { key: 'sp', header: 'Spesies', flex: 2, render: (r) => <span className="text-sm font-semibold">{r.species}</span> },
    { key: 'qty', header: 'Jumlah', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.quantity}</span> },
    { key: 'wpp', header: 'WPP', flex: 1, render: (r) => <span className="text-sm">{r.wpp}</span> },
    { key: 'pnbp', header: 'PNBP', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.pnbp}</span> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: () => <StatusChip label="Tercatat" /> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  const handleSubmit = (data: CatchReportFormData) => {
    if (!ship.trim()) return
    setRows((p) => [{ id: Date.now(), ship, catch_date: data.catch_date, catch_type: data.catch_type, species: data.fish_species, quantity: `${data.quantity} ${data.unit}`, wpp: data.wpp || '-', pnbp: 'Dihitung BE' }, ...p])
    setShip('')
    closeModal()
  }

  return (
    <div>
      <PageToolbar title="Laporan Tangkapan" desc="FishCatch + CatchDetail — PNBP dihitung otomatis backend." searchPlaceholder="Filter kapal / tanggal" addLabel="Buat laporan" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Buat laporan tangkapan" subtitle="3 langkah: kapal, waktu & lokasi, hasil, cek." onClose={closeModal} hideFooter>
        <div className="mb-4">
          <FormField label="Kapal" htmlFor="ct-ship" required>
            <input id="ct-ship" value={ship} onChange={(e) => setShip(e.target.value)} placeholder="KM ..." className={inputCls} />
          </FormField>
        </div>
        <CatchReportWizard onSubmit={handleSubmit} onCancel={closeModal} />
      </CrudModal>
    </div>
  )
}
