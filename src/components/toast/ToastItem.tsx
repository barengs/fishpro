import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, X } from "lucide-react";
import type { Toast, ToastType } from "./types";

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastStyles: Record<
  ToastType,
  {
    icon: typeof CheckCircle2;
    container: string;
    iconCls: string;
    barCls: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    container:
      "border-emerald-500/20 bg-emerald-50/95 dark:bg-emerald-950/85 text-emerald-950 dark:text-emerald-100",
    iconCls: "text-emerald-600 dark:text-emerald-400",
    barCls: "bg-emerald-500 dark:bg-emerald-400",
  },
  error: {
    icon: AlertCircle,
    container:
      "border-rose-500/20 bg-rose-50/95 dark:bg-rose-950/85 text-rose-950 dark:text-rose-100",
    iconCls: "text-rose-600 dark:text-rose-400",
    barCls: "bg-rose-500 dark:bg-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    container:
      "border-amber-500/20 bg-amber-50/95 dark:bg-amber-950/85 text-amber-950 dark:text-amber-100",
    iconCls: "text-amber-600 dark:text-amber-400",
    barCls: "bg-amber-500 dark:bg-amber-400",
  },
};

export function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const { id, type, message, duration = 3500 } = toast;
  const cfg = toastStyles[type] || toastStyles.success;
  const Icon = cfg.icon;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: 80,
        scale: 0.9,
        transition: { duration: 0.2, ease: "easeIn" },
      }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative overflow-hidden flex flex-col w-84 max-w-[calc(100vw-2rem)] rounded-xl border backdrop-blur-md shadow-xl ${cfg.container}`}
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      <div className="flex items-start gap-3 p-3.5">
        <Icon
          size={18}
          className={`shrink-0 mt-0.5 ${cfg.iconCls}`}
          aria-hidden="true"
        />
        <div className="flex-1 text-sm font-medium leading-snug wrap-break-word">
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

      {duration > 0 && (
        <div className="w-full h-1 bg-black/5 dark:bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`h-full ${cfg.barCls}`}
          />
        </div>
      )}
    </motion.div>
  );
}
