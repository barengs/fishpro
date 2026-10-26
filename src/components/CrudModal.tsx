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
        className="absolute inset-0 bg-fco-dark/50 backdrop-blur-xs"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${wide ? "max-w-220" : "max-w-135"} overflow-y-auto surface-card border rounded-xs shadow-2xl`}
        style={{ maxHeight: "90vh" }}
      >
        <div className="sticky top-0 z-10 surface-card border-b border-fco-border px-5 sm:px-6 py-4 flex items-start justify-between gap-4 rounded-t-xs">
          <div>
            <h2 className="m-0 text-lg font-extrabold tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="m-0 mt-1 text-sm text-soft">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-8 h-8 rounded-xs border border-fco-border bg-transparent hover:surface-page flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        {hideFooter || !onSubmit ? (
          <div className="px-5 sm:px-6 py-5">{children}</div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="px-6 sm:px-8 py-6 flex flex-col gap-4"
          >
            {children}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-11 rounded-xs border border-fco-border bg-transparent hover:surface-page text-sm font-semibold cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 h-11 rounded-xs border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-bold cursor-pointer transition-colors shadow-xs"
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
