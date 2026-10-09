import { useState } from 'react'

interface LoginFormProps {
  onSuccess?: (role: string) => void
  onSwitchToRegister?: () => void
  onForgotPassword?: () => void
}

export function LoginForm({ onSuccess, onSwitchToRegister, onForgotPassword }: LoginFormProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (identifier.toLowerCase().includes('admin')) {
      onSuccess?.('admin')
    } else if (identifier.toLowerCase().includes('reg')) {
      onSuccess?.('nahkoda')
    } else if (identifier.toLowerCase().includes('regulator')) {
      onSuccess?.('regulator')
    } else {
      onSuccess?.('pemilik')
    }
  }

  return (
    <div className="max-w-[420px] w-full mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-[#0F1F3D] mb-1.5 tracking-tight">
          Masuk ke FCO
        </h2>
        <p className="text-sm text-[#5B6B86] m-0">
          Gunakan nama pengguna atau nomor registrasi kapal Anda.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
        <div>
          <label htmlFor="login-identifier" className="block text-[13px] font-semibold text-[#0F1F3D] mb-2">
            Nama pengguna atau nomor registrasi
          </label>
          <input
            id="login-identifier"
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Contoh: REG-0412 atau admin_kkp"
            className="w-full h-11.5 border border-[#DCE6F5] rounded-[10px] px-3.5 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB] transition-colors"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="login-password" className="text-[13px] font-semibold text-[#0F1F3D]">
              Kata sandi
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="bg-transparent border-none text-[13px] font-semibold text-[#1A56DB] hover:text-[#123FA8] cursor-pointer p-0"
            >
              Lupa kata sandi?
            </button>
          </div>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan kata sandi"
            className="w-full h-11.5 border border-[#DCE6F5] rounded-[10px] px-3.5 text-sm text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB] transition-colors"
          />
        </div>

        <button
          type="submit"
          className="h-12 rounded-[10px] border-none bg-[#1A56DB] hover:bg-[#123FA8] text-white text-[15px] font-semibold cursor-pointer mt-2 transition-colors shadow-xs"
        >
          Masuk
        </button>
      </form>

      <div className="mt-7 text-center text-sm text-[#5B6B86]">
        Belum punya akun?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="bg-transparent border-none text-[#1A56DB] hover:text-[#123FA8] font-semibold cursor-pointer p-0"
        >
          Daftar sekarang
        </button>
      </div>
    </div>
  )
}
