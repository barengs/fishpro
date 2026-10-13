import { Link } from 'react-router-dom'
import { CenteredAuth } from './components/CenteredAuth'
import { RegisterStepWizard } from './components/RegisterStepWizard'

export function RegisterPage() {
  return (
    <CenteredAuth wide>
      <div className="surface-card border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="mb-5 sm:mb-6">
          <h1 className="m-0 mb-1 text-xl sm:text-2xl font-extrabold tracking-tight">Buat akun</h1>
          <p className="m-0 text-sm sm:text-fco-md text-soft">Pilih peran dulu — formulir berikutnya menyesuaikan.</p>
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
