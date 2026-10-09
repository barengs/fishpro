interface ProgressBarProps {
  width: string
  height?: number
  trackBg?: string
  barBg?: string
  showText?: boolean
}

export function ProgressBar({
  width,
  height = 6,
  trackBg = '#E8F0FE',
  barBg = '#1A56DB',
  showText = false
}: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: `${height}px`, backgroundColor: trackBg }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width, backgroundColor: barBg }}
        />
      </div>
      {showText && (
        <span className="w-9 text-[13px] font-semibold tabular-nums text-[#0F1F3D]">
          {width}
        </span>
      )}
    </div>
  )
}
