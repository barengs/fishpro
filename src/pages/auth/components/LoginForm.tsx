import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

export function LoginForm() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="login-identifier" className="block text-sm font-semibold text-fco-dark mb-2">
          Nama pengguna atau nomor registrasi
        </label>
        <div className="relative">
          <User size={18} className="text-fco-placeholder absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id="login-identifier"
            type="text"
            required
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="REG-0412 atau admin_kkp"
            className="w-full h-13 border border-fco-border rounded-xl pl-11 pr-4 text-fco-md text-fco-dark bg-white placeholder:text-fco-placeholder focus:outline-none focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/10 transition"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="login-password" className="text-sm font-semibold text-fco-dark">
            Kata sandi
          </label>
          <Link to="/reset-password" className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline">
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative">
          <Lock size={18} className="text-fco-placeholder absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            className="w-full h-13 border border-fco-border rounded-xl pl-11 pr-12 text-fco-md text-fco-dark bg-white placeholder:text-fco-placeholder focus:outline-none focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/10 transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-fco-placeholder hover:text-fco-dark hover:bg-fco-bg border-none bg-transparent cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="h-13 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors"
      >
        Masuk
      </button>
    </form>
  )
}
