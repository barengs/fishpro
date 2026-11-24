import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ThemeToggle } from "../../components/ThemeToggle";
import { authService } from "../../services/auth";
import { useToast } from "../../components/toast";
import { loginSchema } from "../../utils/schemas";
import { usePageTransition } from "../../components/PageTransitionContext";
import "./authLayout.css";

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { navigateWithTransition } = usePageTransition();

  // State untuk melacak view aktif dan trigger curtain transition di mobile
  const [curtainActive, setCurtainActive] = useState(false);

  // Determine current view from pathname
  const getCurrentView = (): "masuk" | "daftar" | "lupa" => {
    if (location.pathname === "/register") return "daftar";
    if (location.pathname === "/reset-password") return "lupa";
    return "masuk";
  };

  const currentView = getCurrentView();

  const navigateToView = (path: string) => {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile && !prefersReducedMotion) {
      setCurtainActive(true);
      setTimeout(() => {
        navigate(path);
        window.scrollTo(0, 0);
      }, 400);
      setTimeout(() => {
        setCurtainActive(false);
      }, 800);
    } else {
      navigate(path);
    }
  };

  // -------------------------------------------------------------
  // LOGIN FORM STATE
  // -------------------------------------------------------------
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const redirectTarget = searchParams.get("redirect");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const parsed = loginSchema.safeParse({
      username: loginUser,
      password: loginPass,
    });

    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message || "Input tidak valid.";
      setLoginError(msg);
      toast.warning(msg);
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
      setLoginError(message);
      toast.error(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.warning("Fitur login Google SSO sedang dalam tahap integrasi.");
  };

  // -------------------------------------------------------------
  // REGISTER WIZARD STATE
  // -------------------------------------------------------------
  const [wizStep, setWizStep] = useState<number>(1);
  const [role, setRole] = useState<"owner" | "captain">("owner");
  const [ownerType, setOwnerType] = useState<"perorangan" | "badan-usaha">("perorangan");
  const [regFullName, setRegFullName] = useState("");
  const [regCompanyName, setRegCompanyName] = useState("");

  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [showRegPass, setShowRegPass] = useState(false);
  const [showRegPass2, setShowRegPass2] = useState(false);

  // Operational fields
  const [shipName, setShipName] = useState("");
  const [shipReg, setShipReg] = useState("");
  const [homePort, setHomePort] = useState("");
  const [wpp, setWpp] = useState("WPPNRI 573");
  const [experienceYears, setExperienceYears] = useState("5");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  const validateRegisterStep = (step: number): boolean => {
    setRegisterError(null);
    if (step === 1) {
      if (!regFullName.trim()) {
        setRegisterError("Isi nama lengkap Anda.");
        return false;
      }
      if (role === "owner" && ownerType === "badan-usaha" && !regCompanyName.trim()) {
        setRegisterError("Isi nama badan usaha atau perusahaan Anda.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!regUsername.trim()) {
        setRegisterError("Isi nama pengguna (username).");
        return false;
      }
      if (/\s/.test(regUsername)) {
        setRegisterError("Nama pengguna tidak boleh mengandung spasi.");
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(regEmail.trim())) {
        setRegisterError("Masukkan alamat email yang valid (contoh: nama@contoh.com).");
        return false;
      }
      if (!/^[0-9+\-\s]{8,16}$/.test(regPhone.trim())) {
        setRegisterError("Masukkan nomor telepon yang valid (contoh: 081234567890).");
        return false;
      }
      if (regPassword.length < 8) {
        setRegisterError("Kata sandi minimal 8 karakter.");
        return false;
      }
      if (regPasswordConfirm !== regPassword) {
        setRegisterError("Konfirmasi kata sandi tidak sama. Ketik ulang di kolom konfirmasi.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (role === "owner") {
        if (!shipName.trim()) {
          setRegisterError("Isi nama kapal Anda.");
          return false;
        }
        if (!shipReg.trim()) {
          setRegisterError("Isi nomor registrasi kapal.");
          return false;
        }
        if (!homePort.trim()) {
          setRegisterError("Isi pelabuhan pangkalan kapal.");
          return false;
        }
        if (!wpp) {
          setRegisterError("Pilih wilayah tangkap (WPPNRI).");
          return false;
        }
      } else {
        if (experienceYears === "" || Number(experienceYears) < 0) {
          setRegisterError("Isi pengalaman berlayar dalam tahun (minimal 0).");
          return false;
        }
        if (!licenseNumber.trim()) {
          setRegisterError("Isi nomor lisensi atau buku pelaut Anda.");
          return false;
        }
      }
      return true;
    }
    if (step === 4) {
      if (!agreeTerms) {
        setRegisterError("Centang persetujuan syarat & ketentuan untuk melanjutkan.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wizStep < 4) {
      if (validateRegisterStep(wizStep)) setWizStep(wizStep + 1);
      return;
    }
    if (!validateRegisterStep(4)) return;

    setRegisterLoading(true);
    try {
      await authService.register({
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
        password_confirm: regPasswordConfirm,
        role: role,
        full_name: (role === "owner" && ownerType === "badan-usaha" && regCompanyName.trim() ? regCompanyName.trim() : regFullName.trim()),
        phone: regPhone.trim(),
        contact_info: regPhone.trim(),
        owner_type: role === "owner" ? (ownerType === "badan-usaha" ? "company" : "individual") : "individual",
        ship_code: role === "owner" && shipReg.trim() ? shipReg.trim() : undefined,
        address: role === "owner" && homePort.trim() ? homePort.trim() : undefined,
      });

      toast.success("Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.");
      setLoginUser(regUsername.trim());
      navigate("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Pendaftaran gagal. Silakan periksa data Anda.";
      setRegisterError(msg);
      toast.error(msg);
    } finally {
      setRegisterLoading(false);
    }
  };

  // -------------------------------------------------------------
  // LUPA SANDI STATE
  // -------------------------------------------------------------
  const [lupaInput, setLupaInput] = useState("");
  const [lupaSent, setLupaSent] = useState(false);
  const [lupaLoading, setLupaLoading] = useState(false);
  const [lupaError, setLupaError] = useState<string | null>(null);

  const handleLupaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLupaError(null);
    if (!lupaInput.trim()) {
      setLupaError("Masukkan email atau nama pengguna yang terdaftar.");
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

  // -------------------------------------------------------------
  // KEYBOARD CAPS LOCK LISTENER
  // -------------------------------------------------------------
  const checkCapsLock = (e: React.KeyboardEvent) => {
    setCapsLockActive(e.getModifierState("CapsLock"));
  };

  useEffect(() => {
    // Sync document title
    if (currentView === "masuk") document.title = "Masuk ke FishPro";
    if (currentView === "daftar") document.title = "Buat akun FishPro";
    if (currentView === "lupa") document.title = "Lupa Kata Sandi - FishPro";
  }, [currentView]);

  return (
    <div className="page" id="page" data-view={currentView}>
      {/* Top Header */}
      <div className="hdr">
        <button
          type="button"
          onClick={() => navigateWithTransition("/onboard")}
          className="brand bg-transparent border-0 p-0 cursor-pointer font-inherit text-left"
          aria-label="FishPro"
        >
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <rect className="bg" width="32" height="32" rx="4" />
            <g className="fg" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M7 11c3-2.5 5-2.5 9 0s6 2.5 9 0" />
              <path d="M7 16c3-2.5 5-2.5 9 0s6 2.5 9 0" />
              <path d="M7 21c3-2.5 5-2.5 9 0s6 2.5 9 0" />
            </g>
          </svg>
          FISHPRO
        </button>
        <div className="actions">
          <ThemeToggle compact />
          <button
            type="button"
            className="btn-outline cursor-pointer"
            onClick={() => navigateWithTransition("/onboard")}
          >
            Beranda
          </button>
        </div>
      </div>

      {/* ============ KIRI: MASUK ============ */}
      <section className="col col-masuk" id="col-masuk" aria-labelledby="h-masuk">
        <div className="center">
          <div className="form-wrap">
            <h1 id="h-masuk" tabIndex={-1}>
              Masuk ke FishPro
            </h1>
            <p className="lead">
              Kelola operasional armada kapal, penimbangan ikan, dan perizinan laut.
            </p>

            <form id="form-masuk" onSubmit={handleLoginSubmit} noValidate>
              {loginError && (
                <div className="alert show" role="alert" aria-live="polite">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span>{loginError}</span>
                </div>
              )}

              <div className={`field ${loginError ? "invalid" : ""}`}>
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
                      setLoginError(null);
                    }}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    placeholder="REG-0412 atau admin_kkp"
                    aria-describedby="m-user-hint"
                  />
                </div>
                <p className="hint" id="m-user-hint">
                  Contoh: REG-0412 atau admin_kkp
                </p>
              </div>

              <div className="field">
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
                      setLoginError(null);
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
                  onClick={() => navigateToView("/reset-password")}
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
                  onClick={() => navigateToView("/register")}
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

      {/* ============ KANAN: DAFTAR (WIZARD 4 STEP) ============ */}
      <section className="col col-daftar" id="col-daftar" aria-labelledby="h-daftar">
        <div className="center">
          <div className="form-wrap">
            <h1 id="h-daftar" tabIndex={-1}>
              Buat akun FishPro
            </h1>
            <p className="lead">
              Lengkapi 4 langkah singkat untuk mulai mengelola kapal, timbangan, dan izin Anda.
            </p>

            {/* Stepper Progress Indicator */}
            <ol className="stepper" id="wiz-stepper" aria-label="Tahapan pendaftaran">
              <li className={`step-item ${wizStep === 1 ? "active" : wizStep > 1 ? "done" : ""}`} data-step="1">
                <span className="step-dot">
                  <span className="step-num">1</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="step-label">Identitas</span>
              </li>
              <li className={`step-item ${wizStep === 2 ? "active" : wizStep > 2 ? "done" : ""}`} data-step="2">
                <span className="step-dot">
                  <span className="step-num">2</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="step-label">Akun</span>
              </li>
              <li className={`step-item ${wizStep === 3 ? "active" : wizStep > 3 ? "done" : ""}`} data-step="3">
                <span className="step-dot">
                  <span className="step-num">3</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="step-label">Operasional</span>
              </li>
              <li className={`step-item ${wizStep === 4 ? "active" : ""}`} data-step="4">
                <span className="step-dot">
                  <span className="step-num">4</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="step-label">Konfirmasi</span>
              </li>
            </ol>

            <form id="form-daftar" onSubmit={handleRegisterSubmit} noValidate>
              {registerError && (
                <div className="alert show" role="alert" aria-live="polite">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span>{registerError}</span>
                </div>
              )}

              {/* STEP 1: IDENTITAS */}
              <div className={`wiz-step ${wizStep === 1 ? "active" : ""}`} data-wiz="1">
                <div className="field">
                  <label>Daftar sebagai</label>
                  <div className="role-grid" role="radiogroup" aria-label="Pilihan peran">
                    <label
                      className={`role-card ${role === "owner" ? "selected" : ""}`}
                      onClick={() => setRole("owner")}
                    >
                      <input
                        type="radio"
                        name="d-role"
                        value="owner"
                        checked={role === "owner"}
                        onChange={() => setRole("owner")}
                      />
                      <div className="role-top">
                        <span className="role-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" />
                            <path d="M12 10v4" />
                            <path d="M12 2v3" />
                          </svg>
                        </span>
                        <span className="role-radio" aria-hidden="true" />
                      </div>
                      <span className="role-title">Pemilik Kapal</span>
                      <span className="role-desc">Kelola armada, izin, &amp; hasil tangkapan</span>
                    </label>

                    <label
                      className={`role-card ${role === "captain" ? "selected" : ""}`}
                      onClick={() => setRole("captain")}
                    >
                      <input
                        type="radio"
                        name="d-role"
                        value="captain"
                        checked={role === "captain"}
                        onChange={() => setRole("captain")}
                      />
                      <div className="role-top">
                        <span className="role-icon" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="12" cy="12" r="2.5" />
                            <path d="M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21M5.6 5.6l4.6 4.6M13.8 13.8l4.6 4.6M18.4 5.6l-4.6 4.6M10.2 13.8l-4.6 4.6" />
                          </svg>
                        </span>
                        <span className="role-radio" aria-hidden="true" />
                      </div>
                      <span className="role-title">Nahkoda</span>
                      <span className="role-desc">Operasional berlayar &amp; logbook kapal</span>
                    </label>
                  </div>
                </div>

                {role === "owner" && (
                  <div className="field" id="wrap-kepemilikan">
                    <label>Tipe kepemilikan</label>
                    <div className="seg-group" role="radiogroup" aria-label="Tipe kepemilikan">
                      <label
                        className={`seg-opt ${ownerType === "perorangan" ? "selected" : ""}`}
                        onClick={() => setOwnerType("perorangan")}
                      >
                        <input
                          type="radio"
                          name="d-kepemilikan"
                          value="perorangan"
                          checked={ownerType === "perorangan"}
                          onChange={() => setOwnerType("perorangan")}
                        />
                        <span>Perorangan</span>
                      </label>
                      <label
                        className={`seg-opt ${ownerType === "badan-usaha" ? "selected" : ""}`}
                        onClick={() => setOwnerType("badan-usaha")}
                      >
                        <input
                          type="radio"
                          name="d-kepemilikan"
                          value="badan-usaha"
                          checked={ownerType === "badan-usaha"}
                          onChange={() => setOwnerType("badan-usaha")}
                        />
                        <span>Badan Usaha (PT / CV)</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label htmlFor="d-nama">Nama lengkap</label>
                  <div className="control">
                    <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                    <input
                      type="text"
                      id="d-nama"
                      value={regFullName}
                      onChange={(e) => {
                        setRegFullName(e.target.value);
                        setRegisterError(null);
                      }}
                      autoComplete="name"
                      placeholder="Contoh: Budi Santoso"
                    />
                  </div>
                </div>

                {role === "owner" && ownerType === "badan-usaha" && (
                  <div className="field" id="wrap-perusahaan">
                    <label htmlFor="d-perusahaan">Nama perusahaan</label>
                    <div className="control">
                      <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 21h18M5 21V7l8-4v18M13 21V3l6 4v14" />
                      </svg>
                      <input
                        type="text"
                        id="d-perusahaan"
                        value={regCompanyName}
                        onChange={(e) => {
                          setRegCompanyName(e.target.value);
                          setRegisterError(null);
                        }}
                        placeholder="Contoh: PT Samudera Bahari Nusantara"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: AKUN */}
              <div className={`wiz-step ${wizStep === 2 ? "active" : ""}`} data-wiz="2">
                <div className="field">
                  <label htmlFor="d-user">Nama pengguna (Username)</label>
                  <div className="control">
                    <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
                    </svg>
                    <input
                      type="text"
                      id="d-user"
                      value={regUsername}
                      onChange={(e) => {
                        setRegUsername(e.target.value);
                        setRegisterError(null);
                      }}
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck="false"
                      placeholder="Contoh: budi_samudera"
                    />
                  </div>
                </div>

                <div className="field-row">
                  <div className="field">
                    <label htmlFor="d-email">Email</label>
                    <div className="control">
                      <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                      </svg>
                      <input
                        type="email"
                        id="d-email"
                        value={regEmail}
                        onChange={(e) => {
                          setRegEmail(e.target.value);
                          setRegisterError(null);
                        }}
                        autoComplete="email"
                        placeholder="nama@contoh.com"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="d-telp">Nomor telepon</label>
                    <div className="control">
                      <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <input
                        type="tel"
                        id="d-telp"
                        value={regPhone}
                        onChange={(e) => {
                          setRegPhone(e.target.value);
                          setRegisterError(null);
                        }}
                        autoComplete="tel"
                        placeholder="081234567890"
                      />
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="d-pass">Kata sandi</label>
                  <div className="control">
                    <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <input
                      type={showRegPass ? "text" : "password"}
                      id="d-pass"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        setRegisterError(null);
                      }}
                      autoComplete="new-password"
                      placeholder="Minimal 8 karakter"
                    />
                    <button
                      className="toggle"
                      type="button"
                      onClick={() => setShowRegPass(!showRegPass)}
                      aria-label={showRegPass ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      {showRegPass ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="d-pass2">Ulangi kata sandi</label>
                  <div className="control">
                    <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="4" y="11" width="16" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <input
                      type={showRegPass2 ? "text" : "password"}
                      id="d-pass2"
                      value={regPasswordConfirm}
                      onChange={(e) => {
                        setRegPasswordConfirm(e.target.value);
                        setRegisterError(null);
                      }}
                      autoComplete="new-password"
                      placeholder="Ketik ulang kata sandi"
                    />
                    <button
                      className="toggle"
                      type="button"
                      onClick={() => setShowRegPass2(!showRegPass2)}
                      aria-label={showRegPass2 ? "Sembunyikan konfirmasi kata sandi" : "Tampilkan konfirmasi kata sandi"}
                    >
                      {showRegPass2 ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* STEP 3: OPERASIONAL */}
              <div className={`wiz-step ${wizStep === 3 ? "active" : ""}`} data-wiz="3">
                {role === "owner" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="field-row">
                      <div className="field">
                        <label htmlFor="d-kapal">Nama kapal</label>
                        <div className="control">
                          <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
                            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" />
                          </svg>
                          <input
                            type="text"
                            id="d-kapal"
                            value={shipName}
                            onChange={(e) => {
                              setShipName(e.target.value);
                              setRegisterError(null);
                            }}
                            placeholder="Contoh: KM Bahari 01"
                          />
                        </div>
                      </div>

                      <div className="field">
                        <label htmlFor="d-reg-kapal">Nomor registrasi kapal</label>
                        <div className="control">
                          <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M7 8h10M7 12h10M7 16h6" />
                          </svg>
                          <input
                            type="text"
                            id="d-reg-kapal"
                            value={shipReg}
                            onChange={(e) => {
                              setShipReg(e.target.value);
                              setRegisterError(null);
                            }}
                            placeholder="Contoh: REG-99421-ID"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="d-pelabuhan">Pelabuhan pangkalan</label>
                      <div className="control">
                        <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <input
                          type="text"
                          id="d-pelabuhan"
                          value={homePort}
                          onChange={(e) => {
                            setHomePort(e.target.value);
                            setRegisterError(null);
                          }}
                          placeholder="Contoh: Pelabuhan Muara Baru, Jakarta"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="d-wpp">Wilayah Pengelolaan Perikanan (WPPNRI)</label>
                      <div className="control">
                        <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                          <path d="M2 12h20" />
                        </svg>
                        <select
                          id="d-wpp"
                          value={wpp}
                          onChange={(e) => {
                            setWpp(e.target.value);
                            setRegisterError(null);
                          }}
                        >
                          <option value="WPPNRI 571">WPPNRI 571 - Selat Malaka &amp; Laut Andaman</option>
                          <option value="WPPNRI 572">WPPNRI 572 - Samudera Hindia (Barat Sumatera)</option>
                          <option value="WPPNRI 573">WPPNRI 573 - Samudera Hindia (Selatan Jawa - Nusa Tenggara)</option>
                          <option value="WPPNRI 711">WPPNRI 711 - Selat Karimata, Laut Natuna, Laut Natuna Utara</option>
                          <option value="WPPNRI 712">WPPNRI 712 - Laut Jawa</option>
                          <option value="WPPNRI 713">WPPNRI 713 - Selat Makassar, Teluk Bone, Laut Flores, Laut Bali</option>
                          <option value="WPPNRI 714">WPPNRI 714 - Teluk Tolo &amp; Laut Banda</option>
                          <option value="WPPNRI 715">WPPNRI 715 - Teluk Tomini, Laut Maluku, Laut Halmahera, Laut Seram</option>
                          <option value="WPPNRI 716">WPPNRI 716 - Laut Sulawesi &amp; Utara Pulau Halmahera</option>
                          <option value="WPPNRI 717">WPPNRI 717 - Teluk Cendrawasih &amp; Samudera Pasifik</option>
                          <option value="WPPNRI 718">WPPNRI 718 - Laut Aru, Laut Arafuru, Laut Timor</option>
                        </select>
                        <svg className="trail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div className="field">
                      <label htmlFor="d-pengalaman">Pengalaman berlayar (tahun)</label>
                      <div className="control">
                        <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <input
                          type="number"
                          id="d-pengalaman"
                          min="0"
                          max="70"
                          step="1"
                          value={experienceYears}
                          onChange={(e) => {
                            setExperienceYears(e.target.value);
                            setRegisterError(null);
                          }}
                          placeholder="Contoh: 5"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="d-lisensi">Nomor lisensi pelaut / buku pelaut</label>
                      <div className="control">
                        <svg className="lead-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                          <path d="M6 6h10M6 10h10" />
                        </svg>
                        <input
                          type="text"
                          id="d-lisensi"
                          value={licenseNumber}
                          onChange={(e) => {
                            setLicenseNumber(e.target.value);
                            setRegisterError(null);
                          }}
                          placeholder="Contoh: 62-XXXXX-BST"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 4: KONFIRMASI */}
              <div className={`wiz-step ${wizStep === 4 ? "active" : ""}`} data-wiz="4">
                <div className="summary-box" id="d-summary" aria-label="Ringkasan data pendaftaran">
                  <div className="summary-group">
                    <div className="summary-head">Identitas &amp; Peran</div>
                    <div className="summary-row">
                      <span className="summary-label">Peran Akun</span>
                      <span className="summary-val">{role === "owner" ? "Pemilik Kapal" : "Nahkoda"}</span>
                    </div>
                    {role === "owner" && (
                      <div className="summary-row">
                        <span className="summary-label">Kepemilikan</span>
                        <span className="summary-val">{ownerType === "badan-usaha" ? "Badan Usaha" : "Perorangan"}</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span className="summary-label">Nama Lengkap</span>
                      <span className="summary-val">{regFullName || "—"}</span>
                    </div>
                    {role === "owner" && ownerType === "badan-usaha" && (
                      <div className="summary-row">
                        <span className="summary-label">Perusahaan</span>
                        <span className="summary-val">{regCompanyName || "—"}</span>
                      </div>
                    )}
                  </div>

                  <div className="summary-group">
                    <div className="summary-head">Akun &amp; Kontak</div>
                    <div className="summary-row">
                      <span className="summary-label">Nama Pengguna</span>
                      <span className="summary-val">{regUsername || "—"}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Email</span>
                      <span className="summary-val">{regEmail || "—"}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Nomor Telepon</span>
                      <span className="summary-val">{regPhone || "—"}</span>
                    </div>
                  </div>

                  <div className="summary-group">
                    <div className="summary-head">
                      {role === "owner" ? "Operasional Kapal" : "Operasional Nahkoda"}
                    </div>
                    {role === "owner" ? (
                      <>
                        <div className="summary-row">
                          <span className="summary-label">Nama Kapal</span>
                          <span className="summary-val">{shipName || "—"}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">No. Registrasi</span>
                          <span className="summary-val">{shipReg || "—"}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Pelabuhan Pangkalan</span>
                          <span className="summary-val">{homePort || "—"}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Wilayah Tangkap</span>
                          <span className="summary-val">{wpp || "—"}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="summary-row">
                          <span className="summary-label">Pengalaman Berlayar</span>
                          <span className="summary-val">{experienceYears} Tahun</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">No. Lisensi / Buku Pelaut</span>
                          <span className="summary-val">{licenseNumber || "—"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <label className="check">
                  <input
                    type="checkbox"
                    id="d-setuju"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      setRegisterError(null);
                    }}
                  />
                  <span>
                    Saya menyetujui <a className="link" href="#syarat" onClick={(e) => e.preventDefault()}>Syarat &amp; Ketentuan</a> serta{" "}
                    <a className="link" href="#privasi" onClick={(e) => e.preventDefault()}>Kebijakan Privasi</a> FishPro.
                  </span>
                </label>
              </div>

              {/* Navigasi Wizard */}
              <div className="wiz-nav">
                {wizStep > 1 && (
                  <button
                    className="btn-secondary"
                    type="button"
                    onClick={() => setWizStep(wizStep - 1)}
                    disabled={registerLoading}
                  >
                    Kembali
                  </button>
                )}
                {wizStep < 4 ? (
                  <button
                    className="btn-primary"
                    type="button"
                    onClick={() => {
                      if (validateRegisterStep(wizStep)) setWizStep(wizStep + 1);
                    }}
                  >
                    Lanjut
                  </button>
                ) : (
                  <button
                    className={`btn-primary ${registerLoading ? "busy" : ""}`}
                    type="submit"
                    disabled={registerLoading}
                  >
                    <span className="spinner" aria-hidden="true" />
                    <span className="label">{registerLoading ? "Memproses..." : "Buat akun"}</span>
                  </button>
                )}
              </div>

              <p className="switch">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  className="link btn-text-link"
                  onClick={() => navigateToView("/login")}
                >
                  Masuk di sini
                </button>
              </p>
            </form>
          </div>
        </div>
        <footer>
          <span>&copy; 2026 FishPro</span>
        </footer>
      </section>

      {/* ============ LUPA KATA SANDI ============ */}
      <section className="col col-lupa" id="col-lupa" aria-labelledby="h-lupa">
        <div className="center">
          <div className="form-wrap">
            <h1 id="h-lupa" tabIndex={-1}>
              Atur ulang kata sandi
            </h1>
            <p className="lead">
              Masukkan email atau nama pengguna yang terdaftar. Kami akan mengirimkan tautan pemulihan ke email Anda.
            </p>

            {!lupaSent ? (
              <form id="form-lupa" onSubmit={handleLupaSubmit} noValidate>
                {lupaError && (
                  <div className="alert show" role="alert" aria-live="polite">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <span>{lupaError}</span>
                  </div>
                )}

                <div className={`field ${lupaError ? "invalid" : ""}`}>
                  <label htmlFor="l-email">Email atau nama pengguna</label>
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
                    onClick={() => navigateToView("/login")}
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
                  Kami telah mengirimkan instruksi pengaturan ulang kata sandi untuk{" "}
                  <strong>{lupaInput}</strong>. Periksa kotak masuk atau folder spam Anda.
                </p>
                <div className="success-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => navigateToView("/login")}
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

      {/* ============ PANEL YANG MELUNCUR ============ */}
      <aside
        className={`panel ${curtainActive ? "curtain-run" : ""}`}
        id="panel"
        aria-label="Tentang FishPro"
      >
        <div className={`copy ${currentView === "masuk" ? "" : "off"}`} id="copy-masuk">
          <p className="quote">Data timbangan, armada, dan izin laut dalam satu tempat.</p>
          <p className="sub">
            Catat hasil tangkapan di pelabuhan, pantau status izin kapal, dan siapkan laporan tanpa rekap manual.
          </p>
          <button className="btn-ghost" type="button" onClick={() => navigateToView("/register")}>
            Daftar akun
          </button>
        </div>

        <div className={`copy ${currentView === "daftar" ? "" : "off"}`} id="copy-daftar">
          <p className="quote">Akun baru siap dipakai begitu data kapal Anda terverifikasi.</p>
          <p className="sub">
            Setelah mendaftar, tambahkan kapal dan dokumen perizinan dari dashboard. Sudah punya akun? Masuk di sini.
          </p>
          <button className="btn-ghost" type="button" onClick={() => navigateToView("/login")}>
            Masuk
          </button>
        </div>

        <div className={`copy ${currentView === "lupa" ? "" : "off"}`} id="copy-lupa">
          <p className="quote">Keamanan akun dan data armada Anda adalah prioritas kami.</p>
          <p className="sub">
            Tautan pemulihan hanya berlaku terbatas untuk memastikan akses operasional kapal Anda tetap terlindungi.
          </p>
          <button className="btn-ghost" type="button" onClick={() => navigateToView("/login")}>
            Kembali ke Masuk
          </button>
        </div>
      </aside>
    </div>
  );
}
