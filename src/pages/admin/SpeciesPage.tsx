import { useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'

// FishSpecies: name (unique), scientific_name, description
// Fish (individu): species (FK), name, weight, notes
// FishPriceReference: fish_species (OneToOne), price_per_kg, effective_date, is_active
interface SpeciesRow { id: number; name: string; scientific_name: string; price: string }

export function SpeciesPage() {
  const [rows, setRows] = useState<SpeciesRow[]>([
    { id: 1, name: 'Tongkol', scientific_name: 'Euthynnus affinis', price: 'Rp 20.000' },
    { id: 2, name: 'Cakalang', scientific_name: 'Katsuwonus pelamis', price: 'Rp 22.500' },
    { id: 3, name: 'Tuna Sirip Kuning', scientific_name: 'Thunnus albacares', price: 'Rp 60.000' }
  ])
  const [f, setF] = useState({ name: '', scientific_name: '', description: '', price_per_kg: '', is_active: true, fish_name: '', weight: '', notes: '' })
  const { open, openModal, closeModal } = useCrudModal()

  const cols: Column<SpeciesRow>[] = [
    { key: 'name', header: 'Nama / Ilmiah', flex: 3, render: (r) => (<div><div className="text-sm font-semibold">{r.name}</div><div className="text-xs text-soft italic">{r.scientific_name}</div></div>) },
    { key: 'price', header: 'Harga Acuan/kg', flex: 2, align: 'right', render: (r) => <span className="text-sm font-semibold tabular-nums">{r.price}</span> },
    { key: 'aksi', header: 'Aksi', flex: 1, align: 'right', render: (r) => <CrudActions onDelete={() => setRows((p) => p.filter((x) => x.id !== r.id))} /> }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.name) return
    setRows((p) => [...p, { id: Date.now(), name: f.name, scientific_name: f.scientific_name || '-', price: f.price_per_kg ? `Rp ${Number(f.price_per_kg).toLocaleString('id-ID')}` : '-' }])
    setF({ name: '', scientific_name: '', description: '', price_per_kg: '', is_active: true, fish_name: '', weight: '', notes: '' })
    closeModal()
  }

  return (
    <div>
      <PageToolbar title="Spesies Ikan" desc="FishSpecies + FishPriceReference + Fish individu." searchPlaceholder="Cari spesies" addLabel="Tambah spesies" onAdd={openModal} />
      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
      <CrudModal open={open} title="Tambah spesies + harga" subtitle="FishSpecies (nama unik, ilmiah) + harga acuan per kg." onClose={closeModal} onSubmit={handleSubmit} submitLabel="Simpan spesies">
        <FormField label="Nama ikan (unik)" htmlFor="sp-name"><input id="sp-name" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inputCls} /></FormField>
        <FormField label="Nama ilmiah" htmlFor="sp-sci"><input id="sp-sci" value={f.scientific_name} onChange={(e) => setF({ ...f, scientific_name: e.target.value })} placeholder="Thunnus ..." className={inputCls} /></FormField>
        <FormField label="Deskripsi" htmlFor="sp-desc"><textarea id="sp-desc" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue" /></FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Harga acuan/kg (Rp)" htmlFor="sp-price"><input id="sp-price" type="number" step="0.01" value={f.price_per_kg} onChange={(e) => setF({ ...f, price_per_kg: e.target.value })} className={inputCls} /></FormField>
          <div className="flex items-end pb-3"><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={f.is_active} onChange={(e) => setF({ ...f, is_active: e.target.checked })} className="rounded" /> Aktif</label></div>
        </div>
        <div className="border-t border-fco-border pt-4">
          <div className="text-sm font-semibold mb-3">Ikan individu (opsional)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField label="Nama individu" htmlFor="sp-fish"><input id="sp-fish" value={f.fish_name} onChange={(e) => setF({ ...f, fish_name: e.target.value })} className={inputCls} /></FormField>
            <FormField label="Berat (kg)" htmlFor="sp-w"><input id="sp-w" type="number" step="0.01" value={f.weight} onChange={(e) => setF({ ...f, weight: e.target.value })} className={inputCls} /></FormField>
          </div>
        </div>
      </CrudModal>
    </div>
  )
}
