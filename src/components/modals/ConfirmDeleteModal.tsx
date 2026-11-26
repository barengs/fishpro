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
  message = "Yakin ingin menghapus data ini? Data yang sudah terhapus tidak bisa dikembalikan.",
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
      <div className="relative w-full max-w-105 bg-white dark:bg-[#0f1729] border border-[#e8ebf0] dark:border-[#1f2a42] rounded-[18px] shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-[12px] bg-rose-50 text-[#e11d48] dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-base font-bold text-[#0f172a] dark:text-[#e8edf7] tracking-tight">
              {title}
            </h2>
            <p className="m-0 mt-1.5 text-[13px] text-[#64718a] dark:text-[#98a6c0] leading-relaxed">
              {message}
            </p>
            {itemName && (
              <div className="mt-2.5 px-3 py-2 rounded-[10px] bg-[#f7f8fa] dark:bg-[#0a101d] border border-[#e8ebf0] dark:border-[#1f2a42] text-xs font-semibold text-[#0f172a] dark:text-[#e8edf7] truncate">
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
            className="h-[40px] px-4 rounded-[10px] border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-sm font-semibold text-[#0f172a] dark:text-[#e8edf7] cursor-pointer transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 h-[40px] px-4 rounded-[10px] border-0 bg-[#e11d48] hover:brightness-110 text-white text-sm font-semibold cursor-pointer transition-all disabled:opacity-60"
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
