import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'

// Captain: full_name, license_number (unique), owner (FK), date_of_birth, contact_info, email, phone, address, years_of_experience
interface CaptainRow { id: number; full_name: string; license_number: string; owner_name: string; years_of_experience: string }
const initialCaptains: CaptainRow[] = [
  { id: 1, full_name: 'Budi Hartono', license_number: 'SKN-2019-00412', owner_name: 'PT Laut Nusantara', years_of_experience: '7' },
  { id: 2, full_name: 'Agus Salim', license_number: 'SKN-2020-00087', owner_name: 'PT Samudra Biru', years_of_experience: '5' }
]
const emptyCaptain = { full_name: '', license_number: '', owner: '', date_of_birth: '', contact_info: '', email: '', phone: '', address: '', years_of_experience: '' }

export function CaptainsTab() {
  const [rows, setRows] = useState(initialCaptains)
  const [form, setForm] = useState(emptyCaptain)
  const { open, openModal, closeModal } = useCrudModal()

  const cols: Column<CaptainRow>[] = [
    { key: 'name', header: 'Nahkoda / Lisensi', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.full_name}</div><div className="text-xs text-soft tabular-nums">{r.license_number}</div></div>) },
    { key: 'owner', header: 'Pemilik', flex: 2, render: (r) => <span className="text-sm">{r.owner_name}</span> },
    { key: 'exp', header: 'Pengalaman', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.years_of_experience} th</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.license_number) return
    setRows((p) => [...p, { id: Date.now(), full_name: form.full_name, license_number: form.license_number, owner_name: form.owner || '-', years_of_experience: form.years_of_experience || '-' }])
    setForm(emptyCaptain)
    closeModal()
  }

  return (
    <div>
      <PageToolbar title="Nahkoda" desc="Captain: license_number unik, owner FK, date_of_birth, contact_info, email, phone, address, years_of_experience." searchPlaceholder="Cari nahkoda" addLabel="Tambah nahkoda" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Tambah nahkoda" subtitle="Daftarkan nahkoda dengan nomor lisensi unik." onClose={closeModal} onSubmit={handleSubmit} submitLabel="Simpan nahkoda">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nama nahkoda" htmlFor="c-name"><input id="c-name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Nomor lisensi (unik)" htmlFor="c-lic"><input id="c-lic" required value={form.license_number} onChange={(e) => setForm({ ...form, license_number: e.target.value })} placeholder="SKN-...." className={inputCls} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Pemilik (owner)" htmlFor="c-owner"><input id="c-owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Tanggal lahir" htmlFor="c-dob"><input id="c-dob" type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className={inputCls} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Email" htmlFor="c-email"><input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Telepon" htmlFor="c-phone"><input id="c-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Kontak tambahan" htmlFor="c-contact"><input id="c-contact" value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Tahun pengalaman" htmlFor="c-exp"><input id="c-exp" type="number" value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: e.target.value })} className={inputCls} /></FormField>
        </div>
        <FormField label="Alamat" htmlFor="c-addr"><textarea id="c-addr" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue" /></FormField>
      </CrudModal>
    </div>
  )
}
