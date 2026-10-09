import { Link } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { LoginForm } from './components/LoginForm'

const roleHints = [
  { k: 'Nahkoda — REG-....', v: 'Langsung ke dashboard operasional kapal' },
  { k: 'Pemilik Kapal', v: 'Pantau armada, kuota & PNBP' },
  { k: 'Regulator / Admin', v: 'Audit nasional & verifikasi blockchain' }
]

export function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-fco-bg text-fco-dark">
      <header className="bg-white border-b border-fco-border">
        <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
          <Link to="/onboard" className="no-underline">
            <Logo />
          </Link>
          <Link to="/onboard" className="text-sm font-semibold text-fco-muted hover:text-fco-dark no-underline">
            ← Kembali beranda
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-175 mx-auto px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fco-blue-light text-fco-blue text-sm font-bold mb-5">
            <span className="w-2 h-2 rounded-full bg-fco-blue animate-pulse" />
            Masuk ke Akun FCO
          </div>
          <h1 className="m-0 mb-3 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Selamat datang kembali.
          </h1>
          <p className="m-0 text-lg text-fco-muted leading-relaxed">
            Masuk dengan username atau nomor registrasi kapal — Anda langsung diarahkan ke dashboard peran Anda.
          </p>
        </div>

        <div className="bg-white border border-fco-border rounded-3xl p-8 sm:p-12 shadow-sm mb-8">
          <LoginForm />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roleHints.map((r) => (
            <div key={r.k} className="bg-white border border-fco-border rounded-2xl p-5 shadow-xs">
              <div className="text-sm font-bold">{r.k}</div>
              <div className="text-sm text-fco-muted mt-1 leading-relaxed">{r.v}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-fco-border bg-white">
        <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-14 py-6 flex flex-wrap items-center justify-between gap-2 text-sm text-fco-muted">
          <span>© 2026 Kementerian Kelautan dan Perikanan RI · Sistem FCO</span>
          <div className="flex items-center gap-4">
            <Link to="/register" className="text-fco-muted hover:text-fco-dark no-underline font-semibold">Daftar akun</Link>
            <Link to="/reset-password" className="text-fco-muted hover:text-fco-dark no-underline font-semibold">Lupa sandi</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
