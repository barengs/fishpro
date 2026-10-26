import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";

export type AlertVariant = "success" | "error" | "warning" | "info";

interface AlertBannerProps {
  variant?: AlertVariant;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles: Record<
  AlertVariant,
  { container: string; icon: typeof CheckCircle }
> = {
  success: {
    container:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
    icon: CheckCircle,
  },
  error: {
    container:
      "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20",
    icon: AlertTriangle,
  },
  warning: {
    container:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
    icon: AlertTriangle,
  },
  info: {
    container:
      "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    icon: Info,
  },
};

export function AlertBanner({
  variant = "success",
  message,
  onDismiss,
  className = "",
}: AlertBannerProps) {
  if (!message) return null;

  const style = variantStyles[variant];
  const Icon = style.icon;

  return (
    <div
      role="alert"
      className={`p-3.5 px-4.5 rounded-xs text-sm font-semibold mb-5 border flex items-center justify-between gap-3 ${style.container} ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon size={16} className="shrink-0" aria-hidden="true" />
        <span className="break-words">{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup notifikasi"
          className="p-1 rounded-xs opacity-70 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
