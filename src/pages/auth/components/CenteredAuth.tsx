import { Link } from 'react-router-dom'
import { Logo } from '../../../components/Logo'

interface CenteredAuthProps {
  children: React.ReactNode
  wide?: boolean
}

export function CenteredAuth({ children, wide = false }: CenteredAuthProps) {
  return (
    <div className="min-h-screen flex flex-col surface-page text-strong">
      <header className="py-6 flex justify-center">
        <Link to="/onboard" className="no-underline" aria-label="Kembali beranda">
          <Logo />
        </Link>
      </header>

      <main className={`flex-1 w-full mx-auto px-4 sm:px-6 pb-16 ${wide ? 'max-w-220' : 'max-w-135'}`}>
        {children}
      </main>

      <footer className="pb-8 text-center text-xs text-fco-placeholder">
        © 2026 Kementerian Kelautan dan Perikanan RI
      </footer>
    </div>
  )
}
