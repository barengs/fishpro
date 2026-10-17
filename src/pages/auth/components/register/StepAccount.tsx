import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";

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
}

const inputCls =
  "w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl px-3.5 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft";
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
}: StepAccountProps) {
  const [showPass, setShowPass] = useState(false);
  const [showPassConfirm, setShowPassConfirm] = useState(false);

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
                className="text-soft absolute left-3.5 top-3 pointer-events-none"
              />
              <input
                id="rg-user"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))
                }
                placeholder="Contoh: kapalsamudera"
                className={`${inputCls} pl-10`}
              />
            </div>
            <span className="text-2xs text-soft mt-1 block">
              Gunakan huruf kecil, angka, atau underscore tanpa spasi.
            </span>
          </div>

          <div>
            <label htmlFor="rg-phone" className={labelCls}>
              Nomor WhatsApp / Telepon
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="relative">
              <Phone
                size={16}
                className="text-soft absolute left-3.5 top-3 pointer-events-none"
              />
              <input
                id="rg-phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 081234567890"
                className={`${inputCls} pl-10`}
              />
            </div>
            <span className="text-2xs text-soft mt-1 block">
              Untuk pengiriman notifikasi kuota & verifikasi akun.
            </span>
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
              className="text-soft absolute left-3.5 top-3 pointer-events-none"
            />
            <input
              id="rg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: pemilik@samudera.co.id"
              className={`${inputCls} pl-10`}
            />
          </div>
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
                className="text-soft absolute left-3.5 top-3 pointer-events-none"
              />
              <input
                id="rg-pass"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className={`${inputCls} pl-10 pr-10`}
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
          </div>

          <div>
            <label htmlFor="rg-pass2" className={labelCls}>
              Konfirmasi Kata Sandi
              <span className="text-red-500 ml-1 font-bold">*</span>
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="text-soft absolute left-3.5 top-3 pointer-events-none"
              />
              <input
                id="rg-pass2"
                type={showPassConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="Ulangi kata sandi"
                className={`${inputCls} pl-10 pr-10`}
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
          </div>
        </div>
      </div>
    </div>
  );
}
