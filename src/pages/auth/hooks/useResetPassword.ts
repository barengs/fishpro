import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../services/auth";

export type ResetStep = 1 | 2 | 3 | 4;

export function useResetPassword(
  initialStep: ResetStep = 1,
  onStepChange?: (step: ResetStep) => void,
) {
  const navigate = useNavigate();
  const [internalStep, setInternalStep] = useState<ResetStep>(initialStep);
  const [identifier, setIdentifier] = useState("");
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setStep = (next: ResetStep) => {
    setInternalStep(next);
    onStepChange?.(next);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      setError("Masukkan email atau nomor registrasi.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await authService.requestPasswordReset(cleanId);
      if (res.masked_email) {
        setMaskedEmail(res.masked_email);
      }
      setStep(2);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal mengirim kode verifikasi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("").trim();
    if (otpCode.length < 6) {
      setError("Masukkan 6 digit kode OTP verifikasi.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await authService.verifyPasswordResetOtp(identifier, otpCode);
      if (res.reset_token) {
        setResetToken(res.reset_token);
      }
      setStep(3);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Kode verifikasi tidak valid.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      setError("Kata sandi baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await authService.confirmPasswordReset({
        identifier,
        reset_token: resetToken || undefined,
        otp: otp.join("").trim(),
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setStep(4);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui kata sandi.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);
    if (val && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return {
    step: internalStep,
    setStep,
    identifier,
    setIdentifier,
    maskedEmail,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    setError,
    loading,
    handleSendOtp,
    handleVerifyOtp,
    handleSavePassword,
    handleOtpChange,
    handleOtpKeyDown,
    goToLogin: () => navigate("/login", { replace: true }),
  };
}
