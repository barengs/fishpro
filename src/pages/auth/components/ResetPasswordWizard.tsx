import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function ResetPasswordWizard() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier) {
      setError('Masukkan email atau no. registrasi')
      return
    }
    setError(null)
    setStep(2)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.join('').length < 6) {
      setError('Masukkan 6 digit kode OTP verifikasi')
      return
    }
    setError(null)
    setStep(3)
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      setError('Kata sandi baru minimal 8 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok')
      return
    }
    setError(null)
    setStep(4)
  }

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1)
    const nextOtp = [...otp]
    nextOtp[index] = val
    setOtp(nextOtp)
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  return (
    <div className="max-w-full w-full">
      <div className="bg-white border border-fco-border rounded-3xl p-8 sm:p-10 shadow-sm">
        {error && (
          <div className="p-3 px-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-200">
            ⚠ {error}
          </div>
        )}

        {/* STEP 1: REQUEST EMAIL/REG */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-fco-dark mb-1.5 tracking-tight">
                Reset Kata Sandi
              </h2>
              <p className="text-sm text-fco-muted m-0">
                Masukkan email atau nomor registrasi kapal terdaftar untuk menerima kode verifikasi OTP.
              </p>
            </div>

            <div>
              <label htmlFor="reset-id" className="block text-xs font-semibold text-fco-dark mb-2">
                Email atau Nomor Registrasi Kapal
              </label>
              <input
                id="reset-id"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com atau REG-0412"
                className="w-full h-13.5 border border-fco-border text-fco-md rounded-fco px-3.5 bg-white focus:outline-none focus:border-fco-blue"
              />
            </div>

            <button
              type="submit"
              className="h-13.5 rounded-xl text-fco-md border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors shadow-xs mt-2"
            >
              Kirim Kode Verifikasi
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-fco-dark mb-1.5 tracking-tight">
                Masukkan Kode OTP
              </h2>
              <p className="text-sm text-fco-muted m-0">
                Kode 6 digit telah dikirimkan ke <span className="font-semibold text-fco-dark">{identifier}</span>.
              </p>
            </div>

            <div className="flex gap-2 justify-between my-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-14 h-15 border text-2xl border-fco-border rounded-xl text-center text-xl font-bold text-fco-dark bg-white focus:outline-none focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/10"
                />
              ))}
            </div>

            <div className="text-xs text-fco-muted flex justify-between items-center">
              <span>Tidak menerima kode?</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-transparent border-none text-fco-blue font-semibold cursor-pointer"
              >
                Kirim ulang
              </button>
            </div>

            <button
              type="submit"
              className="h-13.5 rounded-xl text-fco-md border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors shadow-xs mt-2"
            >
              Verifikasi Kode
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-fco-dark mb-1.5 tracking-tight">
                Buat Sandi Baru
              </h2>
              <p className="text-sm text-fco-muted m-0">
                Pilih kata sandi yang kuat dan aman untuk akun FCO Anda.
              </p>
            </div>

            <div>
              <label htmlFor="new-pass" className="block text-xs font-semibold text-fco-dark mb-1.5">
                Kata Sandi Baru
              </label>
              <input
                id="new-pass"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full h-13 border border-fco-border text-fco-md rounded-fco px-3.5 bg-white focus:outline-none focus:border-fco-blue"
              />
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-xs font-semibold text-fco-dark mb-1.5">
                Konfirmasi Sandi Baru
              </label>
              <input
                id="confirm-pass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full h-13 border border-fco-border text-fco-md rounded-fco px-3.5 bg-white focus:outline-none focus:border-fco-blue"
              />
            </div>

            <button
              type="submit"
              className="h-13.5 rounded-xl text-fco-md border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors shadow-xs mt-2"
            >
              Simpan Kata Sandi
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-fco-blue-light text-fco-blue flex items-center justify-center text-3xl font-extrabold mb-4">
              ✓
            </div>
            <h2 className="text-3xl font-extrabold text-fco-dark mb-2 tracking-tight">
              Sandi Berhasil Diperbarui
            </h2>
            <p className="text-sm text-fco-muted mb-6">
              Kata sandi akun FCO Anda telah diperbarui. Silakan masuk kembali dengan kata sandi baru.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full h-13.5 rounded-xl text-fco-md border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Masuk Sekarang
            </button>
          </div>
        )}
      </div>

      {step !== 4 && (
        <div className="mt-6 text-center text-sm text-fco-muted">
          Ingat kata sandi Anda?{' '}
          <Link
            to="/login"
            className="text-fco-blue hover:text-fco-blue-hover font-semibold no-underline"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      )}
    </div>
  )
}
