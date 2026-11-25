import React, { useState } from "react";
import { useToast } from "../../../../components/toast";
import { authService } from "../../../../services/auth";

interface AuthRegisterWizardSectionProps {
  onNavigateTo: (path: string) => void;
  onRegisterSuccess: (username: string) => void;
}

export function AuthRegisterWizardSection({
  onNavigateTo,
  onRegisterSuccess,
}: AuthRegisterWizardSectionProps) {
  const toast = useToast();

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
      onRegisterSuccess(regUsername.trim());
      onNavigateTo("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Pendaftaran gagal. Silakan periksa data Anda.";
      setRegisterError(msg);
      toast.error(msg);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
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
                    <div className="role-title">Pemilik Kapal</div>
                    <div className="role-desc">Kelola armada, izin, &amp; hasil tangkapan</div>
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
                    <div className="role-title">Nahkoda</div>
                    <div className="role-desc">Operasional berlayar &amp; logbook kapal</div>
                  </label>
                </div>
              </div>

              {role === "owner" && (
                <div className="field" id="own-group">
                  <span className="lbl" id="l-own">Tipe kepemilikan</span>
                  <div
                    role="radiogroup"
                    aria-labelledby="l-own"
                    id="seg"
                    className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#f1f4f9] dark:bg-[#0d1630] border border-[#dbe1ea] dark:border-[#26324f] box-border w-full"
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={ownerType === "perorangan"}
                      data-v="person"
                      onClick={() => setOwnerType("perorangan")}
                      className={`h-10 border-0 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                        ownerType === "perorangan"
                          ? "bg-white dark:bg-[#101a35] text-blue-600 dark:text-blue-500 shadow-[0_1px_2px_rgba(15,23,42,0.14),0_0_0_1px_rgba(37,99,235,0.22)]"
                          : "bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      Perorangan
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={ownerType === "badan-usaha"}
                      data-v="company"
                      onClick={() => setOwnerType("badan-usaha")}
                      className={`h-10 border-0 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                        ownerType === "badan-usaha"
                          ? "bg-white dark:bg-[#101a35] text-blue-600 dark:text-blue-500 shadow-[0_1px_2px_rgba(15,23,42,0.14),0_0_0_1px_rgba(37,99,235,0.22)]"
                          : "bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      Badan usaha (PT / CV)
                    </button>
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
                onClick={() => onNavigateTo("/login")}
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
  );
}
