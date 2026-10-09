import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react'

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
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open ])

  useEffect(() => {
    if (!accountOpen) return
    const handleClick = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAccountOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [accountOpen ])

  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-fco-border">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
            className="w-10 h-10 rounded-fco border border-fco-border bg-white hover:bg-fco-bg text-fco-dark flex items-center justify-center cursor-pointer shrink-0 transition-colors"
          >
            <Menu size={22} strokeWidth={2.2} aria-hidden="true" />
          </button>
          <div ref={accountRef} className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen(!accountOpen)}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              aria-label="Menu akun"
              className="flex items-center gap-1.5 p-1 rounded-full border-none bg-transparent hover:bg-fco-bg cursor-pointer transition-colors"
            >
              <span
                className="w-9 h-9 rounded-full text-white text-fco-sm font-bold flex items-center justify-center shrink-0"
                style={{ backgroundColor: profile.avatarBg ?? '#1A56DB' }}
              >
                {profile.initials}
              </span>
              <ChevronDown size={14} className={`text-fco-muted transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {accountOpen && (
              <div role="menu" className="absolute right-0 top-full mt-2 w-56 bg-white border border-fco-border rounded-2xl shadow-xl p-2 z-50">
                <div className="px-3 py-2.5 border-b border-fco-border-subtle mb-1">
                  <div className="text-sm font-bold text-fco-dark truncate">{profile.name}</div>
                  <div className="text-xs text-fco-muted">{profile.role}</div>
                </div>
                <a href="#profil" role="menuitem" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-fco-dark hover:bg-fco-bg no-underline transition-colors">
                  <User size={16} className="text-fco-muted" aria-hidden="true" />
                  Profil saya
                </a>
                {onLogout && (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setAccountOpen(false); onLogout() }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Keluar
                  </button>
                )}
              </div>
            )}
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
          <div className="flex items-center gap-3 px-1 mb-5">
            <span className="text-sm font-extrabold tracking-tight text-fco-dark">FCO</span>
            <span className="text-xs text-fco-muted">Menu navigasi</span>
            <button type="button" onClick={onClose} aria-label="Tutup menu" className="ml-auto w-9 h-9 rounded-fco border border-fco-border bg-white flex items-center justify-center cursor-pointer hover:bg-fco-bg transition-colors shrink-0">
              <X size={18} className="text-fco-dark" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
