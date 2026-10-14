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
    <div className="min-h-screen flex flex-wrap bg-white">
      {/* Left Blue Brand Hero (Minimalis Elegan) */}
      <div className="flex-1 basis-[440px] bg-fco-navy text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute w-[560px] h-[560px] rounded-full border border-white/12 -right-[200px] -bottom-[180px] pointer-events-none" />
        <div className="absolute w-[380px] h-[380px] rounded-full border border-white/12 -right-[110px] -bottom-[90px] pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link to="/onboard" className="no-underline inline-block">
            <Logo size={36} variant="dark" />
          </Link>
        </div>

        {/* Middle: Clean Headline & Simple 1-line checkmarks */}
        <div className="relative z-10 max-w-[440px] my-10">
          <h2 className="text-3xl lg:text-[38px] font-extrabold leading-[1.15] tracking-tight mb-7 text-white">
            Laporan, kuota, dan PNBP di satu tempat.
          </h2>

          <div className="flex flex-col gap-3.5">
            {[
              'Pelaporan tangkapan langsung dari kapal',
              'Prediksi kuota dan PNBP berbasis AI',
              'Data tercatat permanen di blockchain'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm lg:text-[15px] text-[#C9D8F5]">
                <svg
                  className="w-4.5 h-4.5 stroke-[#7FB0FF] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Subtitle footer */}
        <div className="relative z-10 text-[13px] text-[#9FB6E6]">
          Sistem Manajemen Tangkapan Ikan FishPro
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 basis-[500px] flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto bg-white">
        {mode === 'login' && <LoginForm />}
        {mode === 'register' && <RegisterStepWizard />}
        {mode === 'reset-password' && <ResetPasswordWizard />}
      </div>
    </div>
  )
}
