import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { UserProfileBadge } from '../../../components/UserProfileBadge'

interface PemilikSidebarProps {
  activeNav: string
  onNavChange: (nav: string) => void
}

const navItems = [
  { label: 'Beranda', d: 'M3 11l9-8 9 8M5 10v10h14V10' },
  { label: 'Armada Kapal', d: 'M12 3v11M12 4l6 9h-6M3 17h18l-2 3H5z' },
  { label: 'Nahkoda', d: 'M16 20v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1M10 11a3 3 0 100-6 3 3 0 000 6M20 20v-1a4 4 0 00-3-3.8M16 5.2a3 3 0 010 5.6' },
  { label: 'Laporan Tangkapan', d: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M8 12h8M8 16h5' },
  { label: 'Kuota dan PNBP', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { label: 'Profil Perusahaan', d: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z' }
]

export function PemilikSidebar({ activeNav, onNavChange }: PemilikSidebarProps) {
  const navigate = useNavigate()

  return (
    <nav
      aria-label="Menu utama Pemilik"
      className="basis-[248px] shrink-0 bg-white border-r border-fco-border p-4 flex flex-col justify-between"
    >
      <div>
        <div className="px-2 pb-7">
          <Link to="/pemilik" className="no-underline">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-col gap-1">
          {navItems.map((n) => {
            const isActive = activeNav === n.label
            return (
              <button
                key={n.label}
                type="button"
                onClick={() => onNavChange(n.label)}
                className={`flex items-center gap-3 h-[42px] px-3 rounded-[10px] text-sm font-semibold border-none cursor-pointer text-left transition-all ${
                  isActive
                    ? 'bg-fco-blue-light text-fco-blue'
                    : 'bg-transparent text-fco-muted hover:bg-fco-bg hover:text-fco-dark'
                }`}
              >
                <svg
                  className="w-5 h-5 shrink-0 stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={n.d} />
                </svg>
                {n.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-3 rounded-xl bg-fco-bg">
        <UserProfileBadge
          initials="PT"
          name="PT Laut Nusantara"
          role="Pemilik kapal"
          onLogout={() => navigate('/login')}
        />
      </div>
    </nav>
  )
}
