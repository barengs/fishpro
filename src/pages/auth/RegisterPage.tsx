import { Link } from 'react-router-dom'
import { CenteredAuth } from './components/CenteredAuth'
import { RegisterStepWizard } from './components/RegisterStepWizard'

export function RegisterPage() {
  return (
    <CenteredAuth wide>
      <div className="surface-card border rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="mb-7">
          <h1 className="m-0 mb-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">Buat akun FCO</h1>
          <p className="m-0 text-fco-md text-soft">Empat langkah singkat — formulir menyesuaikan peran yang Anda pilih.</p>
        </div>
        <RegisterStepWizard />
        <p className="m-0 mt-7 text-center text-sm text-soft">
          Sudah terdaftar?{' '}
          <Link to="/login" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
            Masuk
          </Link>
        </p>
      </div>
    </CenteredAuth>
  )
}
