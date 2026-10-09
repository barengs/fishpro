import { Link } from 'react-router-dom'
import { CenteredAuth } from './components/CenteredAuth'
import { LoginForm } from './components/LoginForm'

export function LoginPage() {
  return (
    <CenteredAuth>
      <div className="bg-white border border-fco-border rounded-3xl p-6 sm:p-10 shadow-sm">
        <div className="mb-7">
          <h1 className="m-0 mb-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">Masuk ke FCO</h1>
          <p className="m-0 text-fco-md text-fco-muted">Gunakan username atau nomor registrasi kapal Anda.</p>
        </div>
        <LoginForm />
        <p className="m-0 mt-7 text-center text-sm text-fco-muted">
          Belum punya akun?{' '}
          <Link to="/register" className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline">
            Daftar
          </Link>
        </p>
      </div>
    </CenteredAuth>
  )
}
