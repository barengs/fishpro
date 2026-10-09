import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { StatusChip } from '../../components/StatusChip'
import { FormField, inputCls } from '../../components/FormField'

// Captain view: FishCatch milik kapalnya (ship FK, catch_date, catch_type, lat, lng, description)
// + CatchDetail (fish_species FK, wpp FK, quantity, unit, value, notes).
interface Row { id: number; date: string; type: string; species: string; qty: string; wpp: string }

export function MyCatchesPage() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, date: '2026-10-08', type: 'pelagic', species: 'Tongkol', qty: '120 kg', wpp: 'WPP 573' },
    { id: 2, date: '2026-10-06', type: 'pelagic', species: 'Cakalang', qty: '95 kg', wpp: 'WPP 573' }
  ])
  const [f, setF] = useState({ catch_date: '2026-10-09', catch_type: 'pelagic', location_latitude: '-8.740000', location_longitude: '115.200000', description: '', fish_species: '', wpp: 'WPP 573', quantity: '', unit: 'kg', value: '', notes: '' })

  const cols: Column<Row>[] = [
    { key: 'date', header: 'Tanggal / Jenis', flex: 2, render: (r) => (<div><div className="text-sm font-semibold tabular-nums">{r.date}</div><div className="text-xs text-soft">{r.type}</div></div>) },
    { key: 'sp', header: 'Spesies', flex: 2, render: (r) => <span className="text-sm font-semibold">{r.species}</span> },
    { key: 'qty', header: 'Jumlah', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.qty}</span> },
    { key: 'wpp', header: 'WPP', flex: 1, render: (r) => <span className="text-sm">{r.wpp}</span> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: () => <StatusChip label="Tercatat" /> }
  ]

  return (
    <div className="max-w-360 mx-auto">
      <PageHeader title="Riwayat Tangkapan" desc="FishCatch + CatchDetail kapal Anda. Filter ship_id & rentang tanggal tersedia di API BE." showSearch searchPlaceholder="Filter tanggal / spesies" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 surface-card border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
        <section className="surface-card border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Lapor cepat</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!f.fish_species || !f.quantity) return; setRows((p) => [{ id: Date.now(), date: f.catch_date, type: f.catch_type, species: f.fish_species, qty: `${f.quantity} ${f.unit}`, wpp: f.wpp }, ...p]) }} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Tanggal" htmlFor="mc-date"><input id="mc-date" type="date" required value={f.catch_date} onChange={(e) => setF({ ...f, catch_date: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Jenis" htmlFor="mc-type"><select id="mc-type" value={f.catch_type} onChange={(e) => setF({ ...f, catch_type: e.target.value })} className={inputCls}><option value="pelagic">Pelagis</option><option value="demersal">Demersal</option><option value="reef">Terumbu</option></select></FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Latitude" htmlFor="mc-lat"><input id="mc-lat" value={f.location_latitude} onChange={(e) => setF({ ...f, location_latitude: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Longitude" htmlFor="mc-lng"><input id="mc-lng" value={f.location_longitude} onChange={(e) => setF({ ...f, location_longitude: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Spesies" htmlFor="mc-sp"><input id="mc-sp" required value={f.fish_species} onChange={(e) => setF({ ...f, fish_species: e.target.value })} className={inputCls} /></FormField>
              <FormField label="WPP" htmlFor="mc-wpp"><input id="mc-wpp" value={f.wpp} onChange={(e) => setF({ ...f, wpp: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Jumlah" htmlFor="mc-q"><input id="mc-q" type="number" step="0.01" required value={f.quantity} onChange={(e) => setF({ ...f, quantity: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Satuan" htmlFor="mc-u"><select id="mc-u" value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} className={inputCls}><option value="kg">kg</option><option value="ton">ton</option></select></FormField>
              <FormField label="Nilai" htmlFor="mc-v"><input id="mc-v" type="number" step="0.01" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} className={inputCls} /></FormField>
            </div>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Kirim</button>
          </form>
        </section>
      </div>
    </div>
  )
}
