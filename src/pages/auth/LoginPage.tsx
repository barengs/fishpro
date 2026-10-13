import { Link } from 'react-router-dom'
import { CenteredAuth } from './components/CenteredAuth'
import { LoginForm } from './components/LoginForm'

export function LoginPage() {
  return (
    <CenteredAuth>
      <div className="surface-card border rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="mb-5 sm:mb-6 text-center">
          <h1 className="m-0 mb-1 text-xl sm:text-2xl font-extrabold tracking-tight">Masuk</h1>
          <p className="m-0 text-sm sm:text-fco-md text-soft">Gunakan username atau nomor registrasi kapal Anda.</p>
        </div>
        <LoginForm />
        <p className="m-0 mt-7 text-center text-sm text-soft">
          Belum punya akun?{' '}
          <Link to="/register" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
            Daftar
          </Link>
        </p>
      </div>
    </CenteredAuth>
  )
}
