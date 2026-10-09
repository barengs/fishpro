export function ComplianceOverview() {
  const metrics = [
    { label: 'Kepatuhan Pelaporan WPP', rate: '94,8%', status: 'Sangat Baik', color: '#1A56DB' },
    { label: 'Ketepatan Hitung PNBP', rate: '99,1%', status: 'Valid Otomatis', color: '#1A56DB' },
    { label: 'Kapal Lampaui Ambang Kuota', rate: '2,4%', status: 'Perlu Audit', color: '#B54708' }
  ]

  return (
    <section className="bg-white border border-fco-border rounded-2xl p-6 shadow-xs">
      <h2 className="mt-0 mb-4 text-base font-bold text-fco-dark">Ringkasan Kepatuhan Regulator</h2>
      <div className="flex flex-col gap-3.5">
        {metrics.map((m) => (
          <div key={m.label} className="p-3.5 rounded-xl bg-fco-bg border border-fco-border-subtle">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[13px] font-semibold text-fco-dark">{m.label}</span>
              <span className="text-sm font-extrabold tabular-nums" style={{ color: m.color }}>
                {m.rate}
              </span>
            </div>
            <div className="text-xs text-fco-muted">Status: {m.status}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
