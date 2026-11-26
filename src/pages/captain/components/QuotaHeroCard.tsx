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
  // Quota bar color logic per fishpro-style (≥70% warn, ≥90% err)
  // Note: percentage here represents remaining quota
  const usedPercentage = 100 - percentage;
  const barColor =
    usedPercentage >= 90
      ? "var(--err, #b91c1c)"
      : usedPercentage >= 70
        ? "var(--warn, #b45309)"
        : "var(--ac, #2563eb)";

  const tagColor =
    percentage <= 15
      ? "text-red-700 dark:text-red-400 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40"
      : percentage <= 30
        ? "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40"
        : "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40";

  return (
    <section className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-5 sm:p-6 h-full flex flex-col justify-between shadow-subtle">
      <div>
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-medium text-subtext dark:text-slate-400 tracking-tight">
            Sisa kuota tahun berjalan
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${tagColor}`}>
            {percentage}% Tersisa
          </span>
        </div>

        <div className="flex items-baseline gap-2.5 my-3 mb-4">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums text-ink dark:text-white">
            {remainingKg}
          </span>
          <span className="text-sm text-subtext dark:text-slate-400 font-normal">
            {totalKg !== "0 kg"
              ? `dari kuota ${totalKg}`
              : "kuota belum dialokasikan"}
          </span>
        </div>

        {/* Bilah kuota */}
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, Math.max(0, percentage))}%`,
              backgroundColor: barColor,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E7EB] dark:border-slate-800 text-xs text-subtext dark:text-slate-400">
        <span>
          {usedKg
            ? `Realisasi: ${usedKg} terpakai`
            : `${percentage}% dari batas aman`}
        </span>
        <span className="font-medium text-ink dark:text-white">
          {validUntil !== "—"
            ? `Berlaku s.d. ${validUntil}`
            : "Menunggu alokasi resmi"}
        </span>
      </div>
    </section>
  );
}
