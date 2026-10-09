import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { UserProfileBadge } from '../../../components/UserProfileBadge'
import { MobileTopbar } from '../../../components/MobileTopbar'

const navItems = [
  { label: 'Ringkasan', to: '/admin', end: true, d: 'M3 11l9-8 9 8M5 10v10h14V10' },
  { label: 'Kapal', to: '/admin/ships', d: 'M12 3v11M12 4l6 9h-6M3 17h18l-2 3H5z' },
  { label: 'Pemilik dan Nahkoda', to: '/admin/owners', d: 'M16 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M10 11a3 3 0 100-6 3 3 0 000 6M20 20v-1a4 4 0 00-3-3.8M16 5.2a3 3 0 010 5.6' },
  { label: 'Laporan Tangkapan', to: '/admin/catches', d: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M8 12h8M8 16h5' },
  { label: 'Spesies Ikan', to: '/admin/species', d: 'M2 12c3-5 8-6 12-3l6-3v12l-6-3c-4 3-9 2-12-3z' },
  { label: 'Wilayah (WPP)', to: '/admin/areas', d: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z' },
  { label: 'Kuota dan PNBP', to: '/admin/quota', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { label: 'Blockchain', to: '/admin/blockchain', d: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1' },
  { label: 'Peran dan Menu', to: '/admin/roles', d: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' }
]

export function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((n) => (
          <NavLink
            key={n.label}
            to={n.to}
            end={n.end}
            onClick={onNavigate}
            className={({ isActive }) => `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${isActive ? 'bg-fco-blue-light text-fco-blue' : 'bg-transparent text-fco-muted hover:bg-fco-bg hover:text-fco-dark'}`}
          >
            <svg className="w-5 h-5 shrink-0 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={n.d} />
            </svg>
            {n.label}
          </NavLink>
        ))}
    </div>
  )
}

export function AdminSidebar() {
  return (
    <nav aria-label="Menu utama Admin" className="hidden lg:flex flex-col basis-62 shrink-0 bg-white border-r border-fco-border p-4">
      <div className="px-2 pb-7">
        <Link to="/admin" className="no-underline"><Logo /></Link>
      </div>
      <div className="flex-1">
        <SidebarBody />
      </div>
    </nav>
  )
}

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex bg-fco-bg text-fco-dark">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-10 h-18 bg-white border-b border-fco-border sticky top-0 z-30">
          <UserProfileBadge initials="AD" name="Administrator" role="Admin KKP" onLogout={() => navigate('/login')} />
        </header>
        <MobileTopbar open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)} homeTo="/admin">
          <SidebarBody onNavigate={() => setOpen(false)} />
          <div className="mt-4 flex justify-center">
            <UserProfileBadge initials="AD" name="Administrator" role="Admin KKP" onLogout={() => navigate('/login')} />
          </div>
        </MobileTopbar>
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
