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
        className="absolute inset-0 bg-fco-dark/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-140 surface-card border dark:border-fco-border-dark rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-fco-border-subtle flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="m-0 text-lg sm:text-xl font-extrabold tracking-tight text-strong truncate">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <p className="m-0 mt-1 text-xs text-soft leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 -mr-1 -mt-1 rounded-lg text-soft hover:text-strong hover:surface-page border-none bg-transparent cursor-pointer transition-colors"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl surface-inset border dark:border-fco-border-dark ${
                  f.fullWidth ? "sm:col-span-2" : ""
                }`}
              >
                <div className="text-2xs font-bold text-soft uppercase tracking-wider mb-1">
                  {f.label}
                </div>
                <div className="text-sm font-semibold text-strong break-words leading-relaxed">
                  {f.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-5 sm:px-6 border-t border-fco-border-subtle flex items-center justify-end gap-2.5 shrink-0 surface-page">
          {actions}
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4.5 rounded-xl border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-sm font-semibold text-strong cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
