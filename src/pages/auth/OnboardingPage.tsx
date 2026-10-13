import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown, ClipboardList, Link2 } from 'lucide-react'
import { Logo } from '../../components/Logo'
import { ThemeToggle } from '../../components/ThemeToggle'

const reportFields = ['Kapal + REG', 'Tanggal', 'Jenis (pelagis/demersal/karang)', 'Lat/Lng GPS', 'WPP', 'Spesies', 'Jumlah (kg)', 'Nilai (Rp)']

const howItWorks = [
  {
    step: 'Lapor',
    who: 'Nahkoda, dari kapal',
    body: '8 kolom, 1 menit, dari HP. Terkirim langsung.'
  },
  {
    step: 'Hitung',
    who: 'Sistem, otomatis',
    body: 'PNBP dihitung dari GT kapal dan harga acuan.'
  },
  {
    step: 'Segel',
    who: 'Blockchain, permanen',
    body: 'Tercatat dan tidak bisa diubah diam-diam.'
  }
]

const roleRows = [
  { name: 'Nahkoda', sees: 'Kuota kapal · form lapor · riwayat', to: '/login' },
  { name: 'Pemilik', sees: 'Armada · nahkoda · sisa kuota · PNBP', to: '/login' },
  { name: 'Regulator', sees: 'Audit kuota · verifikasi · override', to: '/login' },
  { name: 'Admin', sees: 'Master kapal · spesies · WPP · peran', to: '/login' }
]

const faqs = [
  {
    q: 'Bagaimana PNBP dihitung?',
    a: 'Otomatis dari GT kapal dan harga acuan spesies. Nahkoda tidak menghitung manual.'
  },
  {
    q: 'Siapa yang bisa mengubah laporan?',
    a: 'Tidak ada. Koreksi hanya lewat laporan baru yang tercatat terpisah.'
  },
  {
    q: 'Apa yang terjadi saat kuota menipis?',
    a: 'Kapal ditandai di dashboard. Regulator bisa menyesuaikan kuota dengan alasan tercatat.'
  }
]

function ReportMockup() {
  return (
    <div className="surface-card border rounded-3xl shadow-xl overflow-hidden max-w-120 w-full">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-fco-border">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-soft tabular-nums">fco / lapor-tangkapan</span>
        <span className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-fco-blue">
          <Check size={13} strokeWidth={3} aria-hidden="true" /> tersimpan + ter-hash
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-2 gap-2.5 text-sm">
          <div className="field-input border rounded-xl px-3 py-2.5"><span className="text-xs text-soft block">Kapal</span><span className="font-semibold">KM Samudra Jaya · REG-0412</span></div>
          <div className="field-input border rounded-xl px-3 py-2.5"><span className="text-xs text-soft block">Tanggal / WPP</span><span className="font-semibold">09 Okt 2026 · WPP 573</span></div>
          <div className="field-input border rounded-xl px-3 py-2.5"><span className="text-xs text-soft block">Spesies</span><span className="font-semibold">Tongkol · 120 kg</span></div>
          <div className="rounded-xl px-3 py-2.5 bg-fco-blue-light dark:bg-fco-blue/15 border border-fco-blue-border"><span className="text-xs text-soft block">PNBP terhitung</span><span className="font-bold text-fco-blue">Rp 120.000</span></div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5"><span className="font-semibold text-soft">Sisa kuota 2026</span><span className="font-bold tabular-nums">70%</span></div>
          <div className="h-2 rounded-full track-bar overflow-hidden"><div className="h-full w-[70%] rounded-full bg-fco-blue" /></div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-soft tabular-nums">
          <Link2 size={13} className="text-fco-blue" aria-hidden="true" /> blok #2318 · c04d…88a7 · terverifikasi
        </div>
      </div>
    </div>
  )
}

