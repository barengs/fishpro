import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, ChevronLeft, Mail } from 'lucide-react'

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
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  return (
    <div>
      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm font-semibold mb-5 border border-red-200">
          {error}
        </div>
      )}

      <p className="m-0 mb-6 text-center text-sm font-semibold text-fco-blue" aria-live="polite">
        {step === 1 && 'Langkah 1 dari 3 — minta kode verifikasi'}
        {step === 2 && 'Langkah 2 dari 3 — masukkan kode OTP'}
        {step === 3 && 'Langkah 3 dari 3 — buat sandi baru'}
      </p>

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
          <div>
            <label htmlFor="reset-id" className="block text-sm font-semibold text-strong mb-2">
              Email atau nomor registrasi
            </label>
            <div className="relative">
              <Mail size={18} className="text-fco-placeholder absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
              <input
                id="reset-id"
                type="text"
                required
                autoComplete="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com atau REG-0412"
                className="w-full h-12 rounded-xl pl-11 pr-4 text-sm sm:text-fco-md field-input transition-colors"
              />
            </div>
          </div>
          <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors">
            Kirim kode verifikasi
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
          <p className="m-0 text-sm text-soft text-center">
            Kode 6 digit terkirim ke <span className="font-semibold text-strong">{identifier}</span>
          </p>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                aria-label={`Digit ${i + 1}`}
                className="w-12 h-14 border border-fco-border rounded-xl text-center text-xl font-bold field-input focus:outline-none focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/10 transition"
              />
            ))}
          </div>
          <button type="submit" className="h-13 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors">
            Verifikasi
          </button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 bg-transparent border-none text-soft hover:text-strong font-semibold cursor-pointer p-0">
              <ChevronLeft size={16} aria-hidden="true" /> Ubah email
            </button>
            <button type="button" onClick={() => setStep(1)} className="bg-transparent border-none text-fco-blue font-semibold cursor-pointer p-0">
              Kirim ulang
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSavePassword} className="flex flex-col gap-5">
          <div>
            <label htmlFor="new-pass" className="block text-sm font-semibold text-strong mb-2">
              Kata sandi baru
            </label>
            <input
              id="new-pass"
              type="password"
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full h-12 rounded-xl px-4 text-sm sm:text-fco-md field-input transition-colors"
            />
          </div>
          <div>
            <label htmlFor="confirm-pass" className="block text-sm font-semibold text-strong mb-2">
              Konfirmasi sandi baru
            </label>
            <input
              id="confirm-pass"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full h-12 rounded-xl px-4 text-sm sm:text-fco-md field-input transition-colors"
            />
          </div>
          <button type="submit" className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors">
            Simpan kata sandi
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 rounded-full bg-fco-blue-light flex items-center justify-center mb-4">
            <Check size={26} className="text-fco-blue" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <h2 className="m-0 mb-2 text-xl font-extrabold tracking-tight">Sandi diperbarui</h2>
          <p className="m-0 mb-6 text-sm text-soft">Silakan masuk kembali dengan kata sandi baru Anda.</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full h-13 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors"
          >
            Masuk sekarang
          </button>
        </div>
      )}

      {step === 2 && (
        <button type="button" onClick={() => setStep(1)} className="mt-5 inline-flex items-center gap-1.5 text-sm text-soft hover:text-strong font-semibold bg-transparent border-none cursor-pointer p-0">
          <ArrowLeft size={16} aria-hidden="true" /> Kembali
        </button>
      )}
    </div>
  )
}
