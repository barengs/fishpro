import { useEffect } from "react";
import { X } from "lucide-react";

interface CrudModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  children: React.ReactNode;
  wide?: boolean;
  hideFooter?: boolean;
}

export function CrudModal({
  open,
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel = "Simpan",
  children,
  wide = false,
  hideFooter = false,
}: CrudModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#09090B]/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${wide ? "max-w-220" : "max-w-135"} bg-white dark:bg-[#0f1729] border border-[#e8ebf0] dark:border-[#1f2a42] rounded-[18px] shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]`}
      >
        <div className="shrink-0 bg-white dark:bg-[#0f1729] border-b border-[#e8ebf0] dark:border-[#1f2a42] px-6 sm:px-7 pt-6 pb-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="m-0 text-lg sm:text-xl font-bold tracking-[-0.01em] text-[#0f172a] dark:text-[#e8edf7] leading-snug">
              {title}
            </h2>
            {subtitle && (
              <p className="m-0 mt-1 text-[13px] text-[#64718a] dark:text-[#98a6c0] leading-relaxed [overflow-wrap:anywhere]">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-[9px] border-0 bg-transparent text-[#64718a] hover:text-[#0f172a] dark:text-[#98a6c0] dark:hover:text-[#e8edf7] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {hideFooter || !onSubmit ? (
          <div className="px-6 sm:px-7 py-5 overflow-y-auto overflow-x-hidden flex-1">
            {children}
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="px-6 sm:px-7 py-5 overflow-y-auto overflow-x-hidden flex-1 flex flex-col gap-4">
              {children}
            </div>
            <div className="px-6 sm:px-7 py-4 border-t border-[#e8ebf0] dark:border-[#1f2a42] bg-[#f7f8fa]/70 dark:bg-[#0a101d]/40 flex gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-[44px] rounded-[10px] border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] text-sm font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 h-[44px] rounded-[10px] border-0 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#5b94ff] dark:hover:bg-[#78a7ff] text-white text-sm font-semibold cursor-pointer transition-colors shadow-none"
              >
                {submitLabel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
