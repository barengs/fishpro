interface QuotaHeroCardProps {
  remainingKg: string;
  totalKg: string;
  usedKg?: string;
  percentage: number;
  validUntil: string;
}

export function QuotaHeroCard({
  remainingKg = "0 kg",
  totalKg = "0 kg",
  usedKg,
  percentage = 0,
  validUntil = "—",
}: Partial<QuotaHeroCardProps>) {
  return (
    <section className="bg-fco-blue text-white rounded-xl p-6 sm:p-7 relative overflow-hidden shadow-xs h-full flex flex-col justify-between">
      {/* Decorative concentric rings */}
      <div className="absolute w-80 h-80 rounded-full border border-white/18 -right-25 -top-30 pointer-events-none" />
      <div className="absolute w-50 h-50 rounded-full border border-white/18 -right-7.5 -top-15 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-fco-mist uppercase tracking-wider">
              Sisa kuota tahun berjalan
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/15 text-white backdrop-blur-xs">
              {percentage}% Tersisa
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 my-3 mb-4">
            <span className="text-3xl sm:text-4xl lg:text-fco-display font-extrabold tracking-tight tabular-nums text-white">
              {remainingKg}
            </span>
            <span className="text-sm sm:text-fco-md text-fco-mist font-medium">
              {totalKg !== "0 kg"
                ? `dari kuota ${totalKg}`
                : "kuota belum dialokasikan"}
            </span>
          </div>

          <div className="h-2.5 rounded-full bg-white/20 overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-white/15 text-xs sm:text-fco-sm text-fco-mist">
          <span>
            {usedKg
              ? `Realisasi: ${usedKg} terpakai`
              : `${percentage}% dari batas aman`}
          </span>
          <span className="font-medium text-white/90">
            {validUntil !== "—"
              ? `Berlaku s.d. ${validUntil}`
              : "Menunggu alokasi resmi"}
          </span>
        </div>
      </div>
    </section>
  );
}
