export type ActiveView =
  | 'onboard'
  | 'login'
  | 'register'
  | 'reset-password'
  | 'admin'
  | 'regulator'
  | 'pemilik'
  | 'nahkoda'

interface RoleSwitcherProps {
  currentView: ActiveView
  onSelectView: (view: ActiveView) => void
}

const views: { key: ActiveView; label: string; group: 'auth' | 'app' }[] = [
  { key: 'onboard', label: '01 Onboard', group: 'auth' },
  { key: 'login', label: '02 Login', group: 'auth' },
  { key: 'register', label: '03 Register Step', group: 'auth' },
  { key: 'reset-password', label: '04 Reset Sandi', group: 'auth' },
  { key: 'admin', label: 'Admin KKP', group: 'app' },
  { key: 'regulator', label: 'Regulator', group: 'app' },
  { key: 'pemilik', label: 'Pemilik Kapal', group: 'app' },
  { key: 'nahkoda', label: 'Nahkoda', group: 'app' }
]

export function RoleSwitcher({ currentView, onSelectView }: RoleSwitcherProps) {
  return (
    <aside
      aria-label="Pilih Halaman FCO"
      className="bg-[#0F1F3D] text-white px-5 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/10 sticky top-0 z-50 shadow-xs"
    >
      <div className="flex items-center gap-2 font-semibold">
        <span className="inline-block w-2 h-2 rounded-full bg-[#3F82E8] animate-pulse" />
        <span>FCO Navigation</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {views.map((v) => {
          const isSelected = currentView === v.key
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => onSelectView(v.key)}
              className={`h-7 px-2.5 rounded-md text-xs font-semibold cursor-pointer inline-flex items-center gap-1 transition-all ${
                isSelected
                  ? 'bg-[#1A56DB] text-white shadow-xs'
                  : v.group === 'auth'
                  ? 'bg-white/5 hover:bg-white/15 text-[#BCD3F8]'
                  : 'bg-white/10 hover:bg-white/20 text-[#CBD8EE]'
              }`}
            >
              {v.label}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
