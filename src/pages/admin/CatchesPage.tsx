import { useCallback, useEffect, useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudActions, FormField, inputCls } from '../../components/FormField'
import { StatusChip } from '../../components/StatusChip'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'
import { CatchReportWizard } from '../../components/CatchReportWizard'
import type { CatchReportFormData } from '../../components/catchReportTypes'
import { catchesService, type FishCatch } from '../../services/catches'
import { shipsService, type Ship } from '../../services/ships'
import { fishSpeciesService, type FishSpecies } from '../../services/fish'

export function CatchesPage() {
  const [rows, setRows] = useState<FishCatch[]>([])
  const [ships, setShips] = useState<Ship[]>([])
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedShipReg, setSelectedShipReg] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const { open, openModal, closeModal } = useCrudModal()

  const fetchCatches = useCallback(async (query?: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const [catchesData, shipsData, spData] = await Promise.all([
        catchesService.getAll(query ? { search: query } : undefined),
        shipsService.getAll().catch(() => []),
        fishSpeciesService.getAll().catch(() => []),
      ])
      setRows(catchesData)
      setShips(shipsData)
      setSpeciesList(spData)
      if (shipsData.length > 0 && !selectedShipReg) {
        setSelectedShipReg(shipsData[0].registration_number)
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memuat data laporan tangkapan')
    } finally {
      setLoading(false)
    }
  }, [selectedShipReg])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatches(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, fetchCatches])

  const handleDelete = async (id: number, shipName?: string) => {
    if (!window.confirm(`Hapus laporan tangkapan untuk ${shipName || `#${id}`}?`)) return
    try {
      await catchesService.delete(id)
      setToastMsg('Laporan tangkapan berhasil dihapus.')
      setTimeout(() => setToastMsg(null), 3000)
      fetchCatches(search)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus laporan tangkapan')
    }
  }

  const handleSubmit = async (data: CatchReportFormData) => {
    if (!selectedShipReg.trim()) {
      alert('Harap pilih kapal untuk laporan tangkapan ini.')
      return
    }

    try {
      // Find species ID
      let speciesId = Number(data.fish_species)
      if (isNaN(speciesId) || speciesId === 0) {
        const found = speciesList.find(
          (s) => s.name.toLowerCase() === data.fish_species.toLowerCase()
        )
        speciesId = found ? found.id : (speciesList.length > 0 ? speciesList[0].id : 1)
      }

      const payload = {
        ship: selectedShipReg,
        catch_date: data.catch_date,
        catch_type: data.catch_type,
        location_latitude: data.location_latitude,
        location_longitude: data.location_longitude,
        description: data.description || '',
        catch_details: [
          {
            fish_species: speciesId,
            quantity: parseFloat(data.quantity) || 0,
            unit: data.unit || 'kg',
            value: data.value ? parseFloat(data.value) : null,
            notes: data.description || '',
          },
        ],
      }

      await catchesService.createWithDetails(payload)
      setToastMsg(`Laporan tangkapan untuk ${selectedShipReg} berhasil dibuat dan disegel ke blockchain!`)
      setTimeout(() => setToastMsg(null), 4000)
      closeModal()
      fetchCatches(search)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal mengirim laporan tangkapan')
    }
  }

  const cols: Column<FishCatch>[] = [
    {
      key: 'ship',
      header: 'Kapal / Tanggal',
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.ship_name || `Kapal ${r.ship}`}</div>
          <div className="text-xs text-soft tabular-nums">
            {r.catch_date} · {r.catch_type === 'pelagic' ? 'Pelagis' : r.catch_type === 'demersal' ? 'Demersal' : 'Terumbu'}
          </div>
        </div>
      ),
    },
    {
      key: 'loc',
      header: 'Lokasi Koordinat',
      flex: 2,
      render: (r) => (
        <span className="text-xs text-soft font-mono">
          {r.location_latitude}, {r.location_longitude}
        </span>
      ),
    },
    {
      key: 'details',
      header: 'Detail Tangkapan',
      flex: 3,
      render: (r) => {
        const details = r.catch_details || []
        if (details.length === 0) return <span className="text-xs text-soft">—</span>
        return (
          <div className="flex flex-col gap-0.5">
            {details.map((d, i) => (
              <div key={i} className="text-xs">
                <span className="font-semibold text-strong">{d.fish_species_name || `Spesies #${d.fish_species}`}</span>: {d.quantity} {d.unit}
                {d.pnbp && <span className="text-fco-blue font-mono font-medium ml-1.5">(PNBP: Rp {Number(d.pnbp).toLocaleString('id-ID')})</span>}
              </div>
            ))}
          </div>
        )
      },
    },
    {
      key: 'st',
      header: 'Status',
      flex: 1,
      align: 'center',
      render: () => <StatusChip label="Tercatat" />,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      flex: 1,
      align: 'right',
      render: (r) => (
        <CrudActions
          onDelete={() => handleDelete(r.id, r.ship_name)}
        />
      ),
    },
  ]

  return (
    <div>
      <PageToolbar
        title="Laporan Tangkapan Ikan (Fish Catches)"
        desc="Kelola laporan tangkapan kapal nasional terintegrasi API backend & verifikasi blockchain otomatis."
        searchPlaceholder="Filter kapal / tanggal..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Buat Laporan Baru"
        onAdd={openModal}
      />

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
          emptyText="Belum ada data laporan penangkapan ikan di server."
        />
      </section>

      <CrudModal
        open={open}
        title="Buat Laporan Tangkapan Ikan"
        subtitle="FishCatch (kapal, tanggal, lokasi GPS) + CatchDetail (spesies, volume, WPP)."
        onClose={closeModal}
        hideFooter
      >
        <div className="mb-4">
          <FormField label="Pilih Kapal Terdaftar (Ship)" htmlFor="ct-ship" required>
            {ships.length > 0 ? (
              <select
                id="ct-ship"
                value={selectedShipReg}
                onChange={(e) => setSelectedShipReg(e.target.value)}
                className={inputCls}
              >
                {ships.map((s) => (
                  <option key={s.id} value={s.registration_number}>
                    {s.name} ({s.registration_number}) · {s.gross_tonnage || 0} GT
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="ct-ship"
                value={selectedShipReg}
                onChange={(e) => setSelectedShipReg(e.target.value)}
                placeholder="Contoh: REG-0412"
                className={inputCls}
              />
            )}
          </FormField>
        </div>
        <CatchReportWizard onSubmit={handleSubmit} onCancel={closeModal} />
      </CrudModal>
    </div>
  )
}
