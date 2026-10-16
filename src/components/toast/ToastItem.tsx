import { useEffect } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";
import type { Toast, ToastType } from "./types";

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  { icon: typeof CheckCircle2; container: string; iconCls: string }
> = {
  success: {
    icon: CheckCircle2,
    container:
      "border-emerald-500/20 bg-emerald-50/95 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-100",
    iconCls: "text-emerald-600 dark:text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    container:
      "border-rose-500/20 bg-rose-50/95 dark:bg-rose-950/80 text-rose-950 dark:text-rose-100",
    iconCls: "text-rose-600 dark:text-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    container:
      "border-amber-500/20 bg-amber-50/95 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100",
    iconCls: "text-amber-600 dark:text-amber-400",
  },
  info: {
    icon: Info,
    container:
      "border-blue-500/20 bg-blue-50/95 dark:bg-blue-950/80 text-blue-950 dark:text-blue-100",
    iconCls: "text-fco-blue dark:text-blue-400",
  },
};

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, type, message, duration = 3500 } = toast;
  const cfg = toastStyles[type] || toastStyles.info;
  const Icon = cfg.icon;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto flex items-start gap-3 w-80 max-w-[calc(100vw-2rem)] p-3.5 rounded-xl border backdrop-blur-md shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 ${cfg.container}`}
    >
      <Icon
        size={18}
        className={`shrink-0 mt-0.5 ${cfg.iconCls}`}
        aria-hidden="true"
      />
      <div className="flex-1 text-sm font-medium leading-snug break-words">
        {message}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Tutup notifikasi"
        className="p-1 -mr-1 -mt-1 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  );
}
