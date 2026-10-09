import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { ResetPasswordWizard } from './components/ResetPasswordWizard'

export function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-fco-bg text-fco-dark">
      <header className="bg-white border-b border-fco-border">
        <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
          <Link to="/onboard" className="no-underline">
            <Logo />
          </Link>
          <Link to="/login" className="text-sm font-semibold text-fco-muted hover:text-fco-dark no-underline">
            ← Kembali masuk
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-175 mx-auto px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fco-blue-light text-fco-blue text-sm font-bold mb-5">
            Pemulihan Akses
          </div>
          <h1 className="m-0 mb-3 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Reset kata sandi Anda.
          </h1>
          <p className="m-0 text-lg text-fco-muted leading-relaxed">
            Tiga tahap cepat: minta kode OTP, verifikasi 6 digit, lalu buat sandi baru. Sesi lama otomatis dicabut demi keamanan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { n: '1', t: 'Minta kode', d: 'Email / no. registrasi' },
            { n: '2', t: 'Verifikasi OTP', d: '6 digit · 10 menit' },
            { n: '3', t: 'Sandi baru', d: 'Min. 8 karakter' }
          ].map((s) => (
            <div key={s.n} className="bg-white border border-fco-border rounded-2xl p-5 shadow-xs flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-full bg-fco-blue-light text-fco-blue text-base font-extrabold flex items-center justify-center shrink-0">
                {s.n}
              </span>
              <div>
                <div className="text-fco-md font-bold">{s.t}</div>
                <div className="text-sm text-fco-muted">{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-fco-border rounded-3xl p-8 sm:p-12 shadow-sm mb-8">
          <ResetPasswordWizard />
        </div>

        <div className="p-5 rounded-2xl bg-fco-blue-light/50 border border-fco-blue-border text-fco-md text-fco-dark leading-relaxed flex gap-3">
          <ShieldCheck size={22} className="text-fco-blue shrink-0 mt-0.5" strokeWidth={2} aria-hidden="true" />
          <span>
            Tidak menerima OTP? Periksa folder spam, pastikan nomor terdaftar aktif, atau hubungi admin KKP dengan menyertakan nomor registrasi kapal Anda.
          </span>
        </div>
      </main>

      <footer className="border-t border-fco-border bg-white">
        <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-14 py-6 flex flex-wrap items-center justify-between gap-2 text-sm text-fco-muted">
          <span>© 2026 Kementerian Kelautan dan Perikanan RI · Sistem FCO</span>
          <Link to="/onboard" className="text-fco-muted hover:text-fco-dark no-underline font-semibold">← Kembali beranda</Link>
        </div>
      </footer>
    </div>
  )
}
