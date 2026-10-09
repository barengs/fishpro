import { useState } from 'react'

interface ResetPasswordWizardProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ResetPasswordWizard({ onSuccess, onCancel }: ResetPasswordWizardProps) {
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
    <div className="max-w-[420px] w-full mx-auto">
      <div className="bg-white border border-[#DCE6F5] rounded-2xl p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="p-3 px-4 rounded-xl bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-200">
            ⚠ {error}
          </div>
        )}

        {/* STEP 1: REQUEST EMAIL/REG */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0F1F3D] mb-1.5 tracking-tight">
                Reset Kata Sandi
              </h2>
              <p className="text-sm text-[#5B6B86] m-0">
                Masukkan email atau nomor registrasi kapal terdaftar untuk menerima kode verifikasi OTP.
              </p>
            </div>

            <div>
              <label htmlFor="reset-id" className="block text-xs font-semibold text-[#0F1F3D] mb-2">
                Email atau Nomor Registrasi Kapal
              </label>
              <input
                id="reset-id"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com atau REG-0412"
                className="w-full h-11.5 border border-[#DCE6F5] rounded-[10px] px-3.5 text-sm bg-white focus:outline-none focus:border-[#1A56DB]"
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-[10px] border-none bg-[#1A56DB] hover:bg-[#123FA8] text-white text-[15px] font-semibold cursor-pointer transition-colors shadow-xs mt-2"
            >
              Kirim Kode Verifikasi
            </button>
          </form>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0F1F3D] mb-1.5 tracking-tight">
                Masukkan Kode OTP
              </h2>
              <p className="text-sm text-[#5B6B86] m-0">
                Kode 6 digit telah dikirimkan ke <span className="font-semibold text-[#0F1F3D]">{identifier}</span>.
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
                  className="w-12 h-13 border border-[#DCE6F5] rounded-xl text-center text-xl font-bold text-[#0F1F3D] bg-white focus:outline-none focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/10"
                />
              ))}
            </div>

            <div className="text-xs text-[#5B6B86] flex justify-between items-center">
              <span>Tidak menerima kode?</span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-transparent border-none text-[#1A56DB] font-semibold cursor-pointer"
              >
                Kirim ulang
              </button>
            </div>

            <button
              type="submit"
              className="h-12 rounded-[10px] border-none bg-[#1A56DB] hover:bg-[#123FA8] text-white text-[15px] font-semibold cursor-pointer transition-colors shadow-xs mt-2"
            >
              Verifikasi Kode
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleSavePassword} className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0F1F3D] mb-1.5 tracking-tight">
                Buat Sandi Baru
              </h2>
              <p className="text-sm text-[#5B6B86] m-0">
                Pilih kata sandi yang kuat dan aman untuk akun FCO Anda.
              </p>
            </div>

            <div>
              <label htmlFor="new-pass" className="block text-xs font-semibold text-[#0F1F3D] mb-1.5">
                Kata Sandi Baru
              </label>
              <input
                id="new-pass"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3.5 text-sm bg-white focus:outline-none focus:border-[#1A56DB]"
              />
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-xs font-semibold text-[#0F1F3D] mb-1.5">
                Konfirmasi Sandi Baru
              </label>
              <input
                id="confirm-pass"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full h-11 border border-[#DCE6F5] rounded-[10px] px-3.5 text-sm bg-white focus:outline-none focus:border-[#1A56DB]"
              />
            </div>

            <button
              type="submit"
              className="h-12 rounded-[10px] border-none bg-[#1A56DB] hover:bg-[#123FA8] text-white text-[15px] font-semibold cursor-pointer transition-colors shadow-xs mt-2"
            >
              Simpan Kata Sandi
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div className="flex flex-col items-center text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#E8F0FE] text-[#1A56DB] flex items-center justify-center text-2xl font-extrabold mb-4">
              ✓
            </div>
            <h2 className="text-2xl font-extrabold text-[#0F1F3D] mb-2 tracking-tight">
              Sandi Berhasil Diperbarui
            </h2>
            <p className="text-sm text-[#5B6B86] mb-6">
              Kata sandi akun FCO Anda telah diperbarui. Silakan masuk kembali dengan kata sandi baru.
            </p>
            <button
              type="button"
              onClick={onSuccess || onCancel}
              className="w-full h-12 rounded-[10px] border-none bg-[#1A56DB] hover:bg-[#123FA8] text-white text-[15px] font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Masuk Sekarang
            </button>
          </div>
        )}
      </div>

      {step !== 4 && (
        <div className="mt-6 text-center text-sm text-[#5B6B86]">
          Ingat kata sandi Anda?{' '}
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border-none text-[#1A56DB] hover:text-[#123FA8] font-semibold cursor-pointer p-0"
          >
            Kembali ke halaman masuk
          </button>
        </div>
      )}
    </div>
  )
}
