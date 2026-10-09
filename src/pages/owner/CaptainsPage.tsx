import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'

// Captain milik owner: full_name, license_number (unik), owner FK, date_of_birth,
// contact_info, email, phone, address, years_of_experience + daftar ships yang dioperasikan.
interface Row { id: number; name: string; license: string; exp: string; ship: string }

export function CaptainsPage() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, name: 'Budi Hartono', license: 'SKN-2019-00412', exp: '7 th', ship: 'KM Samudra Jaya' },
    { id: 2, name: 'Agus Salim', license: 'SKN-2020-00087', exp: '5 th', ship: 'KM Bahari Satu' }
  ])
  const [f, setF] = useState({ full_name: '', license_number: '', date_of_birth: '', email: '', phone: '', address: '', years_of_experience: '', contact_info: '' })

  const cols: Column<Row>[] = [
    { key: 'name', header: 'Nahkoda / Lisensi', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.name}</div><div className="text-xs text-fco-muted tabular-nums">{r.license}</div></div>) },
    { key: 'exp', header: 'Pengalaman', flex: 1, align: 'center', render: (r) => <span className="text-sm tabular-nums">{r.exp}</span> },
    { key: 'ship', header: 'Kapal', flex: 2, render: (r) => <span className="text-sm">{r.ship}</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  return (
    <div>
      <PageHeader title="Nahkoda" desc="Captain: full_name, license_number (unik), date_of_birth, contact_info, email, phone, address, years_of_experience." showSearch searchPlaceholder="Cari nahkoda" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <section className="lg:col-span-2 bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tunjuk nahkoda</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!f.full_name || !f.license_number) return; setRows((p) => [...p, { id: Date.now(), name: f.full_name, license: f.license_number, exp: f.years_of_experience ? `${f.years_of_experience} th` : '-', ship: '-' }]) }} className="flex flex-col gap-4">
            <FormField label="Nama nahkoda" htmlFor="cp-name"><input id="cp-name" required value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Nomor lisensi (unik)" htmlFor="cp-lic"><input id="cp-lic" required value={f.license_number} onChange={(e) => setF({ ...f, license_number: e.target.value })} placeholder="SKN-...." className={inputCls} /></FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Tanggal lahir" htmlFor="cp-dob"><input id="cp-dob" type="date" value={f.date_of_birth} onChange={(e) => setF({ ...f, date_of_birth: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Pengalaman (th)" htmlFor="cp-exp"><input id="cp-exp" type="number" value={f.years_of_experience} onChange={(e) => setF({ ...f, years_of_experience: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Email" htmlFor="cp-email"><input id="cp-email" type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Telepon" htmlFor="cp-phone"><input id="cp-phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={inputCls} /></FormField>
            </div>
            <FormField label="Alamat" htmlFor="cp-addr"><textarea id="cp-addr" rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} className="w-full border border-fco-border rounded-xl p-3 text-fco-md focus:outline-none focus:border-fco-blue" /></FormField>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan nahkoda</button>
          </form>
        </section>
      </div>
    </div>
  )
}