export function OnboardingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="min-h-screen flex flex-col surface-page text-strong">
      <header className="surface-topbar border-b sticky top-0 z-40">
        <div className="max-w-360 mx-auto px-4 sm:px-8 h-16 flex items-center gap-2">
          <Link to="/onboard" className="no-underline" aria-label="FCO beranda"><Logo /></Link>
          <nav aria-label="Navigasi" className="hidden md:flex items-center gap-1 ml-8">
            {[['Cara kerja', '#cara-kerja'], ['Peran', '#peran'], ['FAQ', '#faq']].map(([label, href]) => (
              <a key={href} href={href} className="px-3.5 h-9 inline-flex items-center rounded-fco text-sm font-semibold text-soft hover:text-strong hover-soft no-underline transition-colors">{label}</a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle compact />
            <Link to="/login" className="h-9.5 px-4 inline-flex items-center rounded-fco border border-fco-border surface-card text-sm font-semibold no-underline transition-colors">Masuk</Link>
            <Link to="/register" className="h-9.5 px-4 inline-flex items-center rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold no-underline transition-colors">Daftar</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero: one claim, one visual */}
        <section className="max-w-360 mx-auto px-4 sm:px-8 pt-14 sm:pt-20 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <h1 className="m-0 mb-4 text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.05]">
              Lapor tangkapan sekali, dipercaya semua pihak.
            </h1>
            <p className="m-0 mb-7 text-lg text-soft leading-relaxed max-w-130">
              Nahkoda melapor, sistem menghitung PNBP, blockchain menyegelnya.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link to="/register" className="h-12 px-6 inline-flex items-center rounded-xl bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold no-underline transition-colors">Daftarkan kapal Anda <ArrowRight size={17} className="ml-2" aria-hidden="true" /></Link>
              <Link to="/login" className="h-12 px-6 inline-flex items-center rounded-xl border border-fco-border surface-card font-semibold no-underline transition-colors">Lihat demo masuk</Link>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-soft">
              {[['1.284', 'kapal terdaftar'], ['3.472', 'laporan bulan ini'], ['Rp 4,4 M', 'PNBP terhitung']].map(([v, l]) => (
                <span key={l}><strong className="tabular-nums">{v}</strong> {l}</span>
              ))}
            </div>
          </div>
          <div className="flex justify-center lg:justify-end"><ReportMockup /></div>
        </section>

        {/* Field strip: what a report actually contains */}
        <section className="border-y border-fco-border surface-topbar">
          <div className="max-w-360 mx-auto px-4 sm:px-8 py-5 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold mr-2 inline-flex items-center gap-2"><ClipboardList size={16} className="text-fco-blue" aria-hidden="true" /> Satu laporan berisi:</span>
            {reportFields.map((f) => (
              <span key={f} className="text-xs font-semibold px-2.5 py-1.5 rounded-lg surface-inset border">{f}</span>
            ))}
          </div>
        </section>

        {/* How it works: concrete pipeline */}
        <section id="cara-kerja" className="max-w-360 mx-auto px-4 sm:px-8 py-16 sm:py-20 scroll-mt-20">
          <h2 className="m-0 mb-8 text-2xl sm:text-3xl font-extrabold tracking-tight">Dari kapal ke kas negara.</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {howItWorks.map((s, i) => (
              <article key={s.step} className="surface-card border rounded-2xl p-6 sm:p-7 shadow-xs relative">
                <span className="absolute top-5 right-6 text-5xl font-extrabold text-fco-border dark:text-fco-border-dark tabular-nums select-none" aria-hidden="true">{i + 1}</span>
                <p className="m-0 mb-1 text-xs font-bold uppercase tracking-wider text-fco-blue">{s.step}</p>
                <h3 className="m-0 mb-1 text-lg font-bold">{s.who}</h3>
                <p className="m-0 text-sm leading-relaxed text-soft">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Roles: compact table, not cards */}
        <section id="peran" className="border-y border-fco-border surface-topbar scroll-mt-20">
          <div className="max-w-360 mx-auto px-4 sm:px-8 py-16 sm:py-20">
            <h2 className="m-0 mb-8 text-2xl sm:text-3xl font-extrabold tracking-tight">Masuk sesuai peran.</h2>
            <div className="surface-card border rounded-2xl overflow-hidden">
              {roleRows.map((r, i) => (
                <Link key={r.name} to={r.to} className={`flex flex-wrap items-center gap-2 sm:gap-4 px-5 sm:px-7 py-4 sm:py-5 no-underline hover:surface-page transition-colors ${i > 0 ? 'border-t border-fco-border' : ''}`}>
                  <strong className="w-28 shrink-0">{r.name}</strong>
                  <span className="text-sm text-soft flex-1 min-w-52">{r.sees}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-fco-blue">Masuk <ArrowRight size={15} aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-220 mx-auto px-4 sm:px-8 py-16 sm:py-20 scroll-mt-20">
          <h2 className="m-0 mb-8 text-2xl sm:text-3xl font-extrabold tracking-tight text-center">Pertanyaan umum.</h2>
          <div className="flex flex-col gap-2.5">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <div key={f.q} className="surface-card border rounded-2xl overflow-hidden">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center gap-3 px-5 sm:px-6 py-4 text-left bg-transparent border-none cursor-pointer">
                    <span className="font-bold flex-1">{f.q}</span>
                    <ChevronDown size={18} className={`text-soft shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  {isOpen && <p className="m-0 px-5 sm:px-6 pb-5 text-sm leading-relaxed text-soft">{f.a}</p>}
                </div>
              )
            })}
          </div>
          <div className="mt-10 text-center">
            <Link to="/register" className="h-12 px-8 inline-flex items-center rounded-xl bg-fco-blue hover:bg-fco-blue-hover text-white font-semibold no-underline transition-colors">Mulai mendaftarkan armada <ArrowRight size={17} className="ml-2" aria-hidden="true" /></Link>
            <p className="m-0 mt-3 text-sm text-soft">4 langkah · lisensi / SIPI / NIP siap · gratis</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-fco-border">
        <div className="max-w-360 mx-auto px-4 sm:px-8 py-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-soft">
          <Logo />
          <span className="ml-auto">© 2026 Kementerian Kelautan dan Perikanan RI</span>
          <Link to="/login" className="font-semibold no-underline text-soft hover:text-strong">Masuk</Link>
          <Link to="/reset-password" className="font-semibold no-underline text-soft hover:text-strong">Bantuan akun</Link>
        </div>
      </footer>
    </div>
  )
}
