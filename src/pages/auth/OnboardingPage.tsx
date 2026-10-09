import { Link } from 'react-router-dom'
import { BarChart3, Check, ClipboardList, Link2, ShieldCheck, Ship, Wallet } from 'lucide-react'
import { Logo } from '../../components/Logo'

const navLinks = [
  { label: 'Fitur', href: '#fitur' },
  { label: 'Alur Kerja', href: '#alur' },
  { label: 'Peran', href: '#peran' },
  { label: 'Keamanan', href: '#keamanan' }
]

const features = [
  {
    title: 'Pelaporan Tangkapan Digital',
    desc: 'Nahkoda mencatat spesies, volume, koordinat, dan WPP langsung dari kapal melalui formulir mobile-friendly. Data terstruktur otomatis masuk ke laporan resmi KKP.',
    Icon: ClipboardList
  },
  {
    title: 'Kuota Berbasis AI',
    desc: 'Model LSTM membaca tren historis tangkapan, lalu NSGA-III mengoptimasi rekomendasi kuota dengan mempertimbangkan keberlanjutan stok dan musim penangkapan.',
    Icon: BarChart3
  },
  {
    title: 'PNBP Otomatis & Transparan',
    desc: 'Tarif dihitung dari GT kapal dan harga acuan resmi. Setiap detail tangkapan menghasilkan nilai PNKP dan PNBP yang dapat diaudit per transaksi.',
    Icon: Wallet
  },
  {
    title: 'Ledger Blockchain Immutabel',
    desc: 'Setiap laporan di-hash SHA-256 dan dirangkai ke blok sebelumnya. Regulator memverifikasi integritas rantai kapan saja tanpa bergantung pada satu server.',
    Icon: Link2
  },
  {
    title: 'Manajemen Armada & Awak',
    desc: 'Pemilik mengelola kapal, menunjuk nahkoda, dan memantau sisa kuota per armada. Satu kapal tanpa nahkoda otomatis ditandai agar tidak bisa melapor.',
    Icon: Ship
  },
  {
    title: 'Pengawasan Regulator',
    desc: 'Pengawas KKP mengaudit kepatuhan WPP, memverifikasi blockchain, dan melakukan override kuota manual dengan jejak alasan yang tercatat.',
    Icon: ShieldCheck
  }
]

const steps = [
  {
    num: '01',
    title: 'Nahkoda melapor dari kapal',
    desc: 'Isi tanggal, jenis penangkapan, lokasi GPS, WPP, spesies, dan volume. Laporan terkirim dalam hitungan detik dan langsung menghitung estimasi PNBP.'
  },
  {
    num: '02',
    title: 'Sistem mencatat & menghitung',
    desc: 'Backend menyimpan laporan, menghitung tarif PNBP dari GT kapal, lalu menulis transaksi ke blockchain dengan hash yang saling terhubung.'
  },
  {
    num: '03',
    title: 'Pemilik memantau armada',
    desc: 'Dashboard pemilik menampilkan sisa kuota per kapal, prediksi PNBP 3 bulan ke depan, dan rekomendasi AI seperti penunjukan nahkoda atau pengajuan kuota.'
  },
  {
    num: '04',
    title: 'Regulator mengawasi & menyesuaikan',
    desc: 'Regulator memverifikasi rantai blok, meninjau kepatuhan WPP, dan menyesuaikan kuota manual bila rekomendasi AI menunjukkan kebutuhan penyesuaian.'
  }
]

const roles = [
  {
    name: 'Nahkoda',
    tag: 'Operasional Lapangan',
    desc: 'Fokus pada satu hal: melapor cepat dan akurat. Kartu sisa kuota, detail kapal, dan riwayat laporan selalu terlihat sebelum mengirim laporan baru.',
    cta: 'Masuk sebagai Nahkoda',
    to: '/login'
  },
  {
    name: 'Pemilik Kapal',
    tag: 'Manajemen Armada',
    desc: 'Kelola seluruh kapal, pantau nahkoda, sisa kuota gabungan, dan proyeksi PNBP. Terima rekomendasi AI untuk keputusan bisnis armada.',
    cta: 'Masuk sebagai Pemilik',
    to: '/login'
  },
  {
    name: 'Regulator KKP',
    tag: 'Pengawasan & Audit',
    desc: 'Audit kuota nasional, verifikasi blockchain, pantau kepatuhan WPP, dan lakukan override kuota manual dengan alasan yang terdokumentasi.',
    cta: 'Masuk sebagai Regulator',
    to: '/login'
  },
  {
    name: 'Admin KKP',
    tag: 'Administrasi Nasional',
    desc: 'Kelola master kapal, spesies, WPP, peran pengguna, dan menu navigasi. Pantau ringkasan nasional tangkapan dan PNBP seluruh Indonesia.',
    cta: 'Masuk sebagai Admin',
    to: '/login'
  }
]

const stats = [
  { value: '1.284', label: 'Kapal aktif terdaftar' },
  { value: '3.472', label: 'Laporan bulan berjalan' },
  { value: '842 ton', label: 'Total tangkapan tercatat' },
  { value: 'Rp 4,4 M', label: 'PNBP terhitung otomatis' }
]

