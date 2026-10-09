interface QuotaHeroCardProps {
  remainingKg: string
  totalKg: string
  percentage: number
  validUntil: string
}

export function QuotaHeroCard({
  remainingKg = '8.400 kg',
  totalKg = '12.000 kg',
  percentage = 70,
  validUntil = '31 Des 2026'
}: Partial<QuotaHeroCardProps>) {
  return (
    <section className="bg-fco-blue text-white rounded-fco-lg p-7 relative overflow-hidden shadow-sm">
      {/* Decorative concentric rings */}
      <div className="absolute w-80 h-80 rounded-full border border-white/18 -right-25 -top-30 pointer-events-none" />
      <div className="absolute w-50 h-50 rounded-full border border-white/18 -right-7.5 -top-15 pointer-events-none" />

      <div className="relative z-10">
        <div className="text-sm font-semibold text-fco-mist">Sisa kuota 2026</div>
        <div className="flex items-baseline gap-2 my-2 mb-5">
          <span className="text-fco-display font-extrabold tracking-tight tabular-nums text-white">
            {remainingKg}
          </span>
          <span className="text-fco-md text-fco-mist">dari {totalKg}</span>
        </div>

        <div className="h-2 rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between mt-2.5 text-fco-sm text-fco-mist">
          <span>{percentage}% tersisa</span>
          <span>Berlaku sampai {validUntil}</span>
        </div>
      </div>
    </section>
  )
}
