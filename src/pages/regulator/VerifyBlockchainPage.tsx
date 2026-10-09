import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { StatusChip } from '../../components/StatusChip'

// FishCatchTransaction read-only untuk regulator: ship_registration_number, fishing_area_code,
// fish_species_code, fish_name, quantity, unit, catch_date, tarif_index, pnkp, pnbp, quota, block.
interface Row { id: number; ship: string; area: string; fish: string; qty: string; pnbp: string; block: string; date: string }

const rows: Row[] = [
  { id: 1, ship: 'REG-0412', area: 'WPP 573', fish: 'Tongkol (THN)', qty: '120 kg', pnbp: 'Rp 120.000', block: '#2318', date: '2026-10-08' },
  { id: 2, ship: 'REG-0087', area: 'WPP 712', fish: 'Kerapu (GRP)', qty: '85 kg', pnbp: 'Rp 212.500', block: '#2318', date: '2026-10-06' }
]

export function VerifyBlockchainPage() {
  const cols: Column<Row>[] = [
    { key: 'ship', header: 'Kapal / Blok', flex: 2, render: (r) => (<div><div className="text-sm font-semibold tabular-nums">{r.ship}</div><div className="text-xs text-fco-muted">{r.block} · {r.date}</div></div>) },
    { key: 'area', header: 'WPP', flex: 1, render: (r) => <span className="text-sm">{r.area}</span> },
    { key: 'fish', header: 'Spesies', flex: 2, render: (r) => <span className="text-sm">{r.fish}</span> },
    { key: 'qty', header: 'Jumlah', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.qty}</span> },
    { key: 'pnbp', header: 'PNBP', flex: 2, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.pnbp}</span> },
    { key: 'st', header: 'Hash', flex: 1, align: 'center', render: () => <StatusChip label="Valid" /> }
  ]
  return (
    <div>
      <PageHeader title="Verifikasi Blockchain" desc="FishCatchTransaction: ship_registration_number, fishing_area_code, fish_species_code, quantity, catch_date, tarif_index, pnkp, pnbp, quota FK, block FK." showSearch searchPlaceholder="Cari hash / registrasi" />
      <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
        <DataTable columns={cols} rows={rows} rowKey={(r) => String(r.id)} />
      </section>
    </div>
  )
}
