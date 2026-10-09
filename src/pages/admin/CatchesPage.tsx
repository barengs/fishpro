import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'

// FishCatch: ship (FK), catch_date, catch_type (pelagic/demersal/reef), location_latitude, location_longitude, description
// CatchDetail: fish_catch (FK), fish_species (FK), wpp (FK nullable), quantity, unit, value, tarif_index, pnkp, pnbp, notes
interface CatchRow { id: number; ship: string; catch_date: string; catch_type: string; species: string; quantity: string; wpp: string; pnbp: string }

const initial: CatchRow[] = [
  { id: 1, ship: 'KM Samudra Jaya', catch_date: '2026-10-08', catch_type: 'pelagic', species: 'Tongkol', quantity: '120 kg', wpp: 'WPP 573', pnbp: 'Rp 120.000' },
  { id: 2, ship: 'KM Bahari Satu', catch_date: '2026-10-06', catch_type: 'demersal', species: 'Kerapu', quantity: '85 kg', wpp: 'WPP 712', pnbp: 'Rp 212.500' }
]

export function CatchesPage() {
  const [rows, setRows] = useState(initial)
  const [f, setF] = useState({ ship: '', catch_date: '2026-10-09', catch_type: 'pelagic', location_latitude: '-8.740000', location_longitude: '115.200000', description: '', fish_species: '', wpp: '', quantity: '', unit: 'kg', value: '', notes: '' })

  const cols: Column<CatchRow>[] = [
    { key: 'ship', header: 'Kapal / Tanggal', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.ship}</div><div className="text-xs text-fco-muted tabular-nums">{r.catch_date} · {r.catch_type}</div></div>) },
    { key: 'sp', header: 'Spesies', flex: 2, render: (r) => <span className="text-sm font-semibold">{r.species}</span> },
    { key: 'qty', header: 'Jumlah', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.quantity}</span> },
    { key: 'wpp', header: 'WPP', flex: 1, render: (r) => <span className="text-sm">{r.wpp}</span> },
    { key: 'pnbp', header: 'PNBP', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.pnbp}</span> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: () => <StatusChip label="Tercatat" /> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  return (
    <div>
      <PageHeader title="Laporan Tangkapan" desc="FishCatch (ship, catch_date, catch_type, lat, lng, description) + CatchDetail (fish_species, wpp, quantity, unit, value, notes) — PNBP dihitung otomatis backend." showSearch searchPlaceholder="Filter ship_id / tanggal" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Buat laporan</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!f.ship || !f.fish_species || !f.quantity) return; setRows((p) => [{ id: Date.now(), ship: f.ship, catch_date: f.catch_date, catch_type: f.catch_type, species: f.fish_species, quantity: `${f.quantity} ${f.unit}`, wpp: f.wpp || '-', pnbp: 'Dihitung BE' }, ...p]) }} className="flex flex-col gap-4">
            <FormField label="Kapal (ship FK)" htmlFor="ct-ship"><input id="ct-ship" required value={f.ship} onChange={(e) => setF({ ...f, ship: e.target.value })} placeholder="KM ..." className={inputCls} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tanggal penangkapan" htmlFor="ct-date"><input id="ct-date" type="date" required value={f.catch_date} onChange={(e) => setF({ ...f, catch_date: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Jenis penangkapan" htmlFor="ct-type"><select id="ct-type" value={f.catch_type} onChange={(e) => setF({ ...f, catch_type: e.target.value })} className={inputCls}><option value="pelagic">Pelagis</option><option value="demersal">Demersal</option><option value="reef">Terumbu Karang</option></select></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Latitude" htmlFor="ct-lat"><input id="ct-lat" value={f.location_latitude} onChange={(e) => setF({ ...f, location_latitude: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Longitude" htmlFor="ct-lng"><input id="ct-lng" value={f.location_longitude} onChange={(e) => setF({ ...f, location_longitude: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Spesies (FK)" htmlFor="ct-sp"><input id="ct-sp" required value={f.fish_species} onChange={(e) => setF({ ...f, fish_species: e.target.value })} placeholder="Tongkol" className={inputCls} /></FormField>
              <FormField label="WPP (FK)" htmlFor="ct-wpp"><input id="ct-wpp" value={f.wpp} onChange={(e) => setF({ ...f, wpp: e.target.value })} placeholder="WPP 573" className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Jumlah" htmlFor="ct-qty"><input id="ct-qty" type="number" step="0.01" required value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Satuan" htmlFor="ct-unit"><select id="ct-unit" value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} className={inputCls}><option value="kg">kg</option><option value="ton">ton</option></select></FormField>
              <FormField label="Nilai (Rp)" htmlFor="ct-val"><input id="ct-val" type="number" step="0.01" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} className={inputCls} /></FormField>
            </div>
            <FormField label="Deskripsi / Catatan" htmlFor="ct-desc"><textarea id="ct-desc" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full border border-fco-border rounded-xl p-3 text-fco-md focus:outline-none focus:border-fco-blue" /></FormField>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Kirim laporan</button>
          </form>
        </section>
      </div>
    </div>
  )
}
