import { useEffect } from 'react'

interface Profile {
  initials: string
  name: string
  role: string
  avatarBg?: string
}

interface MobileTopbarProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
  profile: Profile
  onLogout?: () => void
  children: React.ReactNode
}

export function MobileTopbar({ open, onToggle, onClose, profile, onLogout, children }: MobileTopbarProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open ])

  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-fco-border">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="w-10 h-10 rounded-fco border border-fco-border bg-white flex items-center justify-center cursor-pointer shrink-0"
          >
            <span className="relative block w-5 h-5">
              <span className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-fco-dark transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[9px] block h-0.5 w-5 rounded-full bg-fco-dark transition-all duration-300 ${open ? 'opacity-0 -translate-x-2' : ''}`} />
              <span className={`absolute left-0 top-[17px] block h-0.5 w-5 rounded-full bg-fco-dark transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
          <div
            className="w-9 h-9 rounded-full text-white text-fco-sm font-bold flex items-center justify-center shrink-0"
            style={{ backgroundColor: profile.avatarBg ?? '#1A56DB' }}
            title={`${profile.name} · ${profile.role}`}
          >
            {profile.initials}
          </div>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-fco-dark/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          role="dialog"
          aria-label="Menu navigasi"
          className={`absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white p-4 overflow-y-auto shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center gap-3 p-2 mb-4 border-b border-fco-border-subtle pb-4">
            <div
              className="w-10 h-10 rounded-full text-white text-sm font-bold flex items-center justify-center shrink-0"
              style={{ backgroundColor: profile.avatarBg ?? '#1A56DB' }}
            >
              {profile.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-fco-dark truncate">{profile.name}</div>
              <div className="text-xs text-fco-muted">{profile.role}</div>
            </div>
            <button type="button" onClick={onClose} aria-label="Tutup menu" className="w-9 h-9 rounded-fco border border-fco-border bg-white flex items-center justify-center cursor-pointer hover:bg-fco-bg transition-colors shrink-0">
              <svg className="w-4.5 h-4.5 stroke-fco-dark" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {children}
          {onLogout && (
            <button
              type="button"
              onClick={() => { onClose(); onLogout() }}
              className="mt-4 w-full flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border-none cursor-pointer transition-colors"
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
      </div>
    </>
  )
}
