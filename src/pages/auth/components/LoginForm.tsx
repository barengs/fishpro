import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { authService } from "../../../services/auth";
import { useToast } from "../../../components/toast";
import { loginSchema } from "../../../utils/schemas";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const toast = useToast();

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

      // Navigate based on backend user_as or roles
      const role = data.user_as || (data.roles && data.roles[0]) || "owner";
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "regulator") {
        navigate("/regulator");
      } else if (role === "captain") {
        navigate("/captain");
      } else {
        navigate("/owner");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Gagal masuk. Periksa kembali nama pengguna dan kata sandi.";
      setErrorMsg(message);
      setFieldErrors({ username: "Kredensial tidak valid", password: " " });
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
    return `w-full h-11 border-2 rounded-xl text-sm field-input transition-all surface-card text-strong placeholder:text-soft ${
      hasError
        ? "has-error border-red-500 dark:border-red-500 bg-red-50/40 dark:bg-red-950/20 text-red-950 dark:text-red-100"
        : "border-fco-border dark:border-fco-border-dark focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15"
    }`;
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2.5 p-3 px-4 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-500/20"
        >
          <AlertCircle
            size={16}
            className="shrink-0 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
          <span>{errorMsg}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="login-identifier"
          className="block text-sm font-semibold text-strong mb-2"
        >
          Nama pengguna atau nomor registrasi
          <span
            className="text-red-500 ml-1 font-bold"
            aria-label="wajib diisi"
            title="Wajib diisi"
          >
            *
          </span>
        </label>
        <div className="relative">
          <User
            size={18}
            className={`${
              fieldErrors.username ? "text-red-500" : "text-fco-placeholder"
            } absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors`}
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
            className={`${getFieldCls("username")} pl-11 pr-4`}
          />
        </div>
        {fieldErrors.username && fieldErrors.username.trim() && (
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-150">
            <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
            <span>{fieldErrors.username}</span>
          </span>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label
            htmlFor="login-password"
            className="text-sm font-semibold text-strong"
          >
            Kata sandi
            <span
              className="text-red-500 ml-1 font-bold"
              aria-label="wajib diisi"
              title="Wajib diisi"
            >
              *
            </span>
          </label>
          <Link
            to="/reset-password"
            className="text-sm font-semibold text-fco-blue hover:text-fco-blue-hover no-underline"
          >
            Lupa kata sandi?
          </Link>
        </div>
        <div className="relative">
          <Lock
            size={18}
            className={`${
              fieldErrors.password ? "text-red-500" : "text-fco-placeholder"
            } absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors`}
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
            placeholder="Masukkan kata sandi"
            disabled={loading}
            className={`${getFieldCls("password")} pl-11 pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-fco-placeholder hover:text-strong hover:surface-page border-none bg-transparent cursor-pointer transition-colors"
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        {fieldErrors.password && fieldErrors.password.trim() && (
          <span className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1.5 flex items-center gap-1.5 animate-in fade-in duration-150">
            <AlertCircle size={13} className="shrink-0" aria-hidden="true" />
            <span>{fieldErrors.password}</span>
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm sm:text-fco-md font-semibold cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        )}
        <span>{loading ? "Memproses..." : "Masuk"}</span>
      </button>
    </form>
  );
}
