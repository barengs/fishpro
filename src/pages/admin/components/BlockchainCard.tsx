import { Check } from 'lucide-react'
import { StatusChip } from '../../../components/StatusChip'

const chain = [
  { label: 'Total blok', value: '2.318' },
  { label: 'Transaksi tercatat', value: '14.906' },
  { label: 'Blok terakhir', value: '7be0…19d4' },
  { label: 'Diperbarui', value: '09 Okt, 14:02' }
]

export function BlockchainCard() {
  return (
    <section className="surface-card border rounded-2xl p-6 flex flex-col shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="m-0 text-base font-bold text-strong">Status blockchain</h2>
        <StatusChip
          label="Terverifikasi"
          bg="#E8F0FE"
          color="#1A56DB"
          icon={
            <Check size={14} className="text-fco-blue" strokeWidth={2.6} aria-hidden="true" />
          }
        />
      </div>

      <div className="flex flex-col flex-1">
        {chain.map((c) => (
          <div key={c.label} className="flex items-center justify-between py-3.5 border-t border-fco-border-subtle">
            <span className="text-fco-sm text-soft">{c.label}</span>
            <span className="text-sm font-semibold tabular-nums text-strong">{c.value}</span>
          </div>
        ))}
      </div>

      <a href="#blockchain" className="mt-2 text-sm font-semibold text-fco-blue hover:text-fco-blue-hover">
        Lihat semua blok
      </a>
    </section>
  )
}
