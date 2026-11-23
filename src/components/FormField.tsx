import { Eye, Pencil, Trash2 } from "lucide-react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

export function FormField({
  label,
  htmlFor,
  hint,
  required,
  optional,
  children,
}: FormFieldProps) {
  const isOptional = Boolean(optional);

  return (
    <div>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-semibold text-strong mb-1.5"
        >
          {label}
          {required && (
            <span
              className="text-red-500 ml-1 font-bold"
              aria-label="wajib diisi"
              title="Wajib diisi"
            >
              *
            </span>
          )}
          {isOptional && (
            <span className="text-soft font-normal text-xs ml-1">
              (opsional)
            </span>
          )}
        </label>
      ) : null}
      {children}
      {hint && <span className="text-xs text-soft mt-1 block">{hint}</span>}
    </div>
  );
}

export const inputCls =
  "w-full h-11 border-2 border-fco-border dark:border-fco-border-dark rounded-xl px-3.5 text-sm field-input focus:outline-hidden focus:border-fco-blue focus:ring-2 focus:ring-fco-blue/15 transition-all surface-card text-strong placeholder:text-soft";

interface SegmentedControlProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  required?: boolean;
  optional?: boolean;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  required,
  optional,
}: SegmentedControlProps<T>) {
  const isOptional = optional ?? !required;

  return (
    <div>
      <span className="block text-sm font-semibold text-strong mb-2">
        {label}
        {required && (
          <span
            className="text-red-500 ml-1 font-bold"
            aria-label="mandatory"
            title="Mandatory"
          >
            *
          </span>
        )}
        {isOptional && (
          <span className="text-soft font-normal text-xs ml-1.5">
            (optional)
          </span>
        )}
      </span>
      <div
        className="grid grid-cols-2 gap-1 p-1 rounded-xl surface-inset border"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((o) => {
          const selected = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              className={`h-11 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all ${
                selected
                  ? "bg-fco-blue text-white shadow-xs"
                  : "bg-transparent text-soft hover:text-strong"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CrudActions({
  onDetail,
  onEdit,
  onDelete,
}: {
  onDetail?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-1.5 justify-end shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      {onDetail && (
        <button
          type="button"
          onClick={onDetail}
          title="Lihat Detail"
          aria-label="Lihat Detail"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-charcoal hover:text-ink dark:text-slate-300 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors shadow-subtle"
        >
          <Eye size={14} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Ubah Data"
          aria-label="Ubah Data"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 dark:hover:bg-amber-950/40 dark:hover:text-amber-400 dark:hover:border-amber-800 text-charcoal dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-subtle"
        >
          <Pencil size={13} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Hapus Data"
          aria-label="Hapus Data"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-800 text-charcoal dark:text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-subtle"
        >
          <Trash2 size={13} strokeWidth={1.8} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
