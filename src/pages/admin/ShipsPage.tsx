import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'
import { ShipFormWizard } from '../../components/ShipFormWizard'
import type { ShipFormData } from '../../components/shipFormTypes'

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
export function ShipsPage() {
  const [rows, setRows] = useState(initialRows)
  const { open, openModal, closeModal } = useCrudModal()

  const columns: Column<ShipRow>[] = [
    { key: 'name', header: 'Nama / Registrasi', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.name}</div><div className="text-xs text-soft tabular-nums">{r.registration_number}</div></div>) },
    { key: 'owner', header: 'Pemilik', flex: 2, render: (r) => <span className="text-sm">{r.owner_name}</span> },
    { key: 'captain', header: 'Nahkoda', flex: 2, render: (r) => <span className="text-sm">{r.captain_name}</span> },
    { key: 'gt', header: 'GT', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.gross_tonnage}</span> },
    { key: 'status', header: 'Status', flex: 1, align: 'center', render: (r) => r.active ? <StatusChip label="Aktif" /> : <StatusChip label="Nonaktif" bg="#EEF1F6" color="#4A5872" /> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  const handleSubmit = (data: ShipFormData) => {
    setRows((p) => [...p, { id: Date.now(), name: data.name, registration_number: data.registration_number, owner_name: data.owner || '-', captain_name: data.captain || '-', gross_tonnage: data.gross_tonnage || '-', home_port: data.home_port, active: data.active }])
    closeModal()
  }

  return (
    <div>
      <PageToolbar title="Kapal" desc="name, registration_number, owner, captain, length, width, gross_tonnage, year_built, home_port, active." searchPlaceholder="Cari nama / nomor registrasi" addLabel="Tambah kapal" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={columns} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Tambah kapal" subtitle="3 langkah: identitas, spesifikasi, cek." onClose={closeModal} wide hideFooter>
        <ShipFormWizard onSubmit={handleSubmit} />
      </CrudModal>
    </div>
  )
}
