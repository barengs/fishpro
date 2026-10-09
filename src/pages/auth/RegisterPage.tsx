import { Link } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { RegisterStepWizard } from './components/RegisterStepWizard'

export function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-fco-bg text-fco-dark">
      <header className="bg-white border-b border-fco-border">
        <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-14 h-20 flex items-center justify-between">
          <Link to="/onboard" className="no-underline">
            <Logo />
          </Link>
          <div className="text-fco-md text-fco-muted">
            Sudah terdaftar?{' '}
            <Link to="/login" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
              Masuk di sini
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-220 mx-auto px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fco-blue-light text-fco-blue text-sm font-bold mb-5">
            Pendaftaran Akun FCO
          </div>
          <h1 className="m-0 mb-3 text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Daftar dalam 4 langkah terpandu.
          </h1>
          <p className="m-0 text-lg text-fco-muted leading-relaxed">
            Formulir menyesuaikan peran Anda — pemilik kapal, nahkoda, atau regulator. Selesaikan berurutan: peran, kredensial, operasional, lalu verifikasi.
          </p>
        </div>

        <div className="bg-white border border-fco-border rounded-3xl p-8 sm:p-12 shadow-sm mb-8">
          <RegisterStepWizard />
        </div>

        <div className="bg-white border border-fco-border rounded-2xl p-6 sm:p-8 shadow-xs">
          <h3 className="m-0 mb-4 text-lg font-bold">Siapkan sebelum mengisi</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-fco-md text-fco-muted leading-relaxed">
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-bold flex items-center justify-center shrink-0">1</span>
              <span><strong className="text-fco-dark">Identitas resmi</strong> — KTP penanggung jawab atau nama perusahaan.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-bold flex items-center justify-center shrink-0">2</span>
              <span><strong className="text-fco-dark">Kontak aktif</strong> — email dan nomor WhatsApp untuk OTP & notifikasi.</span>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-xl bg-fco-blue-light text-fco-blue text-sm font-bold flex items-center justify-center shrink-0">3</span>
              <span><strong className="text-fco-dark">Dokumen operasional</strong> — no. SIPI kapal, lisensi nahkoda, atau NIP pengawas.</span>
            </div>
          </div>
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
