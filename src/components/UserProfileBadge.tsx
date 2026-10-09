interface UserProfileBadgeProps {
  initials: string
  name: string
  role: string
  avatarBg?: string
  onLogout?: () => void
}

export function UserProfileBadge({
  initials,
  name,
  role,
  avatarBg = '#1A56DB',
  onLogout
}: UserProfileBadgeProps) {
  return (
    <div className="flex items-center justify-between gap-3 min-w-0 w-full">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full text-white text-fco-sm font-bold flex items-center justify-center shrink-0"
          style={{ backgroundColor: avatarBg }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-fco-dark truncate">{name}</div>
          <div className="text-xs text-fco-muted whitespace-nowrap">{role}</div>
        </div>
      </div>

      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          title="Keluar / Logout"
          className="p-1.5 rounded-lg text-fco-muted hover:text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      )}
    </div>
  )
}
