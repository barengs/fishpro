import { ProgressBar } from '../../../components/ProgressBar'

const wppData = [
  { label: 'WPP 711', value: '214', width: '100%' },
  { label: 'WPP 712', value: '176', width: '82%' },
  { label: 'WPP 713', value: '148', width: '69%' },
  { label: 'WPP 573', value: '121', width: '57%' },
  { label: 'WPP 718', value: '96', width: '45%' }
]

export function WppBarChart() {
  return (
    <section className="surface-card border rounded-2xl p-6 shadow-xs">
      <h2 className="mt-0 mb-5 text-base font-bold text-strong">Tangkapan per WPP (ton)</h2>
      <div className="flex flex-col gap-4.5">
        {wppData.map((w) => (
          <div key={w.label}>
            <div className="flex justify-between mb-2 text-fco-sm">
              <span className="font-semibold text-strong">{w.label}</span>
              <span className="text-soft tabular-nums">{w.value}</span>
            </div>
            <ProgressBar width={w.width} height={8} />
          </div>
        ))}
      </div>
    </section>
  )
}
