interface LogoProps {
  size?: number
  variant?: 'light' | 'dark'
}

export function Logo({ size = 36, variant = 'light' }: LogoProps) {
  const isDark = variant === 'dark'
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/logo.png"
        alt="FishPro logo"
        className="shrink-0 object-cover"
        style={{ width: `${size}px`, height: `${size}px` }}
      />
      <span
        className={`font-extrabold text-xl tracking-tight ${
          isDark ? 'text-white' : 'text-fco-dark'
        }`}
      >
        FishPro
      </span>
    </div>
  )
}
