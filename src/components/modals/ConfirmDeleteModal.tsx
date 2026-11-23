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
        className="absolute inset-0 bg-[#09090B]/30 backdrop-blur-[2px] transition-opacity"
        onClick={() => !loading && onClose()}
      />
      <div className="relative w-full max-w-105 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-2xl shadow-popover p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-base font-bold text-ink dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="m-0 mt-1.5 text-xs text-subtext dark:text-slate-400 leading-relaxed">
              {message}
            </p>
            {itemName && (
              <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#F9FAFB] dark:bg-slate-800/60 border border-[#E5E7EB] dark:border-slate-800 text-xs font-semibold text-ink dark:text-white truncate">
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
            className="h-9 px-3.5 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-xs font-semibold text-charcoal dark:text-slate-200 cursor-pointer transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg border-none bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer transition-colors shadow-subtle disabled:opacity-60"
          >
            {loading && (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
