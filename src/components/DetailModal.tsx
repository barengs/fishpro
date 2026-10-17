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
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-130 surface-card border dark:border-fco-border-dark rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
      >
        {/* Clean, Focused Header */}
        <div className="px-6 py-4 border-b border-fco-border-subtle flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="m-0 text-base sm:text-lg font-bold tracking-tight text-strong truncate">
                {title}
              </h2>
              {badge}
            </div>
            {subtitle && (
              <p className="m-0 mt-0.5 text-xs text-soft font-normal truncate">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail"
            className="w-8 h-8 rounded-lg surface-inset hover:surface-page text-soft hover:text-strong flex items-center justify-center cursor-pointer border border-fco-border-subtle transition-colors shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* Content: Clean Definition Rows */}
        <div className="px-6 py-2 overflow-y-auto flex-1">
          <dl className="m-0 divide-y divide-fco-border-subtle">
            {fields.map((f, idx) => (
              <div
                key={idx}
                className={`py-3 ${
                  f.fullWidth
                    ? "flex flex-col gap-1"
                    : "grid grid-cols-1 sm:grid-cols-[160px_minmax(0,1fr)] gap-1 sm:gap-3 sm:items-baseline"
                }`}
              >
                <dt className="text-xs text-soft font-medium">{f.label}</dt>
                <dd className="m-0 text-sm font-semibold text-strong wrap-break-word leading-relaxed min-w-0">
                  {f.value || "—"}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-fco-border-subtle flex items-center justify-end gap-2.5 shrink-0 surface-card">
          {actions}
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-strong cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
