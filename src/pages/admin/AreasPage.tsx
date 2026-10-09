import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'

// FishingArea: nama, code (unique), deskripsi
interface AreaRow { id: number; nama: string; code: string; deskripsi: string }

export function AreasPage() {
  const [rows, setRows] = useState<AreaRow[]>([
    { id: 1, nama: 'Selat Malaka', code: 'WPP 571', deskripsi: 'Perairan barat Sumatera' },
    { id: 2, nama: 'Samudera Hindia Selatan Jawa–NTT', code: 'WPP 573', deskripsi: 'Jalur pelagis besar' },
    { id: 3, nama: 'Laut Jawa', code: 'WPP 712', deskripsi: 'Perairan dangkal produktif' },
    { id: 4, nama: 'Selat Makassar & Laut Flores', code: 'WPP 713', deskripsi: 'Kawasan timur' }
  ])
  const [f, setF] = useState({ nama: '', code: '', deskripsi: '' })

  const cols: Column<AreaRow>[] = [
    { key: 'nama', header: 'Nama Wilayah / Kode', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.nama}</div><div className="text-xs text-soft tabular-nums">{r.code}</div></div>) },
    { key: 'desc', header: 'Deskripsi', flex: 3, render: (r) => <span className="text-sm text-soft">{r.deskripsi}</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  return (
    <div>
      <PageHeader title="Wilayah (WPP)" desc="FishingArea: nama, code (unik, mis. WPP 573), deskripsi." showSearch searchPlaceholder="Cari WPP" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 surface-card border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
        <section className="surface-card border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tambah wilayah</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!f.nama || !f.code) return; setRows((p) => [...p, { id: Date.now(), ...f }]); setF({ nama: '', code: '', deskripsi: '' }) }} className="flex flex-col gap-4">
            <FormField label="Nama wilayah" htmlFor="ar-nama"><input id="ar-nama" required value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} placeholder="Laut Jawa" className={inputCls} /></FormField>
            <FormField label="Kode wilayah (unik)" htmlFor="ar-code" hint="Format: WPP 571 – WPP 718"><input id="ar-code" required value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="WPP 718" className={inputCls} /></FormField>
            <FormField label="Deskripsi" htmlFor="ar-desc"><textarea id="ar-desc" rows={3} value={f.deskripsi} onChange={(e) => setF({ ...f, deskripsi: e.target.value })} className="w-full border border-fco-border rounded-xl p-3 text-fco-md focus:outline-none focus:border-fco-blue" /></FormField>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan wilayah</button>
          </form>
        </section>
      </div>
    </div>
  )
}
