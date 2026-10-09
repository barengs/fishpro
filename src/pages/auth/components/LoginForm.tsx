import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function LoginForm() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = identifier.toLowerCase()
    if (id.includes('admin')) {
      navigate('/admin')
    } else if (id.includes('regulator') || id.includes('was')) {
      navigate('/regulator')
    } else if (id.includes('reg') || id.includes('kapten') || id.includes('nahkoda')) {
      navigate('/captain')
    } else {
      navigate('/owner')
    }
  }

  return (
    <div className="max-w-full w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-fco-dark mb-1.5 tracking-tight">
          Masuk ke FCO
        </h2>
        <p className="text-sm text-fco-muted m-0">
          Gunakan nama pengguna atau nomor registrasi kapal Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
        <div>
          <label htmlFor="login-identifier" className="block text-fco-sm font-semibold text-fco-dark mb-2">
            Nama pengguna atau nomor registrasi
          </label>
          <input
            id="login-identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Contoh: REG-0412 atau admin_kkp"
            className="w-full h-13.5 border border-fco-border text-fco-md rounded-fco px-3.5 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="login-password" className="text-fco-sm font-semibold text-fco-dark">
              Kata sandi
            </label>
            <Link
              to="/reset-password"
              className="text-fco-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
            >
              Lupa kata sandi?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            className="w-full h-13.5 border border-fco-border text-fco-md rounded-fco px-3.5 text-sm text-fco-dark bg-white focus:outline-none focus:border-fco-blue transition-colors"
          />
        </div>

        <button
          type="submit"
          className="h-13.5 rounded-xl text-fco-md border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer mt-2 transition-colors shadow-xs"
        >
          Masuk
        </button>
      </form>

      <div className="mt-7 text-center text-sm text-fco-muted">
        Belum punya akun?{' '}
        <Link
          to="/register"
          className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline"
        >
          Daftar sekarang
        </Link>
      </div>
    </div>
  )
}
