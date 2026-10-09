import { PageHeader } from '../../components/PageHeader'
import { DataTable, type Column } from '../../components/DataTable'
import { StatusChip } from '../../components/StatusChip'

// BlockchainBlock: index (PK), timestamp, data, previous_hash, hash (unique), nonce
// FishCatchTransaction: fish_catch (FK), block (FK), ship_registration_number, fishing_area_code,
// fish_species_code, fish_name, quantity, unit, catch_date, tarif_index, pnkp, pnbp, quota (FK nullable)
interface BlockRow { index: number; hash: string; prev: string; tx: number; time: string }
interface TxRow { id: number; ship: string; fish: string; qty: string; pnbp: string; block: string }

const blocks: BlockRow[] = [
  { index: 2316, hash: 'a3f9…c21e', prev: '9d11…04ab', tx: 6, time: '09 Okt 13:58' },
  { index: 2317, hash: '7be0…19d4', prev: 'a3f9…c21e', tx: 4, time: '09 Okt 14:00' },
  { index: 2318, hash: 'c04d…88a7', prev: '7be0…19d4', tx: 7, time: '09 Okt 14:02' }
]
const txs: TxRow[] = [
  { id: 1, ship: 'REG-0412', fish: 'Tongkol', qty: '120 kg', pnbp: 'Rp 120.000', block: '#2318' },
  { id: 2, ship: 'REG-0087', fish: 'Kerapu', qty: '85 kg', pnbp: 'Rp 212.500', block: '#2318' },
  { id: 3, ship: 'REG-0233', fish: 'Cakalang', qty: '95 kg', pnbp: 'Rp 106.875', block: '#2317' }
]

export function BlockchainPage() {
  const blockCols: Column<BlockRow>[] = [
    { key: 'ix', header: 'Blok', flex: 1, render: (r) => <span className="text-sm font-bold tabular-nums">#{r.index}</span> },
    { key: 'hash', header: 'Hash', flex: 2, render: (r) => <span className="text-sm tabular-nums">{r.hash}</span> },
    { key: 'prev', header: 'Prev Hash', flex: 2, render: (r) => <span className="text-sm tabular-nums text-fco-muted">{r.prev}</span> },
    { key: 'tx', header: 'TX', flex: 1, align: 'center', render: (r) => <span className="text-sm tabular-nums">{r.tx}</span> },
    { key: 'time', header: 'Waktu', flex: 2, align: 'right', render: (r) => <span className="text-sm">{r.time}</span> }
  ]
  const txCols: Column<TxRow>[] = [
    { key: 'ship', header: 'Kapal / Blok', flex: 2, render: (r) => (<div><div className="text-sm font-semibold tabular-nums">{r.ship}</div><div className="text-xs text-fco-muted">{r.block}</div></div>) },
    { key: 'fish', header: 'Ikan', flex: 2, render: (r) => <span className="text-sm">{r.fish}</span> },
    { key: 'qty', header: 'Jumlah', flex: 1, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.qty}</span> },
    { key: 'pnbp', header: 'PNBP', flex: 2, align: 'right', render: (r) => <span className="text-sm tabular-nums">{r.pnbp}</span> },
    { key: 'st', header: 'Status', flex: 1, align: 'center', render: () => <StatusChip label="Terverifikasi" /> }
  ]

  return (
    <div>
      <PageHeader title="Blockchain" desc="Read-only: BlockchainBlock (index, hash, previous_hash, nonce) + FishCatchTransaction (ship, WPP, spesies, qty, PNBP, kuota). Penulisan otomatis via signal BE." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Blok terbaru</h2>
          <DataTable columns={blockCols} rows={blocks} rowKey={(r) => String(r.index)} />
        </section>
        <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
          <h2 className="m-0 mb-4 text-base font-bold">Transaksi tangkapan</h2>
          <DataTable columns={txCols} rows={txs} rowKey={(r) => String(r.id)} />
        </section>
      </div>
    </div>
  )
}
