import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'

// FishCatch: ship (FK), catch_date, catch_type (pelagic/demersal/reef), location_latitude, location_longitude, description
// CatchDetail: fish_catch (FK), fish_species (FK), wpp (FK nullable), quantity, unit, value, tarif_index, pnkp, pnbp, notes
interface CatchRow { id: number; ship: string; catch_date: string; catch_type: string; species: string; quantity: string; wpp: string; pnbp: string }

const initial: CatchRow[] = [
  { id: 1, ship: 'KM Samudra Jaya', catch_date: '2026-10-08', catch_type: 'pelagic', species: 'Tongkol', quantity: '120 kg', wpp: 'WPP 573', pnbp: 'Rp 120.000' },
  { id: 2, ship: 'KM Bahari Satu', catch_date: '2026-10-06', catch_type: 'demersal', species: 'Kerapu', quantity: '85 kg', wpp: 'WPP 712', pnbp: 'Rp 212.500' }
]
const emptyForm = { ship: '', catch_date: '2026-10-09', catch_type: 'pelagic', location_latitude: '-8.740000', location_longitude: '115.200000', description: '', fish_species: '', wpp: '', quantity: '', unit: 'kg', value: '', notes: '' }

export function CatchesPage() {
  const [rows, setRows] = useState(initial)
  const [f, setF] = useState(emptyForm)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.ship || !f.fish_species || !f.quantity) return
    setRows((p) => [{ id: Date.now(), ship: f.ship, catch_date: f.catch_date, catch_type: f.catch_type, species: f.fish_species, quantity: `${f.quantity} ${f.unit}`, wpp: f.wpp || '-', pnbp: 'Dihitung BE' }, ...p])
    setF(emptyForm)
    closeModal()
  }

  return (
    <div>
      <PageToolbar title="Laporan Tangkapan" desc="FishCatch + CatchDetail — PNBP dihitung otomatis backend." searchPlaceholder="Filter kapal / tanggal" addLabel="Buat laporan" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Buat laporan tangkapan" subtitle="FishCatch (kapal, tanggal, jenis, koordinat) + CatchDetail (spesies, WPP, jumlah, nilai)." onClose={closeModal} onSubmit={handleSubmit} submitLabel="Kirim laporan" wide>
        <FormField label="Kapal (ship)" htmlFor="ct-ship"><input id="ct-ship" required value={f.ship} onChange={(e) => setF({ ...f, ship: e.target.value })} placeholder="KM ..." className={inputCls} /></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tanggal penangkapan" htmlFor="ct-date"><input id="ct-date" type="date" required value={f.catch_date} onChange={(e) => setF({ ...f, catch_date: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Jenis penangkapan" htmlFor="ct-type"><select id="ct-type" value={f.catch_type} onChange={(e) => setF({ ...f, catch_type: e.target.value })} className={inputCls}><option value="pelagic">Pelagis</option><option value="demersal">Demersal</option><option value="reef">Terumbu Karang</option></select></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Latitude" htmlFor="ct-lat"><input id="ct-lat" value={f.location_latitude} onChange={(e) => setF({ ...f, location_latitude: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Longitude" htmlFor="ct-lng"><input id="ct-lng" value={f.location_longitude} onChange={(e) => setF({ ...f, location_longitude: e.target.value })} className={inputCls} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Spesies" htmlFor="ct-sp"><input id="ct-sp" required value={f.fish_species} onChange={(e) => setF({ ...f, fish_species: e.target.value })} placeholder="Tongkol" className={inputCls} /></FormField>
          <FormField label="WPP" htmlFor="ct-wpp"><input id="ct-wpp" value={f.wpp} onChange={(e) => setF({ ...f, wpp: e.target.value })} placeholder="WPP 573" className={inputCls} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Jumlah" htmlFor="ct-qty"><input id="ct-qty" type="number" step="0.01" required value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Satuan" htmlFor="ct-unit"><select id="ct-unit" value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} className={inputCls}><option value="kg">kg</option><option value="ton">ton</option></select></FormField>
          <FormField label="Nilai (Rp)" htmlFor="ct-val"><input id="ct-val" type="number" step="0.01" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} className={inputCls} /></FormField>
        </div>
        <FormField label="Deskripsi / Catatan" htmlFor="ct-desc"><textarea id="ct-desc" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue" /></FormField>
      </CrudModal>
    </div>
  )
}
