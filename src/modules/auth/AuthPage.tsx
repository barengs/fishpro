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
      <div className="flex-1 basis-110 bg-fco-navy text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute w-140 h-140 rounded-full border border-white/12 -right-50 -bottom-45 pointer-events-none" />
        <div className="absolute w-95 h-95 rounded-full border border-white/12 -right-27.5 -bottom-22.5 pointer-events-none" />

        {/* Top: Logo */}
        <div className="relative z-10">
          <Link to="/onboard" className="no-underline inline-block">
            <Logo size={36} variant="dark" />
          </Link>
        </div>

        {/* Middle: Clean Headline & Simple 1-line checkmarks */}
        <div className="relative z-10 max-w-110 my-10">
          <h2 className="text-3xl lg:text-fco-hero font-extrabold leading-fco-snug tracking-tight mb-7 text-white">
            Laporan, kuota, dan PNBP di satu tempat.
          </h2>

          <div className="flex flex-col gap-3.5">
            {[
              'Pelaporan tangkapan langsung dari kapal',
              'Prediksi kuota dan PNBP berbasis AI',
              'Data tercatat permanen di blockchain'
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-sm lg:text-fco-md text-fco-pale">
                <svg
                  className="w-4.5 h-4.5 stroke-fco-sky shrink-0"
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
        <div className="relative z-10 text-fco-sm text-fco-faint">
          Sistem Manajemen Tangkapan Ikan FCO
        </div>
      </div>

      {/* Right Form Area */}
      <div className="flex-1 basis-125 flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto bg-white">
        {mode === 'login' && <LoginForm />}
        {mode === 'register' && <RegisterStepWizard />}
        {mode === 'reset-password' && <ResetPasswordWizard />}
      </div>
    </div>
  )
}
