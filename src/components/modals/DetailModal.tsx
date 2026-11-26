import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

export interface DetailField {
  label: string;
  value: ReactNode;
  fullWidth?: boolean;
}

export interface DetailModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  fields: DetailField[];
  onClose: () => void;
  actions?: ReactNode;
}

export function DetailModal({
  open,
  title,
  subtitle,
  badge,
  fields,
  onClose,
  actions,
}: DetailModalProps) {
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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#09090B]/30 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-[540px] bg-white dark:bg-[#0f1729] border border-[#e8ebf0] dark:border-[#1f2a42] rounded-[18px] shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Clean, Focused Header */}
        <div className="px-6 sm:px-7 pt-6 pb-4 border-b border-[#e8ebf0] dark:border-[#1f2a42] flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-[#0f172a] dark:text-[#e8edf7] leading-tight">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <p className="m-0 mt-1.5 text-[13px] text-[#64718a] dark:text-[#98a6c0] font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="w-8 h-8 rounded-[9px] border-0 bg-transparent text-[#64718a] hover:text-[#0f172a] dark:text-[#98a6c0] dark:hover:text-[#e8edf7] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content: Clean 2-column Grid matching the reference */}
        <div className="px-6 sm:px-7 py-5 overflow-y-auto overflow-x-hidden flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {fields.map((f, idx) => (
              <div
                key={idx}
                className={f.fullWidth ? "col-span-full" : "col-span-1"}
              >
                <div className="text-xs text-[#64718a] dark:text-[#98a6c0] font-normal">
                  {f.label}
                </div>
                <div className="mt-1 text-sm font-bold text-[#0f172a] dark:text-[#e8edf7] leading-relaxed [overflow-wrap:anywhere]">
                  {f.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Only render if custom actions are provided */}
        {actions && (
          <div className="px-6 sm:px-7 py-3.5 border-t border-[#e8ebf0] dark:border-[#1f2a42] flex items-center justify-end gap-2.5 shrink-0 bg-[#f7f8fa]/70 dark:bg-[#0a101d]/40">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
