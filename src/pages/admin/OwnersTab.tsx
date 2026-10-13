import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'

// Owner: full_name, owner_type (individual/company), contact_info, email, phone, address
interface OwnerRow { id: number; full_name: string; owner_type: string; email: string; phone: string }
const initialOwners: OwnerRow[] = [
  { id: 1, full_name: 'PT Laut Nusantara', owner_type: 'company', email: 'ops@lautnusantara.id', phone: '0215550101' },
  { id: 2, full_name: 'H. Mahmud Siregar', owner_type: 'individual', email: 'mahmud@mail.id', phone: '081212340001' }
]
const emptyOwner = { full_name: '', owner_type: 'individual', contact_info: '', email: '', phone: '', address: '' }

export function OwnersTab() {
  const [rows, setRows] = useState(initialOwners)
  const [form, setForm] = useState(emptyOwner)
  const { open, openModal, closeModal } = useCrudModal()

  const cols: Column<OwnerRow>[] = [
    { key: 'name', header: 'Nama / Tipe', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.full_name}</div><div className="text-xs text-soft">{r.owner_type === 'company' ? 'Perusahaan' : 'Perorangan'}</div></div>) },
    { key: 'email', header: 'Email', flex: 2, render: (r) => <span className="text-sm">{r.email}</span> },
    { key: 'phone', header: 'Telepon', flex: 2, render: (r) => <span className="text-sm tabular-nums">{r.phone}</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name) return
    setRows((p) => [...p, { id: Date.now(), full_name: form.full_name, owner_type: form.owner_type, email: form.email, phone: form.phone }])
    setForm(emptyOwner)
    closeModal()
  }

  return (
    <div>
      <PageToolbar title="Pemilik" desc="Owner: full_name, owner_type, contact_info, email, phone, address." searchPlaceholder="Cari pemilik" addLabel="Tambah pemilik" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Tambah pemilik" subtitle="Daftarkan pemilik kapal perorangan atau perusahaan." onClose={closeModal} onSubmit={handleSubmit} submitLabel="Simpan pemilik">
        <FormField label="Nama lengkap" htmlFor="o-name" required><input id="o-name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Nama / perusahaan" className={inputCls} /></FormField>
        <FormField label="Tipe pemilik" htmlFor="o-type"><select id="o-type" value={form.owner_type} onChange={(e) => setForm({ ...form, owner_type: e.target.value })} className={inputCls}><option value="individual">Perorangan</option><option value="company">Perusahaan</option></select></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Email" htmlFor="o-email"><input id="o-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Telepon" htmlFor="o-phone"><input id="o-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} /></FormField>
        </div>
        <FormField label="Kontak tambahan" htmlFor="o-contact"><input id="o-contact" value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Alamat" htmlFor="o-addr"><textarea id="o-addr" rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue" /></FormField>
      </CrudModal>
    </div>
  )
}
