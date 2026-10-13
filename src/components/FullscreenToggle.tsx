import { useEffect, useState } from 'react'
import { Maximize, Minimize } from 'lucide-react'

export function FullscreenToggle({ compact = false }: { compact?: boolean }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else if (document.exitFullscreen) {
        await document.exitFullscreen()
      }
    } catch {
      // Ignored: browser policy or iframe restriction
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      aria-label={isFullscreen ? 'Keluar dari layar penuh' : 'Tampilkan layar penuh'}
      aria-pressed={isFullscreen}
      title={isFullscreen ? 'Layar normal' : 'Layar penuh'}
      className={`${
        compact ? 'w-9 h-9' : 'w-10 h-10'
      } rounded-fco border border-fco-border surface-card hover:surface-page flex items-center justify-center cursor-pointer transition-colors text-strong shrink-0`}
    >
      {isFullscreen ? (
        <Minimize size={compact ? 16 : 18} strokeWidth={2.2} aria-hidden="true" />
      ) : (
        <Maximize size={compact ? 16 : 18} strokeWidth={2.2} aria-hidden="true" />
      )}
    </button>
  )
}
