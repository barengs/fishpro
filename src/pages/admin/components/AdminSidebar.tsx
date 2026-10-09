import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { UserProfileBadge } from '../../../components/UserProfileBadge'
import { BarChart3, ClipboardList, Fish, LayoutDashboard, Link2, MapPin, ShieldCheck, Ship, Users } from 'lucide-react'
import { MobileTopbar } from '../../../components/MobileTopbar'
import { ThemeToggle } from '../../../components/ThemeToggle'

const navItems = [
  { label: 'Ringkasan', to: '/admin', end: true, Icon: LayoutDashboard },
  { label: 'Kapal', to: '/admin/ships', Icon: Ship },
  { label: 'Pemilik dan Nahkoda', to: '/admin/owners', Icon: Users },
  { label: 'Laporan Tangkapan', to: '/admin/catches', Icon: ClipboardList },
  { label: 'Spesies Ikan', to: '/admin/species', Icon: Fish },
  { label: 'Wilayah (WPP)', to: '/admin/areas', Icon: MapPin },
  { label: 'Kuota dan PNBP', to: '/admin/quota', Icon: BarChart3 },
  { label: 'Blockchain', to: '/admin/blockchain', Icon: Link2 },
  { label: 'Peran dan Menu', to: '/admin/roles', Icon: ShieldCheck }
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
            className={({ isActive }) => `flex items-center gap-3 h-10.5 px-3 rounded-fco text-sm font-semibold no-underline cursor-pointer transition-all ${isActive ? 'bg-fco-blue-light text-fco-blue' : 'bg-transparent text-soft hover:surface-page hover:text-strong'}`}
          >
            <n.Icon size={20} className="shrink-0" strokeWidth={1.8} aria-hidden="true" />
            {n.label}
          </NavLink>
        ))}
    </div>
  )
}

export function AdminSidebar() {
  return (
    <nav aria-label="Menu utama Admin" className="hidden lg:flex flex-col basis-62 shrink-0 surface-topbar border-r p-4">
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
    <div className="min-h-screen flex surface-page text-strong">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden lg:flex items-center justify-end gap-4 px-10 h-18 surface-topbar border-b sticky top-0 z-30">
          <ThemeToggle />
          <UserProfileBadge initials="AD" name="Administrator" role="Admin KKP" onLogout={() => navigate('/login')} />
        </header>
        <MobileTopbar open={open} onToggle={() => setOpen(!open)} onClose={() => setOpen(false)}
        profile={{ initials: 'AD', name: 'Administrator', role: 'Admin KKP' }}
        onLogout={() => navigate('/login')}>
          <SidebarBody onNavigate={() => setOpen(false)} />
        </MobileTopbar>
        <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-10 pt-20 lg:pt-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
