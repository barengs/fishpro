import { StatusChip } from '../../../components/StatusChip'

const chain = [
  { label: 'Total blok', value: '2.318' },
  { label: 'Transaksi tercatat', value: '14.906' },
  { label: 'Blok terakhir', value: '7be0…19d4' },
  { label: 'Diperbarui', value: '09 Okt, 14:02' }
]

export function BlockchainCard() {
  return (
    <section className="bg-white border border-[#DCE6F5] rounded-2xl p-6 flex flex-col shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <h2 className="m-0 text-base font-bold text-[#0F1F3D]">Status blockchain</h2>
        <StatusChip
          label="Terverifikasi"
          bg="#E8F0FE"
          color="#1A56DB"
          icon={
            <svg className="w-3.5 h-3.5 stroke-[#1A56DB]" viewBox="0 0 24 24" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
          }
        />
      </div>

      <div className="flex flex-col flex-1">
        {chain.map((c) => (
          <div key={c.label} className="flex items-center justify-between py-3.5 border-t border-[#EEF3FB]">
            <span className="text-[13px] text-[#5B6B86]">{c.label}</span>
            <span className="text-sm font-semibold tabular-nums text-[#0F1F3D]">{c.value}</span>
          </div>
        ))}
      </div>

      <a href="#blockchain" className="mt-2 text-sm font-semibold text-[#1A56DB] hover:text-[#123FA8]">
        Lihat semua blok
      </a>
    </section>
  )
}
