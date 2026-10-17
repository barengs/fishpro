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
  const isOptional = optional ?? !required;

  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-strong mb-2"
      >
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
      </label>
      {children}
      {hint && <span className="text-xs text-soft mt-1 block">{hint}</span>}
    </div>
  );
}

export const inputCls =
  "w-full h-13 border rounded-xl px-3.5 text-fco-md field-input focus:outline-hidden focus:border-fco-blue transition-colors";

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
          className="w-8 h-8 rounded-lg border border-blue-200 dark:border-blue-700/60 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-300 hover:bg-fco-blue hover:text-white hover:border-fco-blue dark:hover:bg-fco-blue dark:hover:text-white flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 active:translate-y-0.5 shadow-2xs hover:shadow-xs"
        >
          <Eye size={15} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Ubah Data"
          aria-label="Ubah Data"
          className="w-8 h-8 rounded-lg border border-amber-200 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 hover:bg-amber-500 hover:text-white hover:border-amber-500 dark:hover:bg-amber-500 dark:hover:text-white flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 active:translate-y-0.5 shadow-2xs hover:shadow-xs"
        >
          <Pencil size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Hapus Data"
          aria-label="Hapus Data"
          className="w-8 h-8 rounded-lg border border-rose-200 dark:border-rose-700/60 bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-300 hover:bg-rose-600 hover:text-white hover:border-rose-600 dark:hover:bg-rose-600 dark:hover:text-white flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 active:translate-y-0.5 shadow-2xs hover:shadow-xs"
        >
          <Trash2 size={14} strokeWidth={2.2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
