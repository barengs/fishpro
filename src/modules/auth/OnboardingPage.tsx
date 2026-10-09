import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'

export function OnboardingPage() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      navigate('/register')
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-fco-bg text-fco-dark">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 sm:px-14 py-7">
        <Link to="/onboard" className="no-underline">
          <Logo />
        </Link>
        <Link
          to="/login"
          className="text-[15px] font-semibold text-fco-muted hover:text-fco-dark no-underline transition-colors"
        >
          Lewati
        </Link>
      </div>

      {/* Main content grid */}
      <div className="flex-1 flex flex-wrap items-center gap-10 sm:gap-14 px-8 sm:px-14 pb-14">
        {/* Left: Text & Step Controls */}
        <div className="flex-1 basis-[420px] max-w-[520px] min-w-0">
          {/* Progress pill bars */}
          <div className="flex gap-2 w-45 mb-7" aria-hidden="true">
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-fco-blue' : 'bg-[#CFE0FA]'}`} />
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-fco-blue' : 'bg-[#CFE0FA]'}`} />
            <div className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-fco-blue' : 'bg-[#CFE0FA]'}`} />
          </div>

          <div className="text-sm font-semibold text-fco-blue mb-3.5">
            Langkah {step} dari 3
          </div>

          {step === 1 && (
            <div className="animate-in fade-in duration-200">
              <h1 className="m-0 mb-4 text-4xl sm:text-[44px] font-extrabold leading-[1.1] tracking-tight text-fco-dark">
                Laporan tangkapan, langsung dari kapal
              </h1>
              <p className="m-0 text-base sm:text-[17px] leading-relaxed text-fco-muted">
                Nahkoda mencatat jenis ikan, jumlah, dan lokasi penangkapan dalam satu formulir. Pemilik kapal dan regulator bisa melihatnya segera.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-200">
              <h1 className="m-0 mb-4 text-4xl sm:text-[44px] font-extrabold leading-[1.1] tracking-tight text-fco-dark">
                Kuota dan PNBP selalu terpantau
              </h1>
              <p className="m-0 text-base sm:text-[17px] leading-relaxed text-fco-muted">
                Lihat sisa kuota tiap kapal dan prediksi PNBP beberapa bulan ke depan, supaya keputusan lebih terukur dan ramah lingkungan.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in duration-200">
              <h1 className="m-0 mb-4 text-4xl sm:text-[44px] font-extrabold leading-[1.1] tracking-tight text-fco-dark">
                Setiap laporan tercatat permanen
              </h1>
              <p className="m-0 text-base sm:text-[17px] leading-relaxed text-fco-muted">
                Laporan dicatat ke blockchain sehingga tidak bisa diubah diam-diam, dan dapat diverifikasi kapan saja oleh regulator dan auditor.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-9 items-center flex-wrap">
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="h-12 px-7 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-[15px] font-semibold cursor-pointer transition-colors shadow-xs"
              >
                Lanjut
              </button>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-fco-blue hover:bg-fco-blue-hover text-white text-[15px] font-semibold no-underline transition-colors shadow-xs"
                >
                  Buat akun
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-12 px-5 rounded-xl bg-transparent hover:bg-fco-blue-light text-fco-blue text-[15px] font-semibold no-underline transition-colors"
                >
                  Saya sudah punya akun
                </Link>
              </>
            )}

            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="h-12 px-5 rounded-xl border border-fco-border bg-white hover:bg-fco-bg text-fco-dark text-[15px] font-semibold cursor-pointer transition-colors"
              >
                Kembali
              </button>
            )}
          </div>
        </div>

        {/* Right: Graphic Card Simulation */}
        <div className="flex-[1.2] basis-[440px] min-w-0 h-[480px] sm:h-[540px] rounded-[28px] bg-fco-blue-light relative overflow-hidden flex items-center justify-center p-6 shadow-xs">
          <div className="absolute w-[520px] h-[520px] rounded-full border border-[#CFE0FA] -right-35 -top-35 pointer-events-none" />
          <div className="absolute w-[360px] h-[360px] rounded-full border border-[#CFE0FA] -left-30 -bottom-30 pointer-events-none" />

          {/* Card Mockup for Step 1 */}
          {step === 1 && (
            <div className="w-[360px] max-w-full bg-white border border-fco-border rounded-[20px] p-6 shadow-2xl shadow-fco-blue/10 relative z-10 animate-in zoom-in-95 duration-200">
              <div className="font-bold text-base mb-4.5 text-fco-dark">Laporan tangkapan</div>
              <div className="text-xs font-semibold text-fco-muted mb-1.5">Tanggal</div>
              <div className="h-10 border border-fco-border rounded-[10px] px-3 flex items-center text-sm mb-3.5 bg-white text-fco-dark">
                09 Okt 2026
              </div>
              <div className="text-xs font-semibold text-fco-muted mb-1.5">Spesies ikan</div>
              <div className="h-10 border border-fco-border rounded-[10px] px-3 flex items-center text-sm mb-3.5 bg-white text-fco-dark">
                Tongkol
              </div>
              <div className="text-xs font-semibold text-fco-muted mb-1.5">Jumlah (kg)</div>
              <div className="h-10 border border-fco-border rounded-[10px] px-3 flex items-center text-sm mb-4.5 bg-white text-fco-dark">
                120
              </div>
              <div className="h-11 rounded-[10px] bg-fco-blue text-white text-sm font-semibold flex items-center justify-center shadow-xs">
                Kirim laporan
              </div>
            </div>
          )}

          {/* Card Mockup for Step 2 */}
          {step === 2 && (
            <div className="w-[380px] max-w-full bg-white border border-fco-border rounded-[20px] p-6 shadow-2xl shadow-fco-blue/10 relative z-10 animate-in zoom-in-95 duration-200">
              <div className="text-[13px] font-semibold text-fco-muted">Sisa kuota tahun ini</div>
              <div className="flex items-baseline gap-1.5 my-1.5 mb-3">
                <span className="text-4xl font-extrabold tracking-tight text-fco-dark">68%</span>
                <span className="text-sm text-fco-muted">dari kuota</span>
              </div>
              <div className="h-2 rounded-full bg-fco-blue-light mb-6 overflow-hidden">
                <div className="w-[68%] h-full rounded-full bg-fco-blue" />
              </div>
              <div className="text-[13px] font-semibold text-fco-muted mb-3">PNBP per bulan dan prediksi</div>
              <div className="flex items-end gap-2.5 h-[110px]">
                <div className="flex-1 h-[50%] rounded-t-md bg-fco-blue" />
                <div className="flex-1 h-[62%] rounded-t-md bg-fco-blue" />
                <div className="flex-1 h-[56%] rounded-t-md bg-fco-blue" />
                <div className="flex-1 h-[74%] rounded-t-md bg-fco-blue" />
                <div className="flex-1 h-[82%] rounded-t-md bg-fco-blue-border" />
                <div className="flex-1 h-[90%] rounded-t-md bg-fco-blue-border" />
              </div>
              <div className="flex gap-4 mt-3.5 text-xs text-fco-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-fco-blue" />
                  Aktual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-fco-blue-border" />
                  Prediksi
                </span>
              </div>
            </div>
          )}

          {/* Card Mockup for Step 3 */}
          {step === 3 && (
            <div className="w-[380px] max-w-full flex flex-col items-stretch relative z-10 animate-in zoom-in-95 duration-200">
              <div className="bg-white border border-fco-border rounded-2xl p-4 sm:px-5 shadow-lg shadow-fco-blue/5">
                <div className="text-xs font-semibold text-fco-muted">Blok 1</div>
                <div className="text-sm font-semibold mt-1 tabular-nums text-fco-dark">a3f9…c21e</div>
              </div>
              <div className="w-0.5 h-5 bg-fco-blue mx-auto" />
              <div className="bg-white border border-fco-border rounded-2xl p-4 sm:px-5 shadow-lg shadow-fco-blue/5">
                <div className="text-xs font-semibold text-fco-muted">Blok 2</div>
                <div className="text-sm font-semibold mt-1 tabular-nums text-fco-dark">7be0…19d4</div>
              </div>
              <div className="w-0.5 h-5 bg-fco-blue mx-auto" />
              <div className="bg-white border-2 border-fco-blue rounded-2xl p-4 sm:px-5 flex items-center justify-between shadow-xl shadow-fco-blue/10">
                <div>
                  <div className="text-xs font-semibold text-fco-muted">Blok 3</div>
                  <div className="text-sm font-semibold mt-1 tabular-nums text-fco-dark">c04d…88a7</div>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-fco-blue">
                  <svg className="w-4.5 h-4.5 stroke-fco-blue" viewBox="0 0 24 24" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7" />
                  </svg>
                  Terverifikasi
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
