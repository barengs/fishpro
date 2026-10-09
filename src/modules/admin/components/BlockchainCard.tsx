import { StatusChip } from '../../../components/StatusChip'

const chain = [
  { label: 'Total blok', value: '2.318' },
  { label: 'Transaksi tercatat', value: '14.906' },
  { label: 'Blok terakhir', value: '7be0…19d4' },
  { label: 'Diperbarui', value: '09 Okt, 14:02' }
]

export function BlockchainCard() {
  return (
    <section className="bg-white border border-fco-border rounded-2xl p-6 flex flex-col shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="m-0 text-base font-bold text-fco-dark">Status blockchain</h2>
        <StatusChip
          label="Terverifikasi"
          bg="#E8F0FE"
          color="#1A56DB"
          icon={
            <svg className="w-3.5 h-3.5 stroke-fco-blue" viewBox="0 0 24 24" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
          }
        />
      </div>

      <div className="flex flex-col flex-1">
        {chain.map((c) => (
          <div key={c.label} className="flex items-center justify-between py-3.5 border-t border-fco-border-subtle">
            <span className="text-fco-sm text-fco-muted">{c.label}</span>
            <span className="text-sm font-semibold tabular-nums text-fco-dark">{c.value}</span>
          </div>
        ))}
      </div>

      <a href="#blockchain" className="mt-2 text-sm font-semibold text-fco-blue hover:text-fco-blue-hover">
        Lihat semua blok
      </a>
    </section>
  )
}