export function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col surface-page text-strong">
      {/* ── Navbar ── */}
      <header className="surface-topbar border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 min-h-18 flex flex-wrap items-center justify-between gap-3">
          <Link to="/onboard" className="no-underline">
            <Logo />
          </Link>

          <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 h-10 inline-flex items-center rounded-fco text-sm font-semibold text-soft hover:text-strong hover:surface-page no-underline transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="h-10 px-4 inline-flex items-center rounded-fco border border-fco-border bg-white hover:surface-page text-strong text-sm font-semibold no-underline transition-colors"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="h-10 px-4 inline-flex items-center rounded-fco border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold no-underline transition-colors shadow-xs"
            >
              Buat Akun
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="bg-fco-navy text-white relative overflow-hidden">
          <div className="absolute w-140 h-140 rounded-full border border-white/10 -right-50 -top-30 pointer-events-none" />
          <div className="absolute w-95 h-95 rounded-full border border-white/10 right-20 -bottom-45 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 sm:py-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-fco-mist text-xs font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-fco-sky animate-pulse" />
                Sistem Manajemen Tangkapan Ikan Nasional
              </div>
              <h1 className="m-0 mb-5 text-4xl sm:text-fco-display font-extrabold leading-fco-tight tracking-tight text-white">
                Laporan tangkapan, kuota, dan PNBP dalam satu ekosistem transparan.
              </h1>
              <p className="m-0 mb-8 text-base sm:text-fco-lg leading-relaxed text-fco-pale max-w-130">
                FCO menghubungkan nahkoda, pemilik kapal, dan regulator KKP: pelaporan digital dari kapal, perhitungan PNBP otomatis, prediksi kuota AI, dan pencatatan blockchain yang tidak dapat dimanipulasi.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="h-12 px-7 inline-flex items-center rounded-xl bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold no-underline transition-colors shadow-xs"
                >
                  Mulai Mendaftar
                </Link>
                <Link
                  to="/login"
                  className="h-12 px-7 inline-flex items-center rounded-xl bg-white/10 hover:bg-white/20 text-white text-fco-md font-semibold no-underline transition-colors"
                >
                  Masuk ke Dashboard
                </Link>
              </div>
            </div>

            {/* Hero mockup: laporan + kuota */}
            <div className="bg-white rounded-fco-lg p-6 shadow-2xl relative z-10 max-w-120 w-full mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-base text-strong">Laporan tangkapan</div>
                <span className="inline-flex items-center gap-1.5 h-6.5 px-2.5 rounded-full bg-fco-blue-light text-fco-blue text-xs font-bold">
                  <Check size={14} className="text-fco-blue" strokeWidth={2.6} aria-hidden="true" />
                  Tercatat Blockchain
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-xs font-semibold text-soft mb-1.5">KM Samudra Jaya · REG-0412</div>
                  <div className="h-10 border border-fco-border rounded-fco px-3 flex items-center text-sm text-strong">Tongkol · 120 kg</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-soft mb-1.5">WPP 573 · PNBP</div>
                  <div className="h-10 border border-fco-border rounded-fco px-3 flex items-center text-sm font-semibold text-fco-blue">Rp 120.000</div>
                </div>
              </div>
              <div className="text-fco-sm font-semibold text-soft mb-2">Sisa kuota 2026 · 70%</div>
              <div className="h-2 rounded-full bg-fco-blue-light overflow-hidden mb-5">
                <div className="h-full rounded-full bg-fco-blue" style={{ width: '70%' }} />
              </div>
              <div className="h-11 rounded-fco bg-fco-blue text-white text-sm font-semibold flex items-center justify-center">
                Kirim laporan berikutnya
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative z-10 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold tabular-nums text-white">{s.value}</div>
                  <div className="text-xs text-fco-pale mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Fitur ── */}
        <section id="fitur" className="max-w-7xl mx-auto px-6 sm:px-10 py-16 scroll-mt-20">
          <div className="max-w-130 mb-10">
            <div className="text-sm font-semibold text-fco-blue mb-2">Fitur Utama</div>
            <h2 className="m-0 mb-3 text-3xl font-extrabold tracking-tight">Semua kebutuhan perikanan dalam satu platform.</h2>
            <p className="m-0 text-fco-md text-soft leading-relaxed">
              Dari pencatatan di atas kapal hingga audit nasional — setiap peran mendapat alat yang dirancang khusus untuk pekerjaannya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <article key={f.title} className="surface-card border rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 rounded-xl bg-fco-blue-light flex items-center justify-center mb-4">
                  <f.Icon size={22} className="text-fco-blue" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <h3 className="m-0 mb-2 text-base font-bold">{f.title}</h3>
                <p className="m-0 text-sm leading-relaxed text-soft">{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Alur Kerja ── */}
        <section id="alur" className="surface-card border-y scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
            <div className="max-w-130 mb-10">
              <div className="text-sm font-semibold text-fco-blue mb-2">Alur Kerja</div>
              <h2 className="m-0 mb-3 text-3xl font-extrabold tracking-tight">Dari kapal hingga kebijakan nasional.</h2>
              <p className="m-0 text-fco-md text-soft leading-relaxed">
                Empat langkah yang menghubungkan seluruh rantai pelaporan perikanan Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map((s) => (
                <article key={s.num} className="surface-inset border rounded-2xl p-6 relative overflow-hidden">
                  <div className="text-4xl font-extrabold text-fco-ice mb-4 tabular-nums">{s.num}</div>
                  <h3 className="m-0 mb-2 text-base font-bold">{s.title}</h3>
                  <p className="m-0 text-sm leading-relaxed text-soft">{s.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Peran ── */}
        <section id="peran" className="max-w-7xl mx-auto px-6 sm:px-10 py-16 scroll-mt-20">
          <div className="max-w-130 mb-10">
            <div className="text-sm font-semibold text-fco-blue mb-2">Akses Peran</div>
            <h2 className="m-0 mb-3 text-3xl font-extrabold tracking-tight">Dashboard untuk setiap peran.</h2>
            <p className="m-0 text-fco-md text-soft leading-relaxed">
              Masuk sesuai peran Anda — setiap dashboard menampilkan data dan aksi yang relevan dengan tanggung jawabnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((r) => (
              <article key={r.name} className="surface-card border rounded-2xl p-7 shadow-xs flex flex-col">
                <div className="inline-flex self-start px-2.5 py-1 rounded-md bg-fco-blue-light text-fco-blue text-xs font-bold mb-3">
                  {r.tag}
                </div>
                <h3 className="m-0 mb-2 text-xl font-extrabold">{r.name}</h3>
                <p className="m-0 mb-6 text-sm leading-relaxed text-soft flex-1">{r.desc}</p>
                <Link
                  to={r.to}
                  className="inline-flex items-center justify-center h-11 rounded-fco bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold no-underline transition-colors"
                >
                  {r.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* ── Keamanan / CTA ── */}
        <section id="keamanan" className="max-w-7xl mx-auto px-6 sm:px-10 pb-16 scroll-mt-20">
          <div className="bg-fco-blue rounded-fco-lg p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute w-80 h-80 rounded-full border border-white/20 -right-25 -top-30 pointer-events-none" />
            <div className="absolute w-50 h-50 rounded-full border border-white/20 right-10 -bottom-22.5 pointer-events-none" />

            <div className="relative z-10 max-w-130">
              <h2 className="m-0 mb-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Data perikanan yang tidak dapat dimanipulasi.
              </h2>
              <p className="m-0 mb-7 text-fco-md text-fco-mist leading-relaxed">
                Setiap laporan di-hash dan dirangkai secara kriptografis. Regulator, auditor, dan pemilik kapal dapat memverifikasi keaslian data kapan saja — membangun kepercayaan publik terhadap pengelolaan sumber daya laut.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="h-12 px-7 inline-flex items-center rounded-xl bg-white hover:bg-fco-blue-light text-fco-blue text-fco-md font-semibold no-underline transition-colors"
                >
                  Daftarkan Akun Anda
                </Link>
                <Link
                  to="/login"
                  className="h-12 px-7 inline-flex items-center rounded-xl bg-white/15 hover:bg-white/25 text-white text-fco-md font-semibold no-underline transition-colors"
                >
                  Sudah punya akun? Masuk
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-fco-dark text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo variant="dark" />
            <p className="mt-4 mb-0 text-sm leading-relaxed text-fco-pale max-w-105">
              Fish Chain Optima (FCO) — ekosistem manajemen tangkapan ikan nasional yang transparan: pelaporan digital, kuota AI, PNBP otomatis, dan ledger blockchain.
            </p>
          </div>

          <nav aria-label="Tautan platform">
            <div className="text-sm font-bold mb-3">Platform</div>
            <div className="flex flex-col gap-2">
              <a href="#fitur" className="text-sm text-fco-pale hover:text-white no-underline">Fitur</a>
              <a href="#alur" className="text-sm text-fco-pale hover:text-white no-underline">Alur Kerja</a>
              <a href="#peran" className="text-sm text-fco-pale hover:text-white no-underline">Akses Peran</a>
              <a href="#keamanan" className="text-sm text-fco-pale hover:text-white no-underline">Keamanan Data</a>
            </div>
          </nav>

          <nav aria-label="Tautan akun">
            <div className="text-sm font-bold mb-3">Akun</div>
            <div className="flex flex-col gap-2">
              <Link to="/login" className="text-sm text-fco-pale hover:text-white no-underline">Masuk</Link>
              <Link to="/register" className="text-sm text-fco-pale hover:text-white no-underline">Daftar Akun</Link>
              <Link to="/reset-password" className="text-sm text-fco-pale hover:text-white no-underline">Reset Kata Sandi</Link>
              <Link to="/onboard" className="text-sm text-fco-pale hover:text-white no-underline">Tentang FCO</Link>
            </div>
          </nav>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5 flex flex-wrap items-center justify-between gap-2 text-xs text-fco-faint">
            <span>© 2026 Kementerian Kelautan dan Perikanan Republik Indonesia.</span>
            <span>Sistem Manajemen Tangkapan Ikan FCO</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
