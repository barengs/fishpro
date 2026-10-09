interface UserProfileBadgeProps {
  initials: string
  name: string
  role: string
  avatarBg?: string
}

export function UserProfileBadge({
  initials,
  name,
  role,
  avatarBg = '#1A56DB'
}: UserProfileBadgeProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className="w-9 h-9 rounded-full text-white text-[13px] font-bold flex items-center justify-center shrink-0"
        style={{ backgroundColor: avatarBg }}
      >
        {initials}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-[#0F1F3D] truncate">{name}</div>
        <div className="text-xs text-[#5B6B86] whitespace-nowrap">{role}</div>
      </div>
    </div>
  )
}
