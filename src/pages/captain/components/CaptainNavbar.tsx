import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { NotificationBell } from '../../../components/NotificationBell'
import { UserProfileBadge } from '../../../components/UserProfileBadge'

const tabs = [
  { label: 'Beranda', to: '/captain', end: true },
  { label: 'Riwayat', to: '/captain/catches' },
  { label: 'Kapal Saya', to: '/captain/ship' }
]

export function CaptainNavbar() {
  const navigate = useNavigate()
  return (
    <header className="bg-white border-b border-fco-border sticky top-0 z-40">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-10 min-h-16 sm:min-h-18 flex flex-wrap items-center justify-between gap-2 sm:gap-3 py-2">
        <div className="flex items-center gap-4 sm:gap-10 flex-wrap">
          <Link to="/captain" className="no-underline"><Logo /></Link>
          <nav aria-label="Menu utama Nahkoda" className="flex gap-1 flex-wrap">
            {tabs.map((t) => (
              <NavLink key={t.label} to={t.to} end={t.end} className={({ isActive }) => `inline-flex items-center h-9 sm:h-10 px-3 sm:px-4 rounded-fco text-fco-sm sm:text-sm font-semibold no-underline transition-colors ${isActive ? 'bg-fco-blue-light text-fco-blue' : 'bg-transparent text-fco-muted hover:bg-fco-bg hover:text-fco-dark'}`}>
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3.5">
          <NotificationBell />
          <div className="hidden sm:block">
            <UserProfileBadge initials="BH" name="Budi Hartono" role="Nahkoda KM Samudra Jaya" onLogout={() => navigate('/login')} />
          </div>
          <button type="button" onClick={() => navigate('/login')} aria-label="Keluar" className="sm:hidden w-10 h-10 rounded-fco border border-fco-border bg-white flex items-center justify-center cursor-pointer">
            <svg className="w-4 h-4 stroke-fco-muted" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export function CaptainLayout() {
  return (
    <div className="min-h-screen bg-fco-bg text-fco-dark">
      <CaptainNavbar />
      <Outlet />
    </div>
  )
}
