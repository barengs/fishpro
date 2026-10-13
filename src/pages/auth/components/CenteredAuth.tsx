import { Link } from 'react-router-dom'
import { Logo } from '../../../components/Logo'

interface CenteredAuthProps {
  children: React.ReactNode
  wide?: boolean
  register?: boolean
  hideBrand?: boolean
}

export function CenteredAuth({ children, wide = false, register = false, hideBrand = false }: CenteredAuthProps) {
  return (
    <div className="min-h-screen flex flex-col surface-page text-strong">
      <header className="surface-topbar border-b sticky top-0 z-40">
        <div className="max-w-360 mx-auto px-4 sm:px-8 h-16 flex items-center gap-2">
          {!hideBrand && (
            <Link to="/onboard" className="no-underline" aria-label="Kembali beranda">
              <Logo />
            </Link>
          )}
          <nav aria-label="Navigasi" className="flex items-center gap-1 ml-auto">
            <Link to="/onboard" className="h-9.5 px-4 inline-flex items-center rounded-fco text-sm font-semibold text-soft hover:text-strong no-underline">
              Beranda
            </Link>
            <Link to="/login" className="h-9.5 px-4 inline-flex items-center rounded-fco text-sm font-semibold text-soft hover:text-strong no-underline">
              Masuk
            </Link>
            <Link to="/register" className="h-9.5 px-4 inline-flex items-center rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold no-underline transition-colors">
              Daftar
            </Link>
          </nav>
        </div>
      </header>

      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16 ${register ? 'max-w-160' : wide ? 'max-w-220' : 'max-w-135'}`}>
        {children}
      </main>

      <footer className="pb-8 text-center text-xs text-fco-placeholder">
        © 2026 Kementerian Kelautan dan Perikanan RI
      </footer>
    </div>
  )
}
