import { Waves } from 'lucide-react'

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
        <Waves size={Math.round(size * 0.55)} color={isDark ? '#0F2A63' : '#FFFFFF'} strokeWidth={2} aria-hidden="true" />
      </div>
      <span
        className={`font-extrabold text-xl tracking-tight ${
          isDark ? 'text-white' : 'text-strong'
        }`}
      >
        FCO
      </span>
    </div>
  )
}
