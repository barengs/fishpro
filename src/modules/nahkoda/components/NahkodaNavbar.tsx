import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { NotificationBell } from '../../../components/NotificationBell'
import { UserProfileBadge } from '../../../components/UserProfileBadge'

interface NahkodaNavbarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = ['Beranda', 'Lapor Tangkapan', 'Riwayat', 'Kapal Saya']

export function NahkodaNavbar({ activeTab, onTabChange }: NahkodaNavbarProps) {
  const navigate = useNavigate()

  return (
    <header className="bg-white border-b border-[#DCE6F5] sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 min-h-[72px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-10 flex-wrap">
          <Link to="/nahkoda" className="no-underline">
            <Logo />
          </Link>

          <nav aria-label="Menu utama Nahkoda" className="flex gap-1 flex-wrap">
            {tabs.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={`inline-flex items-center h-10 px-4 rounded-[10px] text-sm font-semibold border-none cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#E8F0FE] text-[#1A56DB]'
                      : 'bg-transparent text-[#5B6B86] hover:bg-[#F6F9FE] hover:text-[#0F1F3D]'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3.5">
          <NotificationBell />
          <UserProfileBadge
            initials="BH"
            name="Budi Hartono"
            role="Nahkoda KM Samudra Jaya"
            onLogout={() => navigate('/login')}
          />
        </div>
      </div>
    </header>
  )
}
