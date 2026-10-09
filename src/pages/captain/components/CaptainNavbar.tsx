import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { NotificationBell } from '../../../components/NotificationBell'
import { UserProfileBadge } from '../../../components/UserProfileBadge'
import { ThemeToggle } from '../../../components/ThemeToggle'

const tabs = [
  { label: 'Beranda', to: '/captain', end: true },
  { label: 'Riwayat', to: '/captain/catches' },
  { label: 'Kapal Saya', to: '/captain/ship' }
]

export function CaptainNavbar() {
  const navigate = useNavigate()
  return (
    <header className="surface-topbar border-b sticky top-0 z-40">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 min-h-16 sm:min-h-18 flex flex-wrap items-center justify-between gap-2 sm:gap-3 py-2">
        <div className="flex items-center gap-4 sm:gap-10 flex-wrap">
          <Link to="/captain" className="no-underline"><Logo /></Link>
          <nav aria-label="Menu utama Nahkoda" className="flex gap-1 flex-wrap">
            {tabs.map((t) => (
              <NavLink key={t.label} to={t.to} end={t.end} className={({ isActive }) => `inline-flex items-center h-9 sm:h-10 px-3 sm:px-4 rounded-fco text-fco-sm sm:text-sm font-semibold no-underline transition-colors ${isActive ? 'bg-fco-blue-light text-fco-blue' : 'bg-transparent text-soft hover:surface-page hover:text-strong'}`}>
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3.5 ml-auto">
          <ThemeToggle compact />
          <NotificationBell />
          <UserProfileBadge initials="BH" name="Budi Hartono" role="Nahkoda KM Samudra Jaya" onLogout={() => navigate('/login')} />
        </div>
      </div>
    </header>
  )
}

export function CaptainLayout() {
  return (
    <div className="min-h-screen surface-page text-strong">
      <CaptainNavbar />
      <Outlet />
    </div>
  )
}
