import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'

// ShipSerializer: id, name, registration_number, owner, owner_name, captain, captain_name,
// length, width, gross_tonnage, year_built, home_port, active + current_year_quota
interface ShipRow {
  id: number
  name: string
  registration_number: string
  owner_name: string
  captain_name: string
  gross_tonnage: string
  home_port: string
  active: boolean
}

const initialRows: ShipRow[] = [
  { id: 1, name: 'KM Samudra Jaya', registration_number: 'REG-0412', owner_name: 'PT Laut Nusantara', captain_name: 'Budi Hartono', gross_tonnage: '42,5', home_port: 'Benoa', active: true },
  { id: 2, name: 'KM Bahari Satu', registration_number: 'REG-0087', owner_name: 'PT Samudra Biru', captain_name: 'Agus Salim', gross_tonnage: '68,0', home_port: 'Muara Baru', active: true },
  { id: 3, name: 'KM Mutiara Laut', registration_number: 'REG-0233', owner_name: 'PT Mina Perkasa', captain_name: 'Dewa Putu', gross_tonnage: '55,2', home_port: 'Bitung', active: true }
]
const emptyForm = { name: '', registration_number: '', owner: '', captain: '', length: '', width: '', gross_tonnage: '', year_built: '', home_port: '', active: true }

export function ShipsPage() {
  const [rows, setRows] = useState(initialRows)
  const [form, setForm] = useState(emptyForm)
  const { open, openModal, closeModal } = useCrudModal()

  const columns: Column<ShipRow>[] = [
    { key: 'name', header: 'Nama / Registrasi', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.name}</div><div className="text-xs text-soft tabular-nums">{r.registration_number}</div></div>) },
    { key: 'owner', header: 'Pemilik', flex: 2, render: (r) => <span className="text-sm">{r.owner_name}</span> },
    { key: 'captain', header: 'Nahkoda', flex: 2, render: (r) => <span className="text-sm">{r.captain_name}</span> },
    { key: 'gt', header: 'GT', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.gross_tonnage}</span> },
    { key: 'status', header: 'Status', flex: 1, align: 'center', render: (r) => r.active ? <StatusChip label="Aktif" /> : <StatusChip label="Nonaktif" bg="#EEF1F6" color="#4A5872" /> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.registration_number) return
    setRows((p) => [...p, { id: Date.now(), name: form.name, registration_number: form.registration_number, owner_name: form.owner || '-', captain_name: form.captain || '-', gross_tonnage: form.gross_tonnage || '-', home_port: form.home_port, active: form.active }])
    setForm(emptyForm)
    closeModal()
  }

  return (
    <div>
      <PageToolbar title="Kapal" desc="name, registration_number, owner, captain, length, width, gross_tonnage, year_built, home_port, active." searchPlaceholder="Cari nama / nomor registrasi" addLabel="Tambah kapal" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Tambah kapal" subtitle="Daftarkan kapal penangkap ikan baru ke armada nasional." onClose={closeModal} onSubmit={handleSubmit} submitLabel="Simpan kapal" wide>
        <FormField label="Nama kapal" htmlFor="ship-name"><input id="ship-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="KM ..." className={inputCls} /></FormField>
        <FormField label="Nomor registrasi" htmlFor="ship-reg"><input id="ship-reg" required value={form.registration_number} onChange={(e) => setForm({ ...form, registration_number: e.target.value })} placeholder="REG-...." className={inputCls} /></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Pemilik (owner)" htmlFor="ship-owner"><input id="ship-owner" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Nama pemilik" className={inputCls} /></FormField>
          <FormField label="Nahkoda (captain)" htmlFor="ship-captain"><input id="ship-captain" value={form.captain} onChange={(e) => setForm({ ...form, captain: e.target.value })} placeholder="Nama nahkoda" className={inputCls} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FormField label="Panjang (m)" htmlFor="ship-length"><input id="ship-length" type="number" step="0.01" value={form.length} onChange={(e) => setForm({ ...form, length: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Lebar (m)" htmlFor="ship-width"><input id="ship-width" type="number" step="0.01" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} className={inputCls} /></FormField>
          <FormField label="GT" htmlFor="ship-gt"><input id="ship-gt" type="number" step="0.01" value={form.gross_tonnage} onChange={(e) => setForm({ ...form, gross_tonnage: e.target.value })} className={inputCls} /></FormField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Tahun dibuat" htmlFor="ship-year"><input id="ship-year" type="number" value={form.year_built} onChange={(e) => setForm({ ...form, year_built: e.target.value })} className={inputCls} /></FormField>
          <FormField label="Pelabuhan asal" htmlFor="ship-port"><input id="ship-port" value={form.home_port} onChange={(e) => setForm({ ...form, home_port: e.target.value })} placeholder="Benoa" className={inputCls} /></FormField>
        </div>
        <label className="flex items-center gap-2.5 text-sm cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded" /> Kapal aktif</label>
      </CrudModal>
    </div>
  )
}
