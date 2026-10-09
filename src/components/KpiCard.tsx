interface KpiCardProps {
  label: string
  value: string
  delta?: string
  note?: string
  trendUp?: boolean
}

import { TrendingUp } from 'lucide-react'

export function KpiCard({ label, value, delta, note, trendUp = true }: KpiCardProps) {
  return (
    <div className="surface-card border rounded-2xl p-5 flex flex-col justify-between shadow-xs">
      <div className="text-fco-sm font-semibold text-soft">{label}</div>
      <div className="text-fco-kpi font-extrabold tracking-tight my-2 tabular-nums text-strong">
        {value}
      </div>
      {delta && (
        <div className="flex items-center gap-1.5 text-xs text-soft">
          {trendUp && <TrendingUp size={14} className="text-fco-blue shrink-0" strokeWidth={2.4} aria-hidden="true" />}
          <span>{delta}</span>
        </div>
      )}
      {note && <div className="text-xs text-soft">{note}</div>}
    </div>
  )
}
