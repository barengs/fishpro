import React, { useState } from "react";
import { useToast } from "../../../../components/toast";

interface AuthResetPasswordSectionProps {
  onNavigateTo: (path: string) => void;
}

export function AuthResetPasswordSection({ onNavigateTo }: AuthResetPasswordSectionProps) {
  const toast = useToast();

  const [lupaInput, setLupaInput] = useState("");
  const [lupaSent, setLupaSent] = useState(false);
  const [lupaLoading, setLupaLoading] = useState(false);
  const [lupaError, setLupaError] = useState<string | null>(null);

  const handleLupaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLupaError(null);
    if (!lupaInput.trim()) {
      setLupaError("Masukkan email, nama pengguna, atau nomor registrasi yang terdaftar.");
      return;
    }

    setLupaLoading(true);
    setTimeout(() => {
      setLupaLoading(false);
      setLupaSent(true);
      toast.success("Tautan pemulihan telah dikirim.");
    }, 800);
  };

  const handleResendLupa = () => {
    setLupaSent(false);
    setLupaInput("");
    setLupaError(null);
  };

  return (
    <section className="col col-lupa" id="col-lupa" aria-labelledby="h-lupa">
      <div className="center">
        <div className="form-wrap">
          <h1 id="h-lupa" tabIndex={-1}>
            Atur ulang kata sandi
          </h1>
          <p className="lead">
            Masukkan email, nama pengguna, atau nomor registrasi akun Anda untuk menerima tautan pemulihan.
          </p>

          {!lupaSent ? (
            <form id="form-lupa" onSubmit={handleLupaSubmit} noValidate>
              <div className={`field ${lupaError ? "invalid" : ""}`}>
                <label htmlFor="l-email">Email, nama pengguna, atau nomor registrasi</label>
                <div className="control">
                  <svg
                    className="lead-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                  <input
                    type="text"
                    id="l-email"
                    value={lupaInput}
                    onChange={(e) => {
                      setLupaInput(e.target.value);
                      setLupaError(null);
                    }}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    placeholder="nama@contoh.com atau REG-0412"
                  />
                </div>
                {lupaError && (
                  <p className="field-error-text">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>{lupaError}</span>
                  </p>
                )}
              </div>

              <button className={`btn-primary ${lupaLoading ? "busy" : ""}`} type="submit" disabled={lupaLoading}>
                <span className="spinner" aria-hidden="true" />
                <span className="label">{lupaLoading ? "Mengirim..." : "Kirim tautan pemulihan"}</span>
              </button>

              <p className="switch">
                Ingat kata sandi Anda?{" "}
                <button
                  type="button"
                  className="link btn-text-link"
                  onClick={() => onNavigateTo("/login")}
                >
                  Kembali ke Masuk
                </button>
              </p>
            </form>
          ) : (
            /* Konfirmasi terkirim */
            <div className="success-card" id="lupa-success" role="status" aria-live="polite">
              <div className="success-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <h2 className="success-title">Tautan pemulihan terkirim</h2>
              <p className="success-desc">
                Instruksi pengaturan ulang kata sandi telah dikirim untuk{" "}
                <strong>{lupaInput}</strong>. Cek kotak masuk atau folder spam Anda.
              </p>
              <div className="success-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => onNavigateTo("/login")}
                  style={{ textDecoration: "none", width: "100%", justifyContent: "center" }}
                >
                  Kembali ke Masuk
                </button>
                <button className="btn-secondary" type="button" onClick={handleResendLupa}>
                  Kirim ulang tautan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer>
        <span>&copy; 2026 FishPro</span>
      </footer>
    </section>
  );
}
