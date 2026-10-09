import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { NotificationBell } from '../../../components/NotificationBell'
import { UserProfileBadge } from '../../../components/UserProfileBadge'
import { MobileTopbar } from '../../../components/MobileTopbar'

const navItems = [
  { label: 'Beranda', to: '/owner', end: true, d: 'M3 11l9-8 9 8M5 10v10h14V10' },
  { label: 'Armada Kapal', to: '/owner/fleet', d: 'M12 3v11M12 4l6 9h-6M3 17h18l-2 3H5z' },
  { label: 'Nahkoda', to: '/owner/captains', d: 'M16 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M10 11a3 3 0 100-6 3 3 0 000 6M20 20v-1a4 4 0 00-3-3.8M16 5.2a3 3 0 010 5.6' }
]

function SidebarBody() {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((n) => (
        <NavLink key={n.label} to={n.to} end={n.end} className={({ isActive }) => `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline transition-all ${isActive ? 'bg-fco-blue-light text-fco-blue' : 'bg-transparent text-fco-muted hover:bg-fco-bg hover:text-fco-dark'}`}>
          <svg className="w-5 h-5 shrink-0 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={n.d} /></svg>
          {n.label}
        </NavLink>
      ))}
    </div>
  )
}

export function OwnerSidebar() {
  return (
    <nav aria-label="Menu utama Pemilik" className="hidden lg:flex flex-col basis-62 shrink-0 bg-white border-r border-fco-border p-4">
      <div className="px-2 pb-7">
        <Link to="/owner" className="no-underline"><Logo /></Link>
      </div>
      <div className="flex-1">
        <SidebarBody />
      </div>
    </nav>
  )
}

export function OwnerLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex bg-fco-bg text-fco-dark">
      <OwnerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar: notif + akun di kanan */}
        <header className="hidden lg:flex items-center justify-end gap-4 px-10 h-18 bg-white border-b border-fco-border sticky top-0 z-30">
          <NotificationBell count={1} />
          <UserProfileBadge initials="PT" name="PT Laut Nusantara" role="Pemilik kapal" onLogout={() => navigate('/login')} />
        </header>
        <MobileTopbar open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)} homeTo="/owner">
          <div onClick={() => setOpen(false)}>
            <SidebarBody />
          </div>
          <div className="p-3 rounded-xl bg-fco-bg mt-4">
            <UserProfileBadge initials="PT" name="PT Laut Nusantara" role="Pemilik kapal" onLogout={() => navigate('/login')} />
          </div>
        </MobileTopbar>
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7"><Outlet /></main>
      </div>
    </div>
  )
}
