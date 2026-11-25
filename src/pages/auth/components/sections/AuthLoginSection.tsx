import React, { useState } from "react";
import { useToast } from "../../../../components/toast";
import { authService } from "../../../../services/auth";
import { loginSchema } from "../../../../utils/schemas";
import { useNavigate, useSearchParams } from "react-router-dom";

interface AuthLoginSectionProps {
  onNavigateTo: (path: string) => void;
  externalLoginUser?: string;
}

export function AuthLoginSection({ onNavigateTo, externalLoginUser }: AuthLoginSectionProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [loginUser, setLoginUser] = useState(externalLoginUser || "");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Update loginUser if externalLoginUser changes
  React.useEffect(() => {
    if (externalLoginUser) {
      setLoginUser(externalLoginUser);
    }
  }, [externalLoginUser]);

  const redirectTarget = searchParams.get("redirect");

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const checkCapsLock = (e: React.KeyboardEvent) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!loginUser.trim()) {
      errors.loginUser = "Nama pengguna atau nomor registrasi wajib diisi.";
    }
    if (!loginPass) {
      errors.loginPass = "Kata sandi wajib diisi.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const parsed = loginSchema.safeParse({
      username: loginUser,
      password: loginPass,
    });

    if (!parsed.success) {
      const issues = parsed.error.issues;
      const zErrors: Record<string, string> = {};
      issues.forEach((issue) => {
        const path = issue.path[0];
        if (path === "username") zErrors.loginUser = issue.message;
        if (path === "password") zErrors.loginPass = issue.message;
      });
      setFieldErrors(zErrors);
      return;
    }

    setLoginLoading(true);
    try {
      const data = await authService.login(parsed.data);
      toast.success(`Login berhasil. Selamat datang kembali, ${data.username}!`);
      const targetDashboard = authService.getDashboardUrl();
      const safeRedirect =
        redirectTarget && redirectTarget.startsWith("/")
          ? redirectTarget
          : targetDashboard;
      navigate(safeRedirect, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal masuk. Periksa kembali nama pengguna dan kata sandi.";
      // Tampilkan error login umum di bawah kolom kata sandi
      setFieldErrors({ loginPass: message });
      toast.error(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.warning("Fitur login Google SSO sedang dalam tahap integrasi.");
  };

  return (
    <section className="col col-masuk" id="col-masuk" aria-labelledby="h-masuk">
      <div className="center">
        <div className="form-wrap">
          <h1 id="h-masuk" tabIndex={-1}>
            Masuk ke FishPro
          </h1>
          <p className="lead">
            Selamat datang kembali! Silakan masuk ke akun Anda.
          </p>

          <form id="form-masuk" onSubmit={handleLoginSubmit} noValidate>
            <div className={`field ${fieldErrors.loginUser ? "invalid" : ""}`}>
              <label htmlFor="m-user">Nama pengguna atau nomor registrasi</label>
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
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                </svg>
                <input
                  type="text"
                  id="m-user"
                  value={loginUser}
                  onChange={(e) => {
                    setLoginUser(e.target.value);
                    clearFieldError("loginUser");
                  }}
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck="false"
                  placeholder="REG-0412 atau admin_kkp"
                />
              </div>
              {fieldErrors.loginUser && (
                <p className="field-error-text">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{fieldErrors.loginUser}</span>
                </p>
              )}
            </div>

            <div className={`field ${fieldErrors.loginPass ? "invalid" : ""}`}>
              <label htmlFor="m-pass">Kata sandi</label>
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
                  <rect x="4" y="11" width="16" height="10" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <input
                  type={showLoginPass ? "text" : "password"}
                  id="m-pass"
                  value={loginPass}
                  onChange={(e) => {
                    setLoginPass(e.target.value);
                    clearFieldError("loginPass");
                  }}
                  onKeyUp={checkCapsLock}
                  onKeyDown={checkCapsLock}
                  autoComplete="current-password"
                  placeholder="Masukkan kata sandi"
                  aria-describedby="m-caps"
                />
                <button
                  className="toggle"
                  type="button"
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  aria-label={showLoginPass ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showLoginPass ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" x2="22" y1="2" y2="22" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.loginPass && (
                <p className="field-error-text">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{fieldErrors.loginPass}</span>
                </p>
              )}
              <p className={`caps ${capsLockActive ? "show" : ""}`} id="m-caps" aria-live="polite">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3 4 12h4v5h8v-5h4z" />
                  <path d="M8 21h8" />
                </svg>
                Caps Lock aktif
              </p>
            </div>

            <div className="row">
              <label className="check">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Ingat saya selama 30 hari
              </label>
              <button
                type="button"
                className="link btn-text-link"
                onClick={() => onNavigateTo("/reset-password")}
              >
                Lupa kata sandi?
              </button>
            </div>

            <button className={`btn-primary ${loginLoading ? "busy" : ""}`} type="submit" disabled={loginLoading}>
              <span className="spinner" aria-hidden="true" />
              <span className="label">{loginLoading ? "Memproses masuk..." : "Masuk"}</span>
            </button>

            <div className="divider" role="separator">
              atau masuk dengan
            </div>

            <button className="btn-google" type="button" onClick={handleGoogleLogin}>
              <svg viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20H24v8.5h11.3C33.6 33.7 29.3 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 .1 8.2 3.1l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.4-4z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.1 19 11 24 11c3.1 0 6 1.1 8.2 3.1l6.4-6.4C34.6 4.1 29.6 2 24 2 16.5 2 9.9 7.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 46c5.2 0 10-1.8 13.6-5l-6.3-5.2C29.3 37.3 26.8 38 24 38c-5.3 0-9.6-3.3-11.3-8l-6.6 5.1C9.7 41.5 16.3 46 24 46z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20H24v8.5h11.3c-.9 2.6-2.5 4.8-4.6 6.3l6.3 5.2C40.6 36.5 44 30.7 44 24c0-1.3-.2-2.7-.4-4z"
                />
              </svg>
              <span>Masuk dengan Google</span>
            </button>

            <p className="switch">
              Belum punya akun?{" "}
              <button
                type="button"
                className="link btn-text-link"
                onClick={() => onNavigateTo("/register")}
              >
                Daftar sekarang
              </button>
            </p>
          </form>
        </div>
      </div>
      <footer>
        <span>&copy; 2026 FishPro</span>
      </footer>
    </section>
  );
}
