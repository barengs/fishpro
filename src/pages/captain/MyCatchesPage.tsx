import { useCallback, useEffect, useState } from 'react'
import { PageToolbar } from '../../components/PageToolbar'
import { DataTable, type Column } from '../../components/DataTable'
import { CrudModal } from '../../components/CrudModal'
import { useCrudModal } from '../../components/useCrudModal'
import { StatusChip } from '../../components/StatusChip'
import { CatchReportWizard } from '../../components/CatchReportWizard'
import type { CatchReportFormData } from '../../components/catchReportTypes'
import { catchesService, type FishCatch } from '../../services/catches'
import { shipsService, type Ship } from '../../services/ships'
import { authService } from '../../services/auth'
import { fishSpeciesService, type FishSpecies } from '../../services/fish'

export function MyCatchesPage() {
  const [rows, setRows] = useState<FishCatch[]>([])
  const [ship, setShip] = useState<Ship | null>(null)
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { open, openModal, closeModal } = useCrudModal()

  const currentUser = authService.getStoredUser()
  const captainId = currentUser?.id || 1

  const fetchCatches = useCallback(async (query?: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const [shipsData, spData] = await Promise.all([
        shipsService.getByCaptain(captainId).catch(() => []),
        fishSpeciesService.getAll().catch(() => []),
      ])

      setSpeciesList(spData)
      let currentShip = shipsData.length > 0 ? shipsData[0] : null
      if (!currentShip) {
        const all = await shipsService.getAll().catch(() => [])
        currentShip = all.length > 0 ? all[0] : null
      }
      setShip(currentShip)

      if (currentShip) {
        const catchesData = await catchesService.getAll({
          ship_id: currentShip.id,
          search: query,
        })
        setRows(catchesData)
      } else {
        const allCatches = await catchesService.getAll({ search: query })
        setRows(allCatches)
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal memuat riwayat tangkapan')
    } finally {
      setLoading(false)
    }
  }, [captainId])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCatches(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, fetchCatches])

  const handleSubmit = async (data: CatchReportFormData) => {
    const shipReg = ship ? ship.registration_number : 'REG-0412'

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
        ship: shipReg,
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
      setToastMsg(`Laporan tangkapan berhasil dicatat dan disegel ke blockchain!`)
      setTimeout(() => setToastMsg(null), 4000)
      closeModal()
      fetchCatches(search)
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Gagal mengirim laporan tangkapan')
    }
  }

  const cols: Column<FishCatch>[] = [
    {
      key: 'date',
      header: 'Tanggal / Jenis',
      flex: 2,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold tabular-nums">{r.catch_date}</div>
          <div className="text-xs text-soft">
            {r.catch_type === 'pelagic' ? 'Pelagis' : r.catch_type === 'demersal' ? 'Demersal' : 'Terumbu Karang'}
          </div>
        </div>
      ),
    },
    {
      key: 'details',
      header: 'Hasil Tangkapan',
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
      key: 'loc',
      header: 'Koordinat GPS',
      flex: 2,
      render: (r) => (
        <span className="text-xs text-soft font-mono">
          {r.location_latitude}, {r.location_longitude}
        </span>
      ),
    },
    {
      key: 'st',
      header: 'Status',
      flex: 1,
      align: 'center',
      render: () => <StatusChip label="Tercatat" />,
    },
  ]

  return (
    <div className="max-w-360 mx-auto">
      <PageToolbar
        title="Riwayat Tangkapan Kapal"
        desc={`Laporan hasil laut untuk kapal ${ship ? ship.name : 'KM Samudra Jaya'} (${ship ? ship.registration_number : 'REG-0412'}).`}
        searchPlaceholder="Filter tanggal..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Lapor Tangkapan Baru"
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
          emptyText="Belum ada riwayat tangkapan tercatat untuk kapal ini."
        />
      </section>

      <CrudModal
        open={open}
        title="Lapor Tangkapan Baru"
        subtitle={`Laporan langsung diverifikasi dan disegel ke blockchain untuk ${ship ? ship.name : 'kapal Anda'}.`}
        onClose={closeModal}
        hideFooter
      >
        <CatchReportWizard onSubmit={handleSubmit} onCancel={closeModal} />
      </CrudModal>
    </div>
  )
}
