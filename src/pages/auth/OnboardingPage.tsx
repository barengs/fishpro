import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  LayoutDashboard,
} from "lucide-react";
import { Logo } from "../../components/Logo";
import { ThemeToggle } from "../../components/ThemeToggle";
import { authService, getUserDisplayInfo } from "../../services/auth";
import {
  pillarCards,
  roleCards,
  onboardingFaqs,
} from "./components/onboardingData";

export function OnboardingPage() {
  const [activePillar, setActivePillar] = useState<string>("iot");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isLoggedIn = authService.isAuthenticated();
  const dashboardUrl = authService.getDashboardUrl();
  const userInfo = getUserDisplayInfo();

  const selectedPillar =
    pillarCards.find((p) => p.id === activePillar) || pillarCards[0];

  const handlePrevPillar = () => {
    const currentIndex = pillarCards.findIndex((p) => p.id === activePillar);
    const nextIndex =
      currentIndex <= 0 ? pillarCards.length - 1 : currentIndex - 1;
    setActivePillar(pillarCards[nextIndex].id);
  };

  const handleNextPillar = () => {
    const currentIndex = pillarCards.findIndex((p) => p.id === activePillar);
    const nextIndex =
      currentIndex >= pillarCards.length - 1 ? 0 : currentIndex + 1;
    setActivePillar(pillarCards[nextIndex].id);
  };

  return (
    <div className="min-h-screen flex flex-col surface-page text-strong selection:bg-fco-blue selection:text-white">
      {/* 1. Minimalist Topbar (Inspired by Canva clean header) */}
      <header className="sticky top-0 z-50 surface-card/85 backdrop-blur-md border-b border-fco-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              to="/onboard"
              className="no-underline flex items-center shrink-0"
              aria-label="FISHPRO Beranda"
            >
              <Logo size={32} />
            </Link>

            <nav
              aria-label="Navigasi Utama"
              className="hidden lg:flex items-center gap-1 text-sm font-medium"
            >
              {[
                ["Fitur", "#fitur"],
                ["Pilihan Peran", "#peran"],
                ["Keamanan Data", "#keamanan"],
                ["Tanya Jawab", "#faq"],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="px-3.5 py-2 rounded-xs text-soft hover:text-strong hover:bg-black/4 dark:hover:bg-white/5 transition-colors no-underline font-semibold text-xs uppercase tracking-wider"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <ThemeToggle compact />
            {isLoggedIn ? (
              <Link
                to={dashboardUrl}
                className="h-10 px-4.5 inline-flex items-center gap-2 rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-xs font-bold transition-all shadow-xs no-underline active:scale-[0.99]"
              >
                <LayoutDashboard size={14} />
                <span>Dashboard ({userInfo.name})</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="h-10 px-3.5 sm:px-4 inline-flex items-center rounded-xs border border-fco-border-subtle surface-card hover:surface-page text-xs font-bold text-strong transition-colors no-underline"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="h-10 px-4 sm:px-5 inline-flex items-center rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-xs font-bold transition-all shadow-xs hover:shadow-sm no-underline active:scale-[0.99]"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        {/* 2. Hero Headline Section (Minimalist, High Contrast typography) */}
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-12 text-center flex flex-col items-center">
          <h1 className="m-0 text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-strong max-w-4xl">
            Dari laut, tercatat{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500">
              pasti
            </span>
            .
          </h1>

          <p className="mt-5 mb-8 text-base sm:text-xl text-soft max-w-2xl leading-relaxed font-normal">
            Pantau kapal, catat hasil tangkapan langsung dari timbangan
            pelabuhan, dan simpan catatan resmi yang aman dan transparan.
          </p>

          {/* Call to Action Button */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {isLoggedIn ? (
              <Link
                to={dashboardUrl}
                className="h-12 px-7 rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg no-underline active:scale-[0.99]"
              >
                <LayoutDashboard size={16} />
                <span>Buka Dashboard ({userInfo.roleLabel})</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="h-12 px-7 rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-bold flex items-center justify-center transition-all shadow-md hover:shadow-lg no-underline active:scale-[0.99]"
                >
                  Daftarkan Armada Anda
                </Link>
                <Link
                  to="/login"
                  className="h-12 px-6 rounded-xs border border-fco-border-subtle surface-card hover:surface-page text-strong text-sm font-bold flex items-center justify-center transition-colors no-underline"
                >
                  Eksplorasi Portal
                </Link>
              </>
            )}
          </div>

          {/* Key Quick Counters */}
          <div className="mt-10 pt-8 border-t border-fco-border-subtle w-full max-w-3xl flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-xs font-medium text-soft">
            <div>
              <span className="block text-2xl font-black text-strong tabular-nums font-mono">
                1.280+
              </span>
              <span>Kapal Terdaftar</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">
                100%
              </span>
              <span>Data Terverifikasi</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-fco-blue tabular-nums font-mono">
                94.5%
              </span>
              <span>Ketepatan Kuota AI</span>
            </div>
          </div>
        </section>

        {/* 3. Interactive Visual Carousel / Showcase Cards (Direct Canva-Inspired Layout) */}
        <section
          id="fitur"
          className="w-full py-10 sm:py-14 surface-inset/50 border-y border-fco-border-subtle"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-fco-blue block mb-1">
                  Kemudahan Sistem
                </span>
                <h2 className="m-0 text-xl sm:text-2xl font-extrabold text-strong">
                  Fitur Andalan Layanan
                </h2>
              </div>

              {/* Slider Arrow Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevPillar}
                  aria-label="Pilar sebelumnya"
                  className="w-9 h-9 rounded-xs border border-fco-border-subtle surface-card hover:surface-page text-strong flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextPillar}
                  aria-label="Pilar berikutnya"
                  className="w-9 h-9 rounded-xs border border-fco-border-subtle surface-card hover:surface-page text-strong flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Horizontal Cards Grid matching the Canva Carousel visual */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {pillarCards.map((pillar) => {
                const isSelected = activePillar === pillar.id;
                const IconComponent = pillar.icon;

                return (
                  <div
                    key={pillar.id}
                    onClick={() => setActivePillar(pillar.id)}
                    className={`group cursor-pointer rounded-xs border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                      isSelected
                        ? "border-fco-blue shadow-md ring-2 ring-fco-blue/25 scale-[1.02] surface-card"
                        : "border-fco-border-subtle surface-card hover:border-fco-blue/50 hover:shadow-xs"
                    }`}
                  >
                    {/* Top Graphic Banner with Theme Gradients */}
                    <div
                      className={`h-28 bg-gradient-to-br ${pillar.gradient} p-4 flex flex-col justify-between text-white relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-black/25 backdrop-blur-xs">
                          {pillar.badge}
                        </span>
                        <IconComponent size={18} className="opacity-90" />
                      </div>

                      <div className="z-10">
                        <div className="text-xl font-mono font-black tabular-nums">
                          {pillar.metric}
                        </div>
                        <div className="text-[10px] text-white/80 font-medium">
                          {pillar.metricLabel}
                        </div>
                      </div>

                      {/* Subtle background glow effect */}
                      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-soft uppercase tracking-wider block mb-1">
                          {pillar.category}
                        </span>
                        <h3 className="m-0 text-sm font-bold text-strong group-hover:text-fco-blue transition-colors">
                          {pillar.title}
                        </h3>
                        <p className="m-0 mt-1.5 text-xs text-soft leading-relaxed line-clamp-3">
                          {pillar.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-fco-border-subtle flex items-center justify-between text-2xs">
                        <span className="font-semibold text-fco-blue">
                          {isSelected ? "Sedang Aktif" : "Klik Detail"}
                        </span>
                        <ArrowUpRight
                          size={13}
                          className="text-soft group-hover:text-fco-blue transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Pillar Highlight Bar */}
            <div className="mt-6 p-4 sm:p-5 rounded-xs surface-card border border-fco-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xs bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
                  <selectedPillar.icon size={20} />
                </div>
                <div>
                  <h4 className="m-0 text-sm font-bold text-strong">
                    {selectedPillar.title} · {selectedPillar.category}
                  </h4>
                  <p className="m-0 text-xs text-soft mt-0.5">
                    {selectedPillar.desc}
                  </p>
                </div>
              </div>

              <Link
                to="/register"
                className="h-9 px-4 rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-xs font-bold inline-flex items-center justify-center shrink-0 no-underline transition-colors shadow-2xs"
              >
                Gunakan Fitur Ini
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Portal Berbasis Peran Pengguna (Clean Role Grid) */}
        <section
          id="peran"
          className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-2xs font-bold uppercase tracking-wider text-fco-blue block mb-1">
              Menu Sesuai Kebutuhan
            </span>
            <h2 className="m-0 text-2xl sm:text-4xl font-extrabold text-strong tracking-tight">
              Pilih Halaman Sesuai Peran Anda
            </h2>
            <p className="mt-3 text-sm text-soft leading-relaxed">
              Setiap pengguna punya halaman khusus agar pekerjaan lebih fokus,
              mudah dipantau, dan langsung tepat sasaran.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {roleCards.map((rc) => {
              const RoleIcon = rc.icon;

              return (
                <div
                  key={rc.slug}
                  className="surface-card border border-fco-border-subtle rounded-xs p-6 shadow-2xs flex flex-col justify-between hover:border-fco-blue/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xs bg-blue-500/10 text-fco-blue flex items-center justify-center shrink-0">
                        <RoleIcon size={20} />
                      </div>
                      <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded-xs bg-black/5 dark:bg-white/10 text-soft">
                        {rc.tag}
                      </span>
                    </div>

                    <h3 className="m-0 text-base font-bold text-strong">
                      {rc.title}
                    </h3>
                    <div className="text-xs text-fco-blue font-semibold mt-0.5 mb-2.5">
                      {rc.subtitle}
                    </div>

                    <p className="m-0 text-xs text-soft leading-relaxed mb-4">
                      {rc.summary}
                    </p>

                    <div className="pt-3 border-t border-fco-border-subtle space-y-2 mb-6">
                      {rc.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-2xs text-strong"
                        >
                          <CheckCircle2
                            size={13}
                            className="text-emerald-500 shrink-0 mt-0.5"
                          />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to="/login"
                    className="w-full h-10 rounded-xs border border-fco-border-subtle surface-inset hover:surface-page text-xs font-bold text-fco-blue flex items-center justify-center transition-colors no-underline"
                  >
                    Masuk Sebagai {rc.role}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Keamanan & Imutabilitas Blockchain Section */}
        <section
          id="keamanan"
          className="w-full surface-card border-y border-fco-border-subtle py-16 sm:py-20"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>

            <h2 className="m-0 text-2xl sm:text-3xl font-extrabold text-strong tracking-tight">
              Catatan Aman dan Tidak Bisa Diubah Sepihak
            </h2>

            <p className="mt-3 mb-8 text-sm text-soft max-w-xl leading-relaxed">
              Semua data tangkapan otomatis terkunci dengan teknologi rantai
              data (blockchain). Informasi berat, nama kapal, dan perhitungan
              PNBP tersimpan permanen dan bisa dicek kapan pun.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
              <div className="p-4 rounded-xs border border-fco-border-subtle surface-inset">
                <span className="font-mono text-xs font-bold text-fco-blue block mb-1">
                  01. Otomatis dari Timbangan
                </span>
                <span className="text-xs text-soft">
                  Berat ikan dibaca langsung dari timbangan dermaga tanpa perlu
                  diketik manual.
                </span>
              </div>

              <div className="p-4 rounded-xs border border-fco-border-subtle surface-inset">
                <span className="font-mono text-xs font-bold text-fco-blue block mb-1">
                  02. Terkunci Rapat
                </span>
                <span className="text-xs text-soft">
                  Setiap catatan terhubung ke data sebelumnya sehingga tidak
                  bisa diedit atau dihapus diam-diam.
                </span>
              </div>

              <div className="p-4 rounded-xs border border-fco-border-subtle surface-inset">
                <span className="font-mono text-xs font-bold text-fco-blue block mb-1">
                  03. Terbuka & Jelas
                </span>
                <span className="text-xs text-soft">
                  Petugas dan dinas terkait bisa langsung memeriksa keaslian
                  catatan secara instan.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section
          id="faq"
          className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-20"
        >
          <div className="text-center mb-10">
            <h2 className="m-0 text-2xl sm:text-3xl font-extrabold text-strong tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-2 text-xs text-soft">
              Segala hal yang perlu Anda ketahui mengenai tata kelola FCO
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {onboardingFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="surface-card border border-fco-border-subtle rounded-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-4 text-left bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-sm font-bold text-strong">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={17}
                      className={`text-soft shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-soft leading-relaxed border-t border-fco-border-subtle/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Pre-Footer CTA */}
          <div className="mt-12 text-center p-8 rounded-xs surface-card border border-fco-border-subtle flex flex-col items-center">
            <h3 className="m-0 text-lg font-bold text-strong mb-2">
              {isLoggedIn
                ? "Akses Portal Manajemen Anda"
                : "Siap Mendaftarkan Armada Perikanan Anda?"}
            </h3>
            <p className="m-0 text-xs text-soft max-w-md leading-relaxed mb-5">
              {isLoggedIn
                ? `Anda sedang masuk sebagai ${userInfo.name} (${userInfo.roleLabel}). Buka portal untuk melanjutkan operasional.`
                : "Registrasi cepat 4 tahap dengan perlindungan autentikasi peran resmi. Gratis tanpa biaya awal."}
            </p>
            {isLoggedIn ? (
              <Link
                to={dashboardUrl}
                className="h-11 px-7 rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-all no-underline shadow-xs"
              >
                <LayoutDashboard size={14} />
                <span>Buka Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/register"
                className="h-11 px-7 rounded-xs bg-fco-blue hover:bg-fco-blue-hover text-white text-xs font-bold inline-flex items-center justify-center transition-all no-underline shadow-xs"
              >
                Mulai Pendaftaran Akun
              </Link>
            )}
          </div>
        </section>
      </main>

      {/* 7. Clean Minimalist Footer */}
      <footer className="border-t border-fco-border-subtle surface-card py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-soft">
          <div className="flex items-center gap-3">
            <Logo size={22} />
            <span>© 2026 Kementerian Kelautan dan Perikanan RI</span>
          </div>

          <div className="flex items-center gap-5 font-semibold">
            {isLoggedIn ? (
              <Link
                to={dashboardUrl}
                className="text-fco-blue hover:text-fco-blue-hover no-underline transition-colors font-bold"
              >
                Ke Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-soft hover:text-strong no-underline transition-colors"
                >
                  Masuk Portal
                </Link>
                <Link
                  to="/register"
                  className="text-soft hover:text-strong no-underline transition-colors"
                >
                  Registrasi
                </Link>
              </>
            )}
            <Link
              to="/reset-password"
              className="text-soft hover:text-strong no-underline transition-colors"
            >
              Bantuan Sandi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
