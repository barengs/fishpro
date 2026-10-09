interface LogoProps {
  size?: number
  variant?: 'light' | 'dark'
}

export function Logo({ size = 36, variant = 'light' }: LogoProps) {
  const isDark = variant === 'dark'
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`flex items-center justify-center rounded-fco shrink-0 ${
          isDark ? 'bg-white' : 'bg-fco-blue'
        }`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <svg
          width={Math.round(size * 0.55)}
          height={Math.round(size * 0.55)}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDark ? '#0F2A63' : '#FFFFFF'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 9c3-3 5-3 8 0s5 3 8 0M2 15c3-3 5-3 8 0s5 3 8 0" />
        </svg>
      </div>
      <span
        className={`font-extrabold text-xl tracking-tight ${
          isDark ? 'text-white' : 'text-fco-dark'
        }`}
      >
        FCO
      </span>
    </div>
  )
}
