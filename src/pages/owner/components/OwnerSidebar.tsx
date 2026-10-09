import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { NotificationBell } from '../../../components/NotificationBell'
import { UserProfileBadge } from '../../../components/UserProfileBadge'
import { House, Ship, Users } from 'lucide-react'
import { MobileTopbar } from '../../../components/MobileTopbar'

const navItems = [
  { label: 'Beranda', to: '/owner', end: true, Icon: House },
  { label: 'Armada Kapal', to: '/owner/fleet', Icon: Ship },
  { label: 'Nahkoda', to: '/owner/captains', Icon: Users }
]


function SidebarBody() {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((n) => (
        <NavLink key={n.label} to={n.to} end={n.end} className={({ isActive }) => `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline transition-all ${isActive ? 'bg-fco-blue-light text-fco-blue' : 'bg-transparent text-fco-muted hover:bg-fco-bg hover:text-fco-dark'}`}>
          {<n.Icon size={20} className="shrink-0" strokeWidth={1.8} aria-hidden="true" />}
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
        <MobileTopbar open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)}
        profile={{ initials: 'PT', name: 'PT Laut Nusantara', role: 'Pemilik kapal' }}
        onLogout={() => navigate('/login')}>
          <div onClick={() => setOpen(false)}>
            <SidebarBody />
          </div>
        </MobileTopbar>
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7"><Outlet /></main>
      </div>
    </div>
  )
}
