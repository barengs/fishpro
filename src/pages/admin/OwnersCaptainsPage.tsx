import { useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'

// Owner: full_name, owner_type (individual/company), contact_info, email, phone, address
// Captain: full_name, license_number (unique), owner (FK), date_of_birth, contact_info, email, phone, address, years_of_experience
interface OwnerRow { id: number; full_name: string; owner_type: string; email: string; phone: string }
interface CaptainRow { id: number; full_name: string; license_number: string; owner_name: string; years_of_experience: string }

export function OwnersCaptainsPage() {
  const [owners, setOwners] = useState<OwnerRow[]>([
    { id: 1, full_name: 'PT Laut Nusantara', owner_type: 'company', email: 'ops@lautnusantara.id', phone: '0215550101' },
    { id: 2, full_name: 'H. Mahmud Siregar', owner_type: 'individual', email: 'mahmud@mail.id', phone: '081212340001' }
  ])
  const [captains, setCaptains] = useState<CaptainRow[]>([
    { id: 1, full_name: 'Budi Hartono', license_number: 'SKN-2019-00412', owner_name: 'PT Laut Nusantara', years_of_experience: '7' },
    { id: 2, full_name: 'Agus Salim', license_number: 'SKN-2020-00087', owner_name: 'PT Samudra Biru', years_of_experience: '5' }
  ])
  const [oForm, setOForm] = useState({ full_name: '', owner_type: 'individual', contact_info: '', email: '', phone: '', address: '' })
  const [cForm, setCForm] = useState({ full_name: '', license_number: '', owner: '', date_of_birth: '', contact_info: '', email: '', phone: '', address: '', years_of_experience: '' })

  const ownerCols: Column<OwnerRow>[] = [
    { key: 'name', header: 'Nama / Tipe', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.full_name}</div><div className="text-xs text-fco-muted">{r.owner_type}</div></div>) },
    { key: 'email', header: 'Email', flex: 2, render: (r) => <span className="text-sm">{r.email}</span> },
    { key: 'phone', header: 'Telepon', flex: 2, render: (r) => <span className="text-sm tabular-nums">{r.phone}</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setOwners((p) => p.filter((x) => x.id !== r.id))} /> }
  ]
  const captainCols: Column<CaptainRow>[] = [
    { key: 'name', header: 'Nahkoda / Lisensi', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.full_name}</div><div className="text-xs text-fco-muted tabular-nums">{r.license_number}</div></div>) },
    { key: 'owner', header: 'Pemilik', flex: 2, render: (r) => <span className="text-sm">{r.owner_name}</span> },
    { key: 'exp', header: 'Pengalaman', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.years_of_experience} th</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setCaptains((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  return (
    <div>
      <PageHeader title="Pemilik & Nahkoda" desc="Owner (full_name, owner_type, contact_info, email, phone, address) & Captain (license_number unique, owner FK, date_of_birth, years_of_experience)." showSearch searchPlaceholder="Cari pemilik / nahkoda" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start mb-4">
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Daftar pemilik</h2>
          <DataTable columns={ownerCols} rows={owners} rowKey={(r) => String(r.id)} />
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Daftar nahkoda</h2>
          <DataTable columns={captainCols} rows={captains} rowKey={(r) => String(r.id)} />
        </section>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tambah pemilik</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!oForm.full_name) return; setOwners((p) => [...p, { id: Date.now(), full_name: oForm.full_name, owner_type: oForm.owner_type, email: oForm.email, phone: oForm.phone }]); setOForm({ full_name: '', owner_type: 'individual', contact_info: '', email: '', phone: '', address: '' }) }} className="flex flex-col gap-4">
            <FormField label="Nama lengkap" htmlFor="o-name"><input id="o-name" required value={oForm.full_name} onChange={(e) => setOForm({ ...oForm, full_name: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Tipe pemilik" htmlFor="o-type"><select id="o-type" value={oForm.owner_type} onChange={(e) => setOForm({ ...oForm, owner_type: e.target.value })} className={inputCls}><option value="individual">Perorangan</option><option value="company">Perusahaan</option></select></FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Email" htmlFor="o-email"><input id="o-email" type="email" value={oForm.email} onChange={(e) => setOForm({ ...oForm, email: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Telepon" htmlFor="o-phone"><input id="o-phone" value={oForm.phone} onChange={(e) => setOForm({ ...oForm, phone: e.target.value })} className={inputCls} /></FormField>
            </div>
            <FormField label="Kontak tambahan" htmlFor="o-contact"><input id="o-contact" value={oForm.contact_info} onChange={(e) => setOForm({ ...oForm, contact_info: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Alamat" htmlFor="o-addr"><textarea id="o-addr" rows={2} value={oForm.address} onChange={(e) => setOForm({ ...oForm, address: e.target.value })} className="w-full border border-fco-border rounded-xl p-3 text-fco-md focus:outline-none focus:border-fco-blue" /></FormField>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan pemilik</button>
          </form>
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Tambah nahkoda</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (!cForm.full_name || !cForm.license_number) return; setCaptains((p) => [...p, { id: Date.now(), full_name: cForm.full_name, license_number: cForm.license_number, owner_name: cForm.owner || '-', years_of_experience: cForm.years_of_experience || '-' }]); setCForm({ full_name: '', license_number: '', owner: '', date_of_birth: '', contact_info: '', email: '', phone: '', address: '', years_of_experience: '' }) }} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Nama nahkoda" htmlFor="c-name"><input id="c-name" required value={cForm.full_name} onChange={(e) => setCForm({ ...cForm, full_name: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Nomor lisensi (unik)" htmlFor="c-lic"><input id="c-lic" required value={cForm.license_number} onChange={(e) => setCForm({ ...cForm, license_number: e.target.value })} placeholder="SKN-...." className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Pemilik (owner FK)" htmlFor="c-owner"><input id="c-owner" value={cForm.owner} onChange={(e) => setCForm({ ...cForm, owner: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Tanggal lahir" htmlFor="c-dob"><input id="c-dob" type="date" value={cForm.date_of_birth} onChange={(e) => setCForm({ ...cForm, date_of_birth: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Email" htmlFor="c-email"><input id="c-email" type="email" value={cForm.email} onChange={(e) => setCForm({ ...cForm, email: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Telepon" htmlFor="c-phone"><input id="c-phone" value={cForm.phone} onChange={(e) => setCForm({ ...cForm, phone: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Kontak tambahan" htmlFor="c-contact"><input id="c-contact" value={cForm.contact_info} onChange={(e) => setCForm({ ...cForm, contact_info: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Tahun pengalaman" htmlFor="c-exp"><input id="c-exp" type="number" value={cForm.years_of_experience} onChange={(e) => setCForm({ ...cForm, years_of_experience: e.target.value })} className={inputCls} /></FormField>
            </div>
            <FormField label="Alamat" htmlFor="c-addr"><textarea id="c-addr" rows={2} value={cForm.address} onChange={(e) => setCForm({ ...cForm, address: e.target.value })} className="w-full border border-fco-border rounded-xl p-3 text-fco-md focus:outline-none focus:border-fco-blue" /></FormField>
            <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold cursor-pointer">Simpan nahkoda</button>
          </form>
        </section>
      </div>
    </div>
  )
}
