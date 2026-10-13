import { Link } from 'react-router-dom'
import { CenteredAuth } from './components/CenteredAuth'
import { RegisterStepWizard } from './components/RegisterStepWizard'

export function RegisterPage() {
  return (
    <CenteredAuth wide hideBrand>
      <div className="mb-5 sm:mb-7 text-center">
        <h1 className="m-0 text-xl sm:text-2xl font-extrabold tracking-tight">Pendaftaran</h1>
      </div>
      <RegisterStepWizard />
      <p className="m-0 mt-7 text-center text-sm text-soft">
        Sudah terdaftar?{' '}
        <Link to="/login" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
          Masuk
        </Link>
      </p>
    </CenteredAuth>
  )
}
