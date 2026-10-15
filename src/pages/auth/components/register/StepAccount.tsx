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
  "w-full h-11 border border-fco-border rounded-xl px-3.5 text-sm field-input focus:outline-none focus:border-fco-blue";
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
  return (
    <div>
      <h3 className="m-0 mb-1 text-base sm:text-lg font-extrabold text-strong">
        Buat akun masuk
      </h3>
      <p className="m-0 mb-5 text-sm text-soft">
        Kredensial wajib untuk autentikasi sistem.
      </p>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="rg-user" className={labelCls}>
              Username
              <span
                className="text-red-500 ml-1 font-bold"
                aria-label="mandatory"
                title="Mandatory"
              >
                *
              </span>
            </label>
            <input
              id="rg-user"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tanpa spasi"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="rg-phone" className={labelCls}>
              WA
              <span className="text-soft font-normal text-xs ml-1.5">
                (optional)
              </span>
            </label>
            <input
              id="rg-phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08..."
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="rg-email" className={labelCls}>
            Email
            <span
              className="text-red-500 ml-1 font-bold"
              aria-label="mandatory"
              title="Mandatory"
            >
              *
            </span>
          </label>
          <input
            id="rg-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className={inputCls}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="rg-pass" className={labelCls}>
              Kata sandi
              <span
                className="text-red-500 ml-1 font-bold"
                aria-label="mandatory"
                title="Mandatory"
              >
                *
              </span>
            </label>
            <input
              id="rg-pass"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="rg-pass2" className={labelCls}>
              Ulangi sandi
              <span
                className="text-red-500 ml-1 font-bold"
                aria-label="mandatory"
                title="Mandatory"
              >
                *
              </span>
            </label>
            <input
              id="rg-pass2"
              type="password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Sama seperti di kiri"
              className={inputCls}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
