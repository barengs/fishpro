import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../../components/Logo'
import { UserProfileBadge } from '../../../components/UserProfileBadge'

interface RegulatorSidebarProps {
  activeNav: string
  onNavChange: (nav: string) => void
}

const navItems = [
  { label: 'Audit Kuota', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { label: 'Override Kuota', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { label: 'Kepatuhan WPP', d: 'M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z' },
  { label: 'Verifikasi Blockchain', d: 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1' },
  { label: 'Tarif & PNBP', d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
]

export function RegulatorSidebar({ activeNav, onNavChange }: RegulatorSidebarProps) {
  const navigate = useNavigate()

  return (
    <nav
      aria-label="Menu utama Regulator"
      className="basis-[248px] shrink-0 bg-white border-r border-[#DCE6F5] p-4 flex flex-col justify-between"
    >
      <div>
        <div className="px-2 pb-7">
          <Link to="/regulator" className="no-underline">
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
                    ? 'bg-[#E8F0FE] text-[#1A56DB]'
                    : 'bg-transparent text-[#5B6B86] hover:bg-[#F6F9FE] hover:text-[#0F1F3D]'
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

      <div className="p-3 rounded-xl bg-[#F6F9FE]">
        <UserProfileBadge
          initials="RG"
          name="Pengawas Perikanan"
          role="Regulator KKP"
          avatarBg="#0284C7"
          onLogout={() => navigate('/login')}
        />
      </div>
    </nav>
  )
}
