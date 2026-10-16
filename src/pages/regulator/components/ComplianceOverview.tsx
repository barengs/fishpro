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
    <section className="surface-card border rounded-xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h2 className="m-0 text-base font-bold text-strong">
          Ringkasan Kepatuhan Regulator
        </h2>
        <span className="text-xs text-soft font-mono">Realtime Audit</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {metrics.map((m) => (
          <div key={m.label} className="p-3.5 rounded-xl surface-inset border">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-fco-sm font-semibold text-strong">
                {m.label}
              </span>
              <span
                className="text-sm font-extrabold tabular-nums"
                style={{ color: m.color }}
              >
                {m.rate}
              </span>
            </div>
            <div className="text-xs text-soft">Status: {m.status}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
