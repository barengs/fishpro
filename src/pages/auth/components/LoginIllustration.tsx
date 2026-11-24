export function LoginIllustration() {
  return (
    <aside
      className="w-full h-full min-h-[calc(100vh-6.5rem)] bg-blue-50/70 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-8 xl:p-12 flex flex-col items-center justify-between gap-8 relative overflow-hidden"
      aria-label="Ringkasan fitur dan armada"
    >
      <div className="relative w-full max-w-[480px] aspect-[400/330] my-auto select-none">
        <svg
          className="absolute inset-0 w-full h-full block"
          viewBox="0 0 400 330"
          role="img"
          aria-label="Ilustrasi nahkoda duduk bersila di atas ombak"
        >
          <defs>
            <g id="fish">
              <path
                d="M34 0 L45 -9 Q42 0 45 9Z"
                fill="#a9d6f7"
                stroke="#14224f"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M2 0 C8 -10 24 -11 34 0 C24 11 8 10 2 0Z"
                fill="#a9d6f7"
                stroke="#14224f"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M14 -8 Q19 -15 25 -8"
                fill="#a9d6f7"
                stroke="#14224f"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M17 -7 V3 M23 -7 V4 M29 -4 V3"
                fill="none"
                stroke="#14224f"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="9" cy="-1.5" r="1.5" fill="#14224f" />
            </g>
          </defs>

          {/* Pusaran angin */}
          <g
            fill="none"
            stroke="#14224f"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M66 32 Q106 22 148 34" />
            <path d="M74 43 Q108 35 142 44" />
            <path d="M82 54 Q108 47 136 55" />
            <path d="M90 65 Q110 59 130 66" />
            <path d="M98 76 Q112 72 124 77" />
            <path d="M105 87 Q112 84 118 88" />
            <path d="M62 28 Q50 34 62 40" />
            <path d="M150 36 Q160 40 151 46" />
          </g>

          {/* Ombak melengkung */}
          <path
            d="M250 152 Q244 104 280 86 Q310 74 334 90 Q349 102 343 119 Q328 104 312 112 Q300 122 310 136 Q318 146 333 144 Q300 164 250 152Z"
            fill="#bfdcf7"
            stroke="#14224f"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M312 100 Q326 92 336 104 Q338 116 326 118 Q318 118 320 109"
            fill="none"
            stroke="#14224f"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M268 112 Q284 98 304 100 M262 128 Q284 116 300 124"
            fill="none"
            stroke="#14224f"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <g fill="#fff" stroke="#14224f" strokeWidth="1.3">
            <circle cx="352" cy="82" r="3" />
            <circle cx="360" cy="96" r="2" />
            <circle cx="346" cy="70" r="2" />
          </g>

          {/* Air laut */}
          <path
            d="M34 270 Q60 238 108 250 Q138 234 168 250 Q200 240 232 250 Q262 234 292 250 Q340 238 366 270 Q348 304 304 306 Q252 326 200 316 Q148 326 96 306 Q52 304 34 270Z"
            fill="#3B82F6"
            stroke="#14224f"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <g
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M70 274 Q96 262 122 274" />
            <path d="M150 292 Q176 282 202 294" />
            <path d="M236 278 Q262 266 288 278" />
            <path d="M292 298 Q312 290 330 298" />
            <path d="M78 298 Q100 290 118 298" />
          </g>
          <g fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
            <path d="M56 264 Q74 250 98 258" />
            <path d="M298 258 Q322 248 346 264" />
          </g>

          {/* Kaki bersila */}
          <path
            d="M126 214 Q152 196 200 202 Q248 196 274 214 Q296 238 264 250 Q232 260 200 252 Q168 260 136 250 Q104 238 126 214Z"
            fill="#fff"
            stroke="#14224f"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M150 214 Q170 224 188 220 M250 214 Q230 224 212 220"
            fill="none"
            stroke="#c6d8ef"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <path
            d="M140 244 Q176 226 216 242 M260 244 Q226 226 184 242"
            fill="none"
            stroke="#14224f"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Telapak sepatu */}
          <path
            d="M168 246 Q176 232 192 238 Q198 252 186 260 Q170 260 168 246Z"
            fill="#14224f"
          />
          <path
            d="M232 246 Q224 232 208 238 Q202 252 214 260 Q230 260 232 246Z"
            fill="#14224f"
          />

          {/* Lengan baju */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M152 142 L108 170 L118 196"
              stroke="#14224f"
              strokeWidth="30"
            />
            <path
              d="M152 142 L108 170 L118 196"
              stroke="#1E40AF"
              strokeWidth="24"
            />
            <path
              d="M248 142 L292 170 L282 196"
              stroke="#14224f"
              strokeWidth="30"
            />
            <path
              d="M248 142 L292 170 L282 196"
              stroke="#1E40AF"
              strokeWidth="24"
            />
          </g>

          {/* Tangan */}
          <g
            stroke="#14224f"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <ellipse cx="119" cy="207" rx="12" ry="9" fill="#f2c9a3" />
            <circle cx="110" cy="203" r="4.2" fill="#f2c9a3" />
            <ellipse cx="281" cy="207" rx="12" ry="9" fill="#f2c9a3" />
            <circle cx="290" cy="203" r="4.2" fill="#f2c9a3" />
          </g>

          {/* Rompi pelampung */}
          <path
            d="M146 136 Q172 120 200 124 Q228 120 254 136 L264 218 Q200 236 136 218Z"
            fill="#2563EB"
            stroke="#14224f"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path
            d="M168 127 L186 124 L184 222 L166 219Z"
            fill="#1E40AF"
            stroke="#14224f"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M232 127 L214 124 L216 222 L234 219Z"
            fill="#1E40AF"
            stroke="#14224f"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M200 128 V228"
            fill="none"
            stroke="#14224f"
            strokeWidth="1.8"
          />
          <path
            d="M139 196 Q200 210 261 196 L262 208 Q200 222 138 208Z"
            fill="#14224f"
          />
          <rect
            x="193"
            y="201"
            width="14"
            height="12"
            rx="2"
            fill="#60A5FA"
            stroke="#14224f"
            strokeWidth="1.4"
          />

          {/* Kepala & janggut */}
          <g strokeLinejoin="round" strokeLinecap="round">
            <circle
              cx="200"
              cy="96"
              r="32"
              fill="#f2c9a3"
              stroke="#14224f"
              strokeWidth="2.2"
            />
            <path
              d="M167 96 Q164 134 200 146 Q236 134 233 96 Q226 112 214 114 Q200 110 186 114 Q174 112 167 96Z"
              fill="#7b5c46"
              stroke="#14224f"
              strokeWidth="2"
            />
            <ellipse cx="187" cy="94" rx="2.6" ry="3.2" fill="#14224f" />
            <ellipse cx="213" cy="94" rx="2.6" ry="3.2" fill="#14224f" />
            <path
              d="M179 86 Q187 81 194 85 M206 85 Q213 81 221 86"
              fill="none"
              stroke="#5b4130"
              strokeWidth="3"
            />
          </g>

          {/* Topi nahkoda */}
          <g strokeLinejoin="round" strokeLinecap="round">
            <path
              d="M160 66 Q158 46 170 41 Q200 33 230 41 Q242 46 240 66 Q200 74 160 66Z"
              fill="#fff"
              stroke="#14224f"
              strokeWidth="2.2"
            />
            <ellipse
              cx="200"
              cy="40"
              rx="42"
              ry="8"
              fill="#fff"
              stroke="#14224f"
              strokeWidth="2.2"
            />
            <path
              d="M160 59 Q200 69 240 59 L241 68 Q200 78 159 68Z"
              fill="#14224f"
            />
            <path
              d="M158 70 Q200 82 242 70 Q240 82 200 85 Q160 82 158 70Z"
              fill="#0c1636"
              stroke="#14224f"
              strokeWidth="1.6"
            />
            <circle
              cx="200"
              cy="53"
              r="7"
              fill="#fff"
              stroke="#14224f"
              strokeWidth="1.6"
            />
            <path
              d="M200 48 V58 M196 51 H204 M195 55 Q200 61 205 55"
              fill="none"
              stroke="#14224f"
              strokeWidth="1.4"
            />
          </g>

          {/* Busa & gelembung */}
          <path
            d="M96 264 Q112 252 130 262 Q148 252 166 264 Q184 256 200 268 Q216 256 234 264 Q252 252 270 262 Q288 252 304 264 Q282 280 250 274 Q226 284 200 278 Q174 284 150 274 Q118 280 96 264Z"
            fill="#d8edfc"
            stroke="#14224f"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Ikan */}
          <use href="#fish" transform="translate(92 214) rotate(-28)" />
          <use href="#fish" transform="translate(128 298) rotate(10)" />
          <use href="#fish" transform="translate(226 306) rotate(-6)" />
          <use
            href="#fish"
            transform="translate(282 292) rotate(18) scale(.85)"
          />
        </svg>

        {/* Floating Persona: Pemilik Kapal */}
        <div className="absolute right-[1%] top-[3%] flex flex-col items-center gap-1 text-center text-[10px] sm:text-xs font-semibold text-ink dark:text-white">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 block" viewBox="0 0 56 56" aria-hidden="true">
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="#DBEAFE"
              stroke="#14224f"
              strokeWidth="2"
            />
            <path
              d="M10 50 Q28 34 46 50 A26 26 0 0 1 10 50Z"
              fill="#14224f"
            />
            <circle
              cx="28"
              cy="28"
              r="10"
              fill="#f2c9a3"
              stroke="#14224f"
              strokeWidth="1.6"
            />
            <path
              d="M16 26 Q16 11 28 11 Q40 11 40 26Z"
              fill="#2563EB"
              stroke="#14224f"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <rect
              x="14"
              y="24"
              width="28"
              height="4"
              rx="2"
              fill="#14224f"
            />
            <circle cx="24.5" cy="30" r="1.2" fill="#14224f" />
            <circle cx="31.5" cy="30" r="1.2" fill="#14224f" />
          </svg>
          <span>Pemilik Kapal</span>
        </div>

        {/* Floating Persona: Petugas Pelabuhan */}
        <div className="absolute right-[1%] top-[48%] flex flex-col items-center gap-1 text-center text-[10px] sm:text-xs font-semibold text-ink dark:text-white">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 block" viewBox="0 0 56 56" aria-hidden="true">
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="#DBEAFE"
              stroke="#14224f"
              strokeWidth="2"
            />
            <path
              d="M10 50 Q28 34 46 50 A26 26 0 0 1 10 50Z"
              fill="#2563EB"
            />
            <circle
              cx="28"
              cy="29"
              r="10"
              fill="#f2c9a3"
              stroke="#14224f"
              strokeWidth="1.6"
            />
            <path
              d="M17 26 Q18 14 28 14 Q38 14 39 26Z"
              fill="#3B82F6"
              stroke="#14224f"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M15 26 H44 Q44 29 41 29 H17 Q14 29 15 26Z"
              fill="#14224f"
            />
            <circle cx="24.5" cy="32" r="1.2" fill="#14224f" />
            <circle cx="31.5" cy="32" r="1.2" fill="#14224f" />
          </svg>
          <span className="leading-tight">
            Petugas
            <br />
            Pelabuhan
          </span>
        </div>

        {/* Floating Persona: Kru Kapal */}
        <div className="absolute left-[3%] top-[60%] flex flex-col items-center gap-1 text-center text-[10px] sm:text-xs font-semibold text-ink dark:text-white">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 block" viewBox="0 0 56 56" aria-hidden="true">
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="#fff"
              stroke="#14224f"
              strokeWidth="2"
            />
            <path
              d="M10 50 Q28 36 46 50 A26 26 0 0 1 10 50Z"
              fill="#14224f"
            />
            <path
              d="M16 34 Q12 10 28 10 Q44 10 40 34 Q36 22 28 22 Q20 22 16 34Z"
              fill="#14224f"
            />
            <circle
              cx="28"
              cy="29"
              r="9.5"
              fill="#f2c9a3"
              stroke="#14224f"
              strokeWidth="1.6"
            />
            <path
              d="M18 26 Q28 14 38 26 Q28 20 18 26Z"
              fill="#14224f"
            />
            <circle cx="24.5" cy="30" r="1.2" fill="#14224f" />
            <circle cx="31.5" cy="30" r="1.2" fill="#14224f" />
            <path
              d="M25 34 Q28 36 31 34"
              fill="none"
              stroke="#14224f"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span>Kru Kapal</span>
        </div>
      </div>

      {/* Slider Indicator & Caption */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <span className="w-6 h-2 rounded-full bg-brand-600 block" />
          <span className="w-2 h-2 rounded-full bg-blue-200 dark:bg-slate-700 block" />
          <span className="w-2 h-2 rounded-full bg-blue-200 dark:bg-slate-700 block" />
        </div>
        <p className="m-0 text-center text-base sm:text-lg lg:text-xl font-bold text-ink dark:text-white max-w-[22ch] leading-snug">
          Pantau tangkapan dan armada lebih mudah
        </p>
      </div>
    </aside>
  );
}
