export type ActiveView = 'auth' | 'admin' | 'regulator' | 'nahkoda' | 'pemilik'

interface RoleSwitcherProps {
  currentView: ActiveView
  onSelectView: (view: ActiveView) => void
}

const views: { key: ActiveView; label: string; badge: string }[] = [
  { key: 'admin', label: 'Admin KKP', badge: 'Nasional' },
  { key: 'regulator', label: 'Regulator', badge: 'Audit & Kuota' },
  { key: 'pemilik', label: 'Pemilik Kapal', badge: 'Armada' },
  { key: 'nahkoda', label: 'Nahkoda', badge: 'Operasional' },
  { key: 'auth', label: 'Auth / Login', badge: 'Masuk & Daftar' }
]

export function RoleSwitcher({ currentView, onSelectView }: RoleSwitcherProps) {
  return (
    <aside
      aria-label="Pilih Peran FCO"
      className="bg-[#0F1F3D] text-white px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-[13px] border-b border-white/10 sticky top-0 z-50 shadow-xs"
    >
      <div className="flex items-center gap-2 font-semibold">
        <span className="inline-block w-2 h-2 rounded-full bg-[#3F82E8] animate-pulse" />
        <span>FCO Modular Web UI</span>
        <span className="text-[#7D8CA6] font-normal hidden sm:inline">· Navigasi Peran:</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {views.map((v) => {
          const isSelected = currentView === v.key
          return (
            <button
              key={v.key}
              type="button"
              onClick={() => onSelectView(v.key)}
              className={`h-[30px] px-3 rounded-md text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-all ${
                isSelected
                  ? 'bg-[#1A56DB] text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/15 text-[#CBD8EE]'
              }`}
            >
              <span>{v.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-[#8FA4C7]'
                }`}
              >
                {v.badge}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
