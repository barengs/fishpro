import { Check, Lock, Mail } from "lucide-react";
import { useResetPassword, type ResetStep } from "../hooks/useResetPassword";

interface ResetPasswordWizardProps {
  step: ResetStep;
  setStep: (step: ResetStep) => void;
}

export function ResetPasswordWizard({
  step,
  setStep,
}: ResetPasswordWizardProps) {
  const {
    identifier,
    setIdentifier,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    handleSendOtp,
    handleVerifyOtp,
    handleSavePassword,
    handleOtpChange,
    handleOtpKeyDown,
    goToLogin,
  } = useResetPassword(step, setStep);

  return (
    <div>
      {/* Header card: judul & deskripsi singkat */}
      <div className="mb-5 sm:mb-6 text-center">
        <h1 className="m-0 mb-1 text-xl sm:text-2xl font-extrabold tracking-tight">
          {step === 1 && "Reset Kata Sandi"}
          {step === 2 && "Verifikasi Kode"}
          {step === 3 && "Kata Sandi Baru"}
          {step === 4 && "Sandi Diperbarui"}
        </h1>
        <p className="m-0 text-sm sm:text-fco-md text-soft">
          {step === 1 && "Masukkan email atau nomor registrasi akun Anda."}
          {step === 2 && (
            <>
              Kode 6 digit dikirim ke{" "}
              <span className="font-semibold text-strong">{identifier}</span>
            </>
          )}
          {step === 3 && "Pilih kata sandi baru minimal 8 karakter."}
          {step === 4 && "Silakan masuk kembali dengan kata sandi baru."}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20"
        >
          {error}
        </div>
      )}

      {/* Step 1: Input email / registrasi */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="reset-id"
              className="block text-sm font-semibold text-strong mb-2"
            >
              Email atau nomor registrasi
              <span
                className="text-red-500 ml-1 font-bold"
                aria-label="mandatory"
                title="Mandatory"
              >
                *
              </span>
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="text-fco-placeholder absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="reset-id"
                type="text"
                required
                autoComplete="email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="nama@email.com atau REG-0412"
                className="w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl pl-11 pr-4 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft"
              />
            </div>
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors"
          >
            Kirim kode verifikasi
          </button>
        </form>
      )}

      {/* Step 2: OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
          <div className="flex gap-2 justify-center py-1">
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
                className="w-11 sm:w-12 h-13 sm:h-14 border border-fco-border rounded-xl text-center text-xl font-bold field-input focus:outline-hidden focus:border-fco-blue transition"
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep(1);
              }}
              className="inline-flex items-center gap-1.5 bg-transparent border-none text-soft hover:text-strong font-medium cursor-pointer p-0 transition-colors"
            >
              Ubah email
            </button>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setOtp(["", "", "", "", "", ""]);
              }}
              className="bg-transparent border-none text-fco-blue hover:text-fco-blue-hover font-semibold cursor-pointer p-0 transition-colors"
            >
              Kirim ulang
            </button>
          </div>

          <button
            type="submit"
            className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors"
          >
            Verifikasi
          </button>
        </form>
      )}

      {/* Step 3: Kata sandi baru */}
      {step === 3 && (
        <form onSubmit={handleSavePassword} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="new-pass"
              className="block text-sm font-semibold text-strong mb-2"
            >
              Kata sandi baru
              <span
                className="text-red-500 ml-1 font-bold"
                aria-label="mandatory"
                title="Mandatory"
              >
                *
              </span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="text-fco-placeholder absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="new-pass"
                type="password"
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl pl-11 pr-4 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirm-pass"
              className="block text-sm font-semibold text-strong mb-2"
            >
              Konfirmasi sandi baru
              <span
                className="text-red-500 ml-1 font-bold"
                aria-label="mandatory"
                title="Mandatory"
              >
                *
              </span>
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="text-fco-placeholder absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="confirm-pass"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl pl-11 pr-4 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft"
              />
            </div>
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors"
          >
            Simpan kata sandi
          </button>
        </form>
      )}

      {/* Step 4: Berhasil */}
      {step === 4 && (
        <div className="flex flex-col items-center text-center py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
            <Check size={28} strokeWidth={2.5} aria-hidden="true" />
          </div>
          <button
            type="button"
            onClick={goToLogin}
            className="w-full h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors"
          >
            Masuk sekarang
          </button>
        </div>
      )}
    </div>
  );
}
