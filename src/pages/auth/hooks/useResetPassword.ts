import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type ResetStep = 1 | 2 | 3 | 4;

export function useResetPassword(
  initialStep: ResetStep = 1,
  onStepChange?: (step: ResetStep) => void,
) {
  const navigate = useNavigate();
  const [internalStep, setInternalStep] = useState<ResetStep>(initialStep);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const setStep = (next: ResetStep) => {
    setInternalStep(next);
    onStepChange?.(next);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Masukkan email atau nomor registrasi.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) {
      setError("Masukkan 6 digit kode OTP verifikasi.");
      return;
    }
    setError(null);
    setStep(3);
  };

  const handleSavePassword = (e: React.FormEvent) => {
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
    setStep(4);
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
    goToLogin: () => navigate("/login"),
  };
}
