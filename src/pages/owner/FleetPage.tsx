import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { ProgressBar } from '../../components/ProgressBar'

// Owner view: Ship miliknya (name, registration_number, captain FK, gross_tonnage, home_port),
// Captain miliknya (full_name, license_number, years_of_experience), Quota + PNBP per kapal.
interface FleetRow { id: number; name: string; reg: string; captain: string; pct: string }

export function FleetPage() {
  const [rows, setRows] = useState<FleetRow[]>([
    { id: 1, name: 'KM Samudra Jaya', reg: 'REG-0412', captain: 'Budi Hartono', pct: '70%' },
    { id: 2, name: 'KM Bahari Satu', reg: 'REG-0087', captain: 'Agus Salim', pct: '14%' },
    { id: 3, name: 'KM Tirta Mas', reg: 'REG-0450', captain: 'Belum ditunjuk', pct: '81%' }
  ])
  const [f, setF] = useState({ name: '', registration_number: '', captain: '', length: '', width: '', gross_tonnage: '', year_built: '', home_port: '' })

  const cols: Column<FleetRow>[] = [
    { key: 'ship', header: 'Kapal / Registrasi', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.name}</div><div className="text-xs text-soft tabular-nums">{r.reg}</div></div>) },
    { key: 'cap', header: 'Nahkoda', flex: 2, render: (r) => <span className="text-sm">{r.captain}</span> },
    { key: 'q', header: 'Sisa Kuota', flex: 3, render: (r) => <ProgressBar width={r.pct} showText /> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: (r) => r.captain === 'Belum ditunjuk' ? <StatusChip label="Tanpa nahkoda" bg="#EEF1F6" color="#4A5872" /> : <StatusChip label="Aktif" /> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  return (
    <div>
      <PageHeader
        title="Armada Kapal"
        desc="Kapal milik owner: name, registration_number (unik), captain, length, width, gross_tonnage, year_built, home_port, active."
        showSearch
        searchPlaceholder="Cari armada"
        actions={
          <a href="#fl-name" className="inline-flex items-center gap-2 h-10 px-4.5 rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold no-underline transition-colors shadow-xs">
            <Plus size={16} className="text-white" strokeWidth={2.2} aria-hidden="true" />
            Tambah kapal
          </a>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 surface-card border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
        <section className="surface-card border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tambah kapal</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!f.name || !f.registration_number) return; setRows((p) => [...p, { id: Date.now(), name: f.name, reg: f.registration_number, captain: f.captain || 'Belum ditunjuk', pct: '100%' }]) }} className="flex flex-col gap-4">
            <FormField label="Nama kapal" htmlFor="fl-name"><input id="fl-name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Nomor registrasi" htmlFor="fl-reg"><input id="fl-reg" required value={f.registration_number} onChange={(e) => setF({ ...f, registration_number: e.target.value })} placeholder="REG-...." className={inputCls} /></FormField>
            <FormField label="Nahkoda" htmlFor="fl-cap"><input id="fl-cap" value={f.captain} onChange={(e) => setF({ ...f, captain: e.target.value })} className={inputCls} /></FormField>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormField label="Panjang" htmlFor="fl-l"><input id="fl-l" type="number" step="0.01" value={f.length} onChange={(e) => setF({ ...f, length: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Lebar" htmlFor="fl-w"><input id="fl-w" type="number" step="0.01" value={f.width} onChange={(e) => setF({ ...f, width: e.target.value })} className={inputCls} /></FormField>
              <FormField label="GT" htmlFor="fl-gt"><input id="fl-gt" type="number" step="0.01" value={f.gross_tonnage} onChange={(e) => setF({ ...f, gross_tonnage: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Tahun" htmlFor="fl-y"><input id="fl-y" type="number" value={f.year_built} onChange={(e) => setF({ ...f, year_built: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Pelabuhan" htmlFor="fl-h"><input id="fl-h" value={f.home_port} onChange={(e) => setF({ ...f, home_port: e.target.value })} className={inputCls} /></FormField>
            </div>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan kapal</button>
          </form>
        </section>
      </div>
    </div>
  )
}
