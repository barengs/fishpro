interface StatusChipProps {
  label: string
  bg?: string
  color?: string
  icon?: React.ReactNode
}

export function StatusChip({
  label,
  bg = '#E8F0FE',
  color = '#1A56DB',
  icon
}: StatusChipProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full text-xs font-bold whitespace-nowrap"
      style={{ backgroundColor: bg, color }}
    >
      {icon}
      {label}
    </span>
  )
}
