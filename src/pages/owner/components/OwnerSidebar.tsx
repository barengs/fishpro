import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { UserProfileBadge } from '../../../components/UserProfileBadge'

const navItems = [
  { label: 'Beranda', to: '/owner', end: true, d: 'M3 11l9-8 9 8M5 10v10h14V10' },
  { label: 'Armada Kapal', to: '/owner/fleet', d: 'M12 3v11M12 4l6 9h-6M3 17h18l-2 3H5z' },
  { label: 'Nahkoda', to: '/owner/captains', d: 'M16 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M10 11a3 3 0 100-6 3 3 0 000 6M20 20v-1a4 4 0 00-3-3.8M16 5.2a3 3 0 010 5.6' }
]

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="px-2 pb-7">
          <Link to="/owner" className="no-underline" onClick={onNavigate}><Logo /></Link>
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map((n) => (
            <NavLink key={n.label} to={n.to} end={n.end} onClick={onNavigate} className={({ isActive }) => `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline transition-all ${isActive ? 'bg-fco-blue-light text-fco-blue' : 'bg-transparent text-fco-muted hover:bg-fco-bg hover:text-fco-dark'}`}>
              <svg className="w-5 h-5 shrink-0 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={n.d} /></svg>
              {n.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="p-3 rounded-xl bg-fco-bg">
        <UserProfileBadge initials="PT" name="PT Laut Nusantara" role="Pemilik kapal" onLogout={() => navigate('/login')} />
      </div>
    </div>
  )
}

export function OwnerSidebar() {
  return (
    <nav aria-label="Menu utama Pemilik" className="hidden lg:flex basis-62 shrink-0 bg-white border-r border-fco-border p-4">
      <SidebarBody />
    </nav>
  )
}

export function OwnerLayout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="min-h-screen flex bg-fco-bg text-fco-dark">
      <OwnerSidebar />
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-fco-border">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/owner" className="no-underline"><Logo /></Link>
          <button type="button" onClick={() => setOpen(!open)} aria-label="Buka menu" className="w-10 h-10 rounded-fco border border-fco-border bg-white flex items-center justify-center cursor-pointer">
            <svg className="w-5 h-5 stroke-fco-dark" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        {open && (
          <div className="border-t border-fco-border bg-white p-4 max-h-[70vh] overflow-y-auto">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        )}
      </div>
      <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7"><Outlet /></main>
    </div>
  )
}
