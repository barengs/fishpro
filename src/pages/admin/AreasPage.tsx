import { useEffect, useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'
import {
  regionsService,
  type CreateFishingAreaPayload,
  type FishingArea,
} from '../../services/regions'
import { Download, FileUp, Loader2 } from 'lucide-react'

const emptyForm: CreateFishingAreaPayload = { nama: '', code: '', deskripsi: '' }

export function AreasPage() {
  const [rows, setRows] = useState<FishingArea[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [f, setF] = useState<CreateFishingAreaPayload>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Modals
  const areaModal = useCrudModal()
  const importModal = useCrudModal()
  const [csvText, setCsvText] = useState('')
  const [clearExisting, setClearExisting] = useState(false)
  const [importing, setImporting] = useState(false)

  const fetchAreas = async (query?: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await regionsService.getAll(query)
      setRows(data)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memuat data WPP')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAreas(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleOpenAdd = () => {
    setEditingId(null)
    setF(emptyForm)
    areaModal.openModal()
  }

  const handleOpenEdit = (area: FishingArea) => {
    setEditingId(area.id)
    setF({
      nama: area.nama,
      code: area.code,
      deskripsi: area.deskripsi || '',
    })
    areaModal.openModal()
  }

  const handleDelete = async (id: number, nama: string) => {
    if (!window.confirm(`Yakin ingin menghapus wilayah "${nama}"?`)) return
    try {
      await regionsService.delete(id)
      setToastMsg(`Wilayah "${nama}" berhasil dihapus.`)
      setTimeout(() => setToastMsg(null), 3000)
      fetchAreas(search)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus wilayah')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!f.nama.trim() || !f.code.trim()) return
    setSubmitting(true)
    setErrorMsg(null)
    try {
      if (editingId) {
        await regionsService.update(editingId, f)
        setToastMsg(`Wilayah "${f.nama}" berhasil diperbarui.`)
      } else {
        await regionsService.create(f)
        setToastMsg(`Wilayah baru "${f.nama}" berhasil ditambahkan.`)
      }
      setTimeout(() => setToastMsg(null), 3000)
      areaModal.closeModal()
      fetchAreas(search)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menyimpan wilayah')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCsvImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!csvText.trim()) return
    setImporting(true)
    setErrorMsg(null)
    try {
      const res = await regionsService.importAreas(csvText, clearExisting)
      setToastMsg(
        `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`
      )
      setTimeout(() => setToastMsg(null), 4000)
      importModal.closeModal()
      setCsvText('')
      fetchAreas(search)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal mengimpor data CSV wilayah')
    } finally {
      setImporting(false)
    }
  }

  const cols: Column<FishingArea>[] = [
    {
      key: 'nama',
      header: 'Nama Wilayah / Kode',
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.nama}</div>
          <div className="text-xs text-fco-blue font-mono font-medium">{r.code}</div>
        </div>
      ),
    },
    {
      key: 'desc',
      header: 'Deskripsi Cakupan',
      flex: 4,
      render: (r) => <span className="text-sm text-soft">{r.deskripsi || '—'}</span>,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      flex: 1,
      align: 'right',
      render: (r) => (
        <CrudActions
          onEdit={() => handleOpenEdit(r)}
          onDelete={() => handleDelete(r.id, r.nama)}
        />
      ),
    },
  ]

  return (
    <div>
      <PageToolbar
        title="Wilayah Pengelolaan Perikanan (WPP)"
        desc="Daftar resmi Wilayah Pengelolaan Perikanan Negara Republik Indonesia (WPPNRI)."
        searchPlaceholder="Cari WPP..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah Wilayah"
        onAdd={handleOpenAdd}
      />

      {/* CSV Actions */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        <a
          href={regionsService.getDownloadTemplateUrl('csv')}
          download
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors no-underline text-strong shadow-2xs"
        >
          <Download size={14} className="text-fco-blue" aria-hidden="true" />
          <span>Unduh Template CSV WPP</span>
        </a>
        <a
          href={regionsService.getDownloadTemplateUrl('excel')}
          download
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors no-underline text-strong shadow-2xs"
        >
          <Download size={14} className="text-emerald-600" aria-hidden="true" />
          <span>Unduh Template Excel WPP</span>
        </a>
        <button
          type="button"
          onClick={importModal.openModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors cursor-pointer text-strong shadow-2xs"
        >
          <FileUp size={14} className="text-emerald-600" aria-hidden="true" />
          <span>Impor WPP dari CSV</span>
        </button>
      </div>

      {toastMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5 border border-emerald-200 dark:border-emerald-500/20">
          ✓ {toastMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada wilayah penangkapan terdaftar di server."
        />
      </section>

      {/* Modal 1: Area CRUD */}
      <CrudModal
        open={areaModal.open}
        title={editingId ? 'Ubah Wilayah Penangkapan' : 'Tambah Wilayah (WPP)'}
        subtitle="Daftarkan wilayah WPPNRI dengan kode unik (contoh: WPP 571 - WPP 718)."
        onClose={areaModal.closeModal}
        onSubmit={handleSubmit}
        submitLabel={submitting ? 'Menyimpan...' : editingId ? 'Perbarui Wilayah' : 'Simpan Wilayah'}
      >
        <FormField label="Nama wilayah" htmlFor="ar-nama" required>
          <input
            id="ar-nama"
            required
            disabled={submitting}
            value={f.nama}
            onChange={(e) => setF({ ...f, nama: e.target.value })}
            placeholder="Contoh: Laut Jawa"
            className={inputCls}
          />
        </FormField>
        <FormField label="Kode wilayah (unik)" htmlFor="ar-code" required hint="Format: WPP 571 – WPP 718">
          <input
            id="ar-code"
            required
            disabled={submitting}
            value={f.code}
            onChange={(e) => setF({ ...f, code: e.target.value })}
            placeholder="WPP 712"
            className={inputCls}
          />
        </FormField>
        <FormField label="Deskripsi cakupan perairan" htmlFor="ar-desc">
          <textarea
            id="ar-desc"
            rows={3}
            disabled={submitting}
            value={f.deskripsi || ''}
            onChange={(e) => setF({ ...f, deskripsi: e.target.value })}
            placeholder="Cakupan selat, teluk, atau zona penangkapan ikan..."
            className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>
      </CrudModal>

      {/* Modal 2: CSV Import */}
      <CrudModal
        open={importModal.open}
        title="Impor Wilayah (WPP) dari CSV"
        subtitle="Kirim data CSV teks sesuai format resmi: nama,code,deskripsi"
        onClose={importModal.closeModal}
        onSubmit={handleCsvImportSubmit}
        submitLabel={importing ? 'Mengimpor...' : 'Mulai Impor CSV'}
      >
        <FormField label="Konten CSV (Header: nama,code,deskripsi)" htmlFor="csv-area" required>
          <textarea
            id="csv-area"
            rows={6}
            required
            disabled={importing}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={"nama,code,deskripsi\nSelat Malaka,WPP 571,Wilayah barat Sumatera\nLaut Jawa,WPP 712,Perairan dangkal produktif"}
            className="w-full border rounded-xl p-3 text-xs font-mono field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>
        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-xs text-soft cursor-pointer">
            <input
              type="checkbox"
              disabled={importing}
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="rounded text-fco-blue accent-[#1A56DB]"
            />
            <span>Hapus data lama sebelum mengimpor (clear_existing)</span>
          </label>
        </div>
        {importing && (
          <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-2">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Memproses baris CSV wilayah di backend...</span>
          </div>
        )}
      </CrudModal>
    </div>
  )
}
