import { useEffect } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

export interface ConfirmDeleteModalProps {
  open: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  open,
  title = "Konfirmasi Hapus",
  message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
  itemName,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, loading]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-fco-dark/50 backdrop-blur-xs transition-opacity"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-105 surface-card border dark:border-fco-border-dark rounded-xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-base font-bold text-strong tracking-tight">
              {title}
            </h2>
            <p className="m-0 mt-1.5 text-sm text-soft leading-relaxed">
              {message}
            </p>
            {itemName && (
              <div className="mt-2.5 px-3 py-2 rounded-lg surface-inset border dark:border-fco-border-dark text-xs font-semibold text-strong truncate">
                {itemName}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 justify-end mt-6">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-sm font-semibold text-strong cursor-pointer transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg border-none bg-red-600 hover:bg-red-700 text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs disabled:opacity-60"
          >
            {loading && (
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
