import { Link } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { LoginForm } from './components/LoginForm'
import { RegisterStepWizard } from './components/RegisterStepWizard'
import { ResetPasswordWizard } from './components/ResetPasswordWizard'

export type AuthMode = 'login' | 'register' | 'reset-password'

interface AuthPageProps {
  mode: AuthMode
}

export function AuthPage({ mode }: AuthPageProps) {
  return (
    <div className="min-h-screen flex flex-wrap bg-[#F6F9FE]">
      {/* Left Blue Brand Hero */}
      <div className="flex-1 basis-[440px] bg-[#0F2A63] text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute w-[560px] h-[560px] rounded-full border border-white/12 -right-[200px] -bottom-[180px] pointer-events-none" />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-white/12 -right-[100px] -bottom-[90px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/onboard" className="no-underline">
              <Logo size={42} variant="dark" />
            </Link>
            <Link
              to="/onboard"
              className="text-xs font-semibold text-[#BCD3F8] hover:text-white bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg no-underline transition-colors"
            >
              Lihat Onboarding
            </Link>
          </div>
          <div className="mt-12 max-w-[420px]">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight mb-4 text-white">
              Ekosistem Manajemen Tangkapan Ikan Cerdas & Transparan
            </h1>
            <p className="text-[15px] text-[#D6E4FF] leading-relaxed m-0">
              Pencatatan hasil laut otomatis terverifikasi ledger blockchain, audit kepatuhan kuota, dan optimalisasi PNBP nasional.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3.5 my-8">
          {[
            { title: 'Immutabilitas Ledger Blockchain', desc: 'Setiap laporan penangkapan tersimpan secara permanen dan bebas manipulasi.' },
            { title: 'Perhitungan Otomatis PNBP', desc: 'Tarif dihitung langsung berdasarkan GT kapal dan indeks harga acuan resmi.' },
            { title: 'Prediksi Kuota AI (LSTM + NSGA-III)', desc: 'Rekomendasi kuota optimal berbasis tren musim penangkapan dan data historis.' }
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-5.5 h-5.5 rounded-md bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-3.5 h-3.5 stroke-white" viewBox="0 0 24 24" fill="none" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-white">{item.title}</div>
                <div className="text-xs text-[#BCD3F8]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-xs text-[#7D9CD6]">
          © 2026 Kementerian Kelautan dan Perikanan Republik Indonesia.
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 basis-[500px] flex items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {mode === 'login' && <LoginForm />}
        {mode === 'register' && <RegisterStepWizard />}
        {mode === 'reset-password' && <ResetPasswordWizard />}
      </div>
    </div>
  )
}
