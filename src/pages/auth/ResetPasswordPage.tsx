import { Link } from 'react-router-dom'
import { CenteredAuth } from './components/CenteredAuth'
import { ResetPasswordWizard } from './components/ResetPasswordWizard'

export function ResetPasswordPage() {
  return (
    <CenteredAuth>
      <div className="bg-white border border-fco-border rounded-3xl p-6 sm:p-10 shadow-sm">
        <ResetPasswordWizard />
        <p className="m-0 mt-7 text-center text-sm text-fco-muted">
          Ingat kata sandi Anda?{' '}
          <Link to="/login" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
            Kembali masuk
          </Link>
        </p>
      </div>
    </CenteredAuth>
  )
}
