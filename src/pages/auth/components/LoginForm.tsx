import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { authService } from "../../../services/auth";
import { useToast } from "../../../components/toast";
import { loginSchema } from "../../../utils/schemas";

interface LoginFormProps {
  demoCredentials?: { username: string; password: string } | null;
}

export function LoginForm({ demoCredentials }: LoginFormProps = {}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const isSessionExpired = searchParams.get("expired") === "1";
  const redirectTarget = searchParams.get("redirect");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (demoCredentials) {
      setIdentifier(demoCredentials.username);
      setPassword(demoCredentials.password);
      setFieldErrors({});
      setErrorMsg(null);
    }
  }, [demoCredentials]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse({
      username: identifier,
      password,
    });

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = String(issue.path[0] || "");
        if (key && !errors[key]) errors[key] = issue.message;
      });
      setFieldErrors(errors);
      const msg = parsed.error.issues[0]?.message || "Input tidak valid.";
      setErrorMsg(msg);
      toast.warning(msg);

      // Auto-focus first erroneous field
      const firstKey = Object.keys(errors)[0];
      const targetId =
        firstKey === "password" ? "login-password" : "login-identifier";
      setTimeout(() => document.getElementById(targetId)?.focus(), 50);
      return;
    }

    setFieldErrors({});
    setErrorMsg(null);
    setLoading(true);

    try {
      const data = await authService.login(parsed.data);

      toast.success(
        `Login berhasil. Selamat datang kembali, ${data.username}!`,
      );

      // Navigate directly to resolved role dashboard or return URL with replace: true to clean history stack
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
      setErrorMsg(message);
      setFieldErrors({ username: "Nama pengguna atau kata sandi tidak cocok", password: " " });
      setTimeout(
        () => document.getElementById("login-identifier")?.focus(),
        50,
      );
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getFieldCls = (fieldName: string) => {
    const hasError = Boolean(fieldErrors[fieldName]);
    return `w-full h-11 rounded-lg border text-[13.5px] transition-all bg-white dark:bg-slate-900 text-ink dark:text-white placeholder:text-subtext shadow-subtle ${
      hasError
        ? "has-error border-red-500 dark:border-red-500 bg-red-50/40 dark:bg-red-950/20 text-red-950 dark:text-red-100"
        : "border-line dark:border-slate-700 focus:outline-hidden focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40"
    }`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isSessionExpired && !errorMsg && (
        <div
          role="status"
          className="flex items-center gap-2.5 p-3 px-3.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-500/20"
        >
          <AlertCircle
            size={15}
            className="shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
          <span>
            Sesi Anda telah berakhir demi keamanan. Silakan masuk kembali.
          </span>
        </div>
      )}

      {errorMsg && Object.keys(fieldErrors).length === 0 && (
        <div
          role="alert"
          className="flex items-center gap-2.5 p-3 px-3.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-500/20"
        >
          <AlertCircle
            size={15}
            className="shrink-0 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Field Username */}
      <div>
        <label
          htmlFor="login-identifier"
          className="block text-[12.5px] font-medium text-inkSoft dark:text-slate-300 mb-1.5"
        >
          Nama pengguna atau nomor registrasi
        </label>
        <div className="relative">
          <User
            size={16}
            className={`${
              fieldErrors.username ? "text-red-500" : "text-subtext"
            } absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors`}
            aria-hidden="true"
          />
          <input
            id="login-identifier"
            name="username"
            type="text"
            required
            autoComplete="username"
            aria-invalid={Boolean(fieldErrors.username)}
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.username;
                return next;
              });
              setErrorMsg(null);
            }}
            placeholder="REG-0412 atau admin_kkp"
            disabled={loading}
            className={`${getFieldCls("username")} pl-10 pr-3.5`}
          />
        </div>
        {fieldErrors.username && fieldErrors.username.trim() && (
          <span className="text-[11.5px] font-medium text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
            <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
            <span>{fieldErrors.username}</span>
          </span>
        )}
      </div>

      {/* Field Password */}
      <div>
        <label
          htmlFor="login-password"
          className="block text-[12.5px] font-medium text-inkSoft dark:text-slate-300 mb-1.5"
        >
          Kata sandi
        </label>
        <div className="relative">
          <Lock
            size={16}
            className={`${
              fieldErrors.password ? "text-red-500" : "text-subtext"
            } absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors`}
            aria-hidden="true"
          />
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            aria-invalid={Boolean(fieldErrors.password)}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((prev) => {
                const next = { ...prev };
                delete next.password;
                return next;
              });
              setErrorMsg(null);
            }}
            placeholder="Masukkan kata sandi akun"
            disabled={loading}
            className={`${getFieldCls("password")} pl-10 pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
            disabled={loading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md text-subtext hover:text-ink dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 border-none bg-transparent flex items-center justify-center cursor-pointer transition-colors"
          >
            {showPassword ? (
              <EyeOff size={16} aria-hidden="true" />
            ) : (
              <Eye size={16} aria-hidden="true" />
            )}
          </button>
        </div>
        {fieldErrors.password && fieldErrors.password.trim() && (
          <span className="text-[11.5px] font-medium text-red-600 dark:text-red-400 mt-1 flex items-center gap-1.5 animate-in fade-in duration-150">
            <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
            <span>{fieldErrors.password}</span>
          </span>
        )}
      </div>

      {/* Remember Me & Forgot Password Row */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-slate-700 accent-brand-600 cursor-pointer"
          />
          <span className="text-[12.5px] font-medium text-inkSoft dark:text-slate-300">
            Ingat saya selama 30 hari
          </span>
        </label>
        <Link
          to="/reset-password"
          className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700 dark:text-blue-400 no-underline transition-colors"
        >
          Lupa kata sandi?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-[13.5px] font-semibold shadow-subtle transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99] mt-1"
      >
        {loading && (
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
        )}
        <span>{loading ? "Memproses masuk..." : "Masuk"}</span>
      </button>
    </form>
  );
}
