interface KpiCardProps {
  label: string
  value: string
  delta?: string
  note?: string
  trendUp?: boolean
}

export function KpiCard({ label, value, delta, note, trendUp = true }: KpiCardProps) {
  return (
    <div className="bg-white border border-[#DCE6F5] rounded-2xl p-5 flex flex-col justify-between shadow-xs">
      <div className="text-[13px] font-semibold text-[#5B6B86]">{label}</div>
      <div className="text-[28px] font-extrabold tracking-tight my-2 tabular-nums text-[#0F1F3D]">
        {value}
      </div>
      {delta && (
        <div className="flex items-center gap-1.5 text-xs text-[#5B6B86]">
          {trendUp && (
            <svg
              className="w-3.5 h-3.5 stroke-[#1A56DB] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          )}
          <span>{delta}</span>
        </div>
      )}
      {note && <div className="text-xs text-[#5B6B86]">{note}</div>}
    </div>
  )
}
