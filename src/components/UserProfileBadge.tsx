import { useEffect, useRef, useState } from 'react'

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
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [dropdownOpen ])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        aria-label="Menu profil pengguna"
        className="flex items-center gap-3 p-1.5 rounded-xl border-none bg-transparent hover:bg-fco-bg cursor-pointer transition-colors"
      >
        <div
          className="w-9 h-9 rounded-full text-white text-fco-sm font-bold flex items-center justify-center shrink-0"
          style={{ backgroundColor: avatarBg }}
        >
          {initials}
        </div>
        <div className="min-w-0 text-left hidden sm:block">
          <div className="text-sm font-semibold text-fco-dark truncate max-w-40">{name}</div>
          <div className="text-xs text-fco-muted whitespace-nowrap">{role}</div>
        </div>
        <svg className={`w-4 h-4 stroke-fco-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {dropdownOpen && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-56 bg-white border border-fco-border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2.5 border-b border-fco-border-subtle mb-1">
            <div className="text-sm font-bold text-fco-dark truncate">{name}</div>
            <div className="text-xs text-fco-muted">{role}</div>
          </div>
          <a href="#profil" role="menuitem" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-fco-dark hover:bg-fco-bg no-underline transition-colors">
            <svg className="w-4 h-4 stroke-fco-muted" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profil saya
          </a>
          {onLogout && (
            <button
              type="button"
              role="menuitem"
              onClick={() => { setDropdownOpen(false); onLogout() }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Keluar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
