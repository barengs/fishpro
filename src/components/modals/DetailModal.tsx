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
        className="relative w-full max-w-[540px] bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
      >
        {/* Clean, Focused Header */}
        <div className="px-7 sm:px-8 pt-7 sm:pt-8 pb-5 border-b border-[#E5E7EB] dark:border-slate-800 flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="m-0 text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-white leading-tight">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <p className="m-0 mt-2 text-xs sm:text-[13px] text-subtext dark:text-slate-400 font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content: Clean 2-column Grid matching the reference */}
        <div className="px-7 sm:px-8 py-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            {fields.map((f, idx) => (
              <div
                key={idx}
                className={f.fullWidth ? "col-span-full" : "col-span-1"}
              >
                <div className="text-xs text-subtext dark:text-slate-400 font-normal">
                  {f.label}
                </div>
                <div className="mt-1 text-sm font-bold text-ink dark:text-white leading-relaxed">
                  {f.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer: Only render if custom actions are provided */}
        {actions && (
          <div className="px-7 sm:px-8 py-3 border-t border-[#E5E7EB] dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0 bg-gray-50/50 dark:bg-slate-800/30">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
