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
      {/* Backdrop — true scrim, no glow */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Dialog — refined rect, no pill, controlled width */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-140 surface-card border dark:border-fco-border-dark rounded-2xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[88vh]"
      >
        {/* Header: editorial rhythm, generous whitespace */}
        <div className="px-6 sm:px-7 pt-6 sm:pt-7 pb-5 border-b border-fco-border-subtle flex items-start justify-between gap-5 shrink-0">
          <div className="min-w-0 flex-1">
            {subtitle && (
              <p className="m-0 mb-1.5 text-2xs font-bold text-fco-blue uppercase tracking-widest">
                {subtitle}
              </p>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="m-0 text-xl sm:text-2xl font-extrabold tracking-tight text-strong text-balance">
                {title}
              </h2>
              {badge}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="w-8 h-8 rounded-full surface-inset border dark:border-fco-border-dark text-soft hover:text-strong hover:surface-page flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content: hairline definition list, no card-in-card noise */}
        <div className="px-6 sm:px-7 py-2 overflow-y-auto flex-1">
          <dl className="m-0 divide-y divide-fco-border-subtle">
            {fields.map((f, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 gap-0.5 sm:gap-3 py-3.5 ${
                  f.fullWidth
                    ? ""
                    : "sm:grid-cols-[180px_minmax(0,1fr)] sm:items-baseline"
                }`}
              >
                <dt className="text-xs font-medium text-soft leading-relaxed">
                  {f.label}
                </dt>
                <dd className="m-0 text-sm font-semibold text-strong wrap-break-word leading-relaxed min-w-0">
                  {f.value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Footer: quiet actions, subtle top rule */}
        <div className="px-6 sm:px-7 py-4 border-t border-fco-border-subtle flex items-center justify-end gap-2 shrink-0 surface-card">
          {actions}
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-xs sm:text-sm font-semibold text-soft hover:text-strong cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
