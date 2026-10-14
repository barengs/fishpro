import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'
import { StatusChip } from '../../components/StatusChip'
import { CatchReportWizard } from '../../components/CatchReportWizard'
import type { CatchReportFormData } from '../../components/catchReportTypes'

// Captain view: FishCatch milik kapalnya (ship FK, catch_date, catch_type, lat, lng, description)
// + CatchDetail (fish_species FK, wpp FK, quantity, unit, value, notes).
interface Row { id: number; date: string; type: string; species: string; qty: string; wpp: string }

export function MyCatchesPage() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, date: '2026-10-08', type: 'pelagic', species: 'Tongkol', qty: '120 kg', wpp: 'WPP 573' },
    { id: 2, date: '2026-10-06', type: 'pelagic', species: 'Cakalang', qty: '95 kg', wpp: 'WPP 573' }
  ])
  const { open, openModal, closeModal } = useCrudModal()

  const cols: Column<Row>[] = [
    { key: 'date', header: 'Tanggal / Jenis', flex: 2, render: (r) => (<div><div className="text-sm font-semibold tabular-nums">{r.date}</div><div className="text-xs text-soft">{r.type}</div></div>) },
    { key: 'sp', header: 'Spesies', flex: 2, render: (r) => <span className="text-sm font-semibold">{r.species}</span> },
    { key: 'qty', header: 'Jumlah', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.qty}</span> },
    { key: 'wpp', header: 'WPP', flex: 1, render: (r) => <span className="text-sm">{r.wpp}</span> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: () => <StatusChip label="Tercatat" /> }
  ]

  const handleSubmit = (data: CatchReportFormData) => {
    setRows((p) => [{ id: Date.now(), date: data.catch_date, type: data.catch_type, species: data.fish_species, qty: `${data.quantity} ${data.unit}`, wpp: data.wpp }, ...p])
    closeModal()
  }

  return (
    <div className="max-w-360 mx-auto">
      <PageToolbar title="Riwayat Tangkapan" desc="FishCatch + CatchDetail kapal Anda." searchPlaceholder="Filter tanggal / spesies" addLabel="Lapor tangkapan" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Lapor tangkapan" subtitle="3 langkah: waktu & lokasi, hasil, cek." onClose={closeModal} hideFooter>
        <CatchReportWizard onSubmit={handleSubmit} onCancel={closeModal} />
      </CrudModal>
    </div>
  )
}
