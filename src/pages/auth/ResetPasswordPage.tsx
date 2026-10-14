import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CenteredAuth } from './components/CenteredAuth'
import { ResetPasswordWizard } from './components/ResetPasswordWizard'

export function ResetPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  return (
    <CenteredAuth>
      <div className="surface-card border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
        <ResetPasswordWizard step={step} setStep={setStep} />
        {step !== 4 && (
          <p className="m-0 mt-7 text-center text-sm text-soft">
            Ingat kata sandi Anda?{' '}
            <Link to="/login" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
              Kembali masuk
            </Link>
          </p>
        )}
      </div>
    </CenteredAuth>
  )
}
