interface ComplianceOverviewProps {
  totalShips?: number;
  criticalCount?: number;
  blockchainValid?: boolean;
}

export function ComplianceOverview({
  totalShips = 1284,
  criticalCount = 2,
  blockchainValid = true,
}: ComplianceOverviewProps) {
  const criticalRate =
    totalShips > 0 ? ((criticalCount / totalShips) * 100).toFixed(1) : "2.4";

  const metrics = [
    {
      label: "Kepatuhan Pelaporan WPP",
      rate: "98,2%",
      status: "Sangat Baik",
      color: "#1A56DB",
    },
    {
      label: "Integritas Rantai Blockchain",
      rate: blockchainValid ? "100%" : "Perlu Verifikasi",
      status: blockchainValid ? "Valid Kriptografis" : "Perlu Tindakan",
      color: blockchainValid ? "#1A56DB" : "#B54708",
    },
    {
      label: "Kapal Lampaui Ambang Kuota",
      rate: `${criticalRate}%`,
      status:
        criticalCount > 0
          ? `${criticalCount} kapal kritis`
          : "Semua Kuota Aman",
      color: criticalCount > 0 ? "#B54708" : "#1A56DB",
    },
  ];

  return (
    <section className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-subtle">
      <div className="flex items-center justify-between mb-4">
        <h2 className="m-0 text-[15px] font-bold text-ink dark:text-white">
          Ringkasan Kepatuhan Regulator
        </h2>
        <span className="text-[11px] text-subtext dark:text-slate-400 font-mono">Realtime Audit</span>
      </div>
      <div className="flex flex-col gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="p-3.5 rounded-xl bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-800">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs sm:text-sm font-medium text-ink dark:text-slate-200">
                {m.label}
              </span>
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: m.color }}
              >
                {m.rate}
              </span>
            </div>
            <div className="text-xs text-subtext dark:text-slate-400">Status: {m.status}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
