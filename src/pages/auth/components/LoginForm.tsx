import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, Lock, User } from 'lucide-react'
import { authService } from '../../../services/auth'

export function LoginForm() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim() || !password) {
      setErrorMsg('Harap isi nama pengguna dan kata sandi.')
      return
    }

    setErrorMsg(null)
    setLoading(true)

    try {
      const data = await authService.login({
        username: identifier.trim(),
        password,
      })

      // Navigate based on backend user_as or roles
      const role = data.user_as || (data.roles && data.roles[0]) || 'owner'
      if (role === 'admin') {
        navigate('/admin')
      } else if (role === 'regulator') {
        navigate('/regulator')
      } else if (role === 'captain') {
        navigate('/captain')
      } else {
        navigate('/owner')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal masuk. Periksa kembali nama pengguna dan kata sandi.'
      setErrorMsg(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {errorMsg && (
        <div
          role="alert"
          className="p-3.5 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-500/20"
        >
          {errorMsg}
        </div>
      )}

      <div>
        <label htmlFor="login-identifier" className="block text-sm font-semibold text-strong mb-2">
          Nama pengguna atau nomor registrasi
          <span className="text-red-500 ml-1 font-bold" aria-label="wajib diisi" title="Wajib diisi">*</span>
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
            disabled={loading}
            className="w-full h-12 rounded-xl pl-11 pr-4 text-sm sm:text-fco-md field-input transition-colors"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="login-password" className="text-sm font-semibold text-strong">
            Kata sandi
            <span className="text-red-500 ml-1 font-bold" aria-label="wajib diisi" title="Wajib diisi">*</span>
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
            disabled={loading}
            className="w-full h-12 rounded-xl pl-11 pr-12 text-sm sm:text-fco-md field-input transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-fco-placeholder hover:text-strong hover:surface-page border-none bg-transparent cursor-pointer transition-colors"
          >
            {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
        <span>{loading ? 'Memproses...' : 'Masuk'}</span>
      </button>
    </form>
  )
}
