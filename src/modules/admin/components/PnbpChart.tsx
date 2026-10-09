export function PnbpChart() {
  return (
    <section className="bg-white border border-[#DCE6F5] rounded-2xl p-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="m-0 text-base font-bold text-[#0F1F3D]">PNBP bulanan: aktual dan prediksi</h2>
        <div className="flex gap-4 text-xs text-[#5B6B86]">
          <span className="flex items-center gap-1.5">
            <svg width="20" height="4" viewBox="0 0 20 4" aria-hidden="true">
              <line x1="0" y1="2" x2="20" y2="2" stroke="#1A56DB" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Aktual
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="20" height="4" viewBox="0 0 20 4" aria-hidden="true">
              <line x1="0" y1="2" x2="20" y2="2" stroke="#3F82E8" strokeWidth="2.5" strokeDasharray="4 3" />
            </svg>
            Prediksi
          </span>
        </div>
      </div>

      <svg viewBox="0 0 640 260" role="img" aria-label="Grafik garis PNBP bulanan" className="w-full h-auto block">
        <rect x="406" y="30" width="210" height="190" fill="#F3F7FE" />
        <text x="414" y="48" fontSize="12" fontWeight="600" fill="#5B6B86">Prediksi</text>
        <line x1="56" y1="40" x2="616" y2="40" stroke="#E6EDF8" strokeWidth="1" />
        <line x1="56" y1="100" x2="616" y2="100" stroke="#E6EDF8" strokeWidth="1" />
        <line x1="56" y1="160" x2="616" y2="160" stroke="#E6EDF8" strokeWidth="1" />
        <line x1="56" y1="220" x2="616" y2="220" stroke="#CBD8EE" strokeWidth="1" />
        <text x="44" y="44" fontSize="12" fill="#5B6B86" textAnchor="end">6</text>
        <text x="44" y="104" fontSize="12" fill="#5B6B86" textAnchor="end">4</text>
        <text x="44" y="164" fontSize="12" fill="#5B6B86" textAnchor="end">2</text>
        <text x="44" y="224" fontSize="12" fill="#5B6B86" textAnchor="end">0</text>
        <text x="0" y="14" fontSize="12" fill="#5B6B86">Rp miliar</text>
        <path d="M56,142 L126,127 L196,133 L266,112 L336,103 L406,88 L406,220 L56,220 Z" fill="#E8F0FE" />
        <polyline points="56,142 126,127 196,133 266,112 336,103 406,88" fill="none" stroke="#1A56DB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="406,88 476,76 546,67 616,55" fill="none" stroke="#3F82E8" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" />
        <circle cx="56" cy="142" r="4.5" fill="#1A56DB" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="126" cy="127" r="4.5" fill="#1A56DB" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="196" cy="133" r="4.5" fill="#1A56DB" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="266" cy="112" r="4.5" fill="#1A56DB" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="336" cy="103" r="4.5" fill="#1A56DB" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="406" cy="88" r="4.5" fill="#1A56DB" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="476" cy="76" r="4.5" fill="#FFFFFF" stroke="#3F82E8" strokeWidth="2" />
        <circle cx="546" cy="67" r="4.5" fill="#FFFFFF" stroke="#3F82E8" strokeWidth="2" />
        <circle cx="616" cy="55" r="4.5" fill="#FFFFFF" stroke="#3F82E8" strokeWidth="2" />
        <text x="56" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Mei</text>
        <text x="126" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Jun</text>
        <text x="196" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Jul</text>
        <text x="266" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Agu</text>
        <text x="336" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Sep</text>
        <text x="406" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Okt</text>
        <text x="476" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Nov</text>
        <text x="546" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Des</text>
        <text x="616" y="244" fontSize="12" fill="#5B6B86" textAnchor="middle">Jan</text>
      </svg>
    </section>
  )
}
