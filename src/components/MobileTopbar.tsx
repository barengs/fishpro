import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from './Logo'

interface MobileTopbarProps {
  open: boolean
  onToggle: () => void
  onClose: () => void
  homeTo: string
  children: React.ReactNode
}

export function MobileTopbar({ open, onToggle, onClose, homeTo, children }: MobileTopbarProps) {
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
            className="w-10 h-10 rounded-fco border border-fco-border bg-white flex items-center justify-center cursor-pointer"
          >
            <span className="relative block w-5 h-5">
              <span className={`absolute left-0 top-1 block h-0.5 w-5 rounded-full bg-fco-dark transition-all duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
              <span className={`absolute left-0 top-[9px] block h-0.5 w-5 rounded-full bg-fco-dark transition-all duration-300 ${open ? 'opacity-0 -translate-x-2' : ''}`} />
              <span className={`absolute left-0 top-[17px] block h-0.5 w-5 rounded-full bg-fco-dark transition-all duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
            </span>
          </button>
          <Link to={homeTo} className="no-underline"><Logo /></Link>
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
          <div className="flex items-center justify-between mb-4">
            <Link to={homeTo} className="no-underline" onClick={onClose}><Logo /></Link>
            <button type="button" onClick={onClose} aria-label="Tutup menu" className="w-9 h-9 rounded-fco border border-fco-border bg-white flex items-center justify-center cursor-pointer hover:bg-fco-bg transition-colors">
              <svg className="w-4.5 h-4.5 stroke-fco-dark" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  )
}
