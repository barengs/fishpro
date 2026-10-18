import { useState } from "react";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface StepAccountProps {
  username: string;
  setUsername: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  passwordConfirm: string;
  setPasswordConfirm: (val: string) => void;
  errors?: Record<string, string>;
  onClearError?: (field: string) => void;
}

const labelCls = "block text-sm font-semibold text-strong mb-1.5";

export function StepAccount({
  username,
  setUsername,
  phone,
  setPhone,
  email,
  setEmail,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  errors = {},
  onClearError,
}: StepAccountProps) {
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

  const getFieldCls = (fieldName: string) => {
    const hasError = Boolean(errors[fieldName]);
    return `w-full h-11 border-2 rounded-xl pl-10 pr-3.5 text-sm field-input transition-all surface-card text-strong placeholder:text-soft ${
      hasError
        ? "has-error border-red-500 dark:border-red-500 bg-red-50/40 dark:bg-red-950/20 text-red-950 dark:text-red-100"
        : "border-fco-border dark:border-fco-border-dark focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15"
    }`;
  };

  return (
    <div>
      <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">
        Kredensial Akun Masuk
      </h3>
      <p className="m-0 mb-5 text-sm text-soft">
        Kredensial resmi yang akan digunakan untuk masuk ke portal sistem FCO.
      </p>

      <div className="flex flex-col gap-4">
        {/* Username & Telepon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="rg-user" className={labelCls}>
              Nama Pengguna (Username)
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="relative">
              <User
                size={16}
                className={`${
                  errors.username ? "text-red-500" : "text-soft"
                } absolute left-3.5 top-3 pointer-events-none transition-colors`}
              />
              <input
                id="rg-user"
                name="username"
                type="text"
                autoComplete="username"
                required
                aria-invalid={Boolean(errors.username)}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""));
                  onClearError?.("username");
                }}
                placeholder="Contoh: kapalsamudera"
                className={getFieldCls("username")}
              />
            </div>
            {errors.username ? (
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
                <AlertCircle
                  size={13}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span>{errors.username}</span>
              </span>
            ) : (
              <span className="text-2xs text-soft mt-1 block">
                Gunakan huruf kecil, angka, strip (-), atau underscore (_).
              </span>
            )}
          </div>

          <div>
            <label htmlFor="rg-phone" className={labelCls}>
              Nomor WhatsApp / Telepon
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="relative">
              <Phone
                size={16}
                className={`${
                  errors.phone ? "text-red-500" : "text-soft"
                } absolute left-3.5 top-3 pointer-events-none transition-colors`}
              />
              <input
                id="rg-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                aria-invalid={Boolean(errors.phone)}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  onClearError?.("phone");
                }}
                placeholder="Contoh: 081234567890"
                className={getFieldCls("phone")}
              />
            </div>
            {errors.phone ? (
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
                <AlertCircle
                  size={13}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span>{errors.phone}</span>
              </span>
            ) : (
              <span className="text-2xs text-soft mt-1 block">
                Untuk pengiriman notifikasi kuota & verifikasi akun.
              </span>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="rg-email" className={labelCls}>
            Alamat Email Aktif
            <span className="text-red-500 ml-1 font-bold">*</span>
          </label>
          <div className="relative">
            <Mail
              size={16}
              className={`${
                errors.email ? "text-red-500" : "text-soft"
              } absolute left-3.5 top-3 pointer-events-none transition-colors`}
            />
            <input
              id="rg-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email)}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                onClearError?.("email");
              }}
              placeholder="Contoh: pemilik@samudera.co.id"
              className={getFieldCls("email")}
            />
          </div>
          {errors.email && (
            <span className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
              <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
              <span>{errors.email}</span>
            </span>
          )}
        </div>

        {/* Password & Konfirmasi Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="rg-pass" className={labelCls}>
              Kata Sandi
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="relative">
              <Lock
                size={16}
                className={`${
                  errors.password ? "text-red-500" : "text-soft"
                } absolute left-3.5 top-3 pointer-events-none transition-colors`}
              />
              <input
                id="rg-pass"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                required
                aria-invalid={Boolean(errors.password)}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  onClearError?.("password");
                }}
                placeholder="Minimal 8 karakter"
                className={`${getFieldCls("password")} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={
                  showPass ? "Sembunyikan kata sandi" : "Lihat kata sandi"
                }
                className="absolute right-2.5 top-2.5 p-1 text-soft hover:text-strong border-none bg-transparent cursor-pointer"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
                <AlertCircle
                  size={13}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span>{errors.password}</span>
              </span>
            )}
          </div>

          <div>
            <label htmlFor="rg-pass2" className={labelCls}>
              Konfirmasi Kata Sandi
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="relative">
              <Lock
                size={16}
                className={`${
                  errors.passwordConfirm ? "text-red-500" : "text-soft"
                } absolute left-3.5 top-3 pointer-events-none transition-colors`}
              />
              <input
                id="rg-pass2"
                name="passwordConfirm"
                type={showPassConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                aria-invalid={Boolean(errors.passwordConfirm)}
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value);
                  onClearError?.("passwordConfirm");
                }}
                placeholder="Ulangi kata sandi"
                className={`${getFieldCls("passwordConfirm")} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassConfirm(!showPassConfirm)}
                aria-label={
                  showPassConfirm
                    ? "Sembunyikan kata sandi"
                    : "Lihat kata sandi"
                }
                className="absolute right-2.5 top-2.5 p-1 text-soft hover:text-strong border-none bg-transparent cursor-pointer"
              >
                {showPassConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.passwordConfirm && (
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
                <AlertCircle
                  size={13}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span>{errors.passwordConfirm}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
