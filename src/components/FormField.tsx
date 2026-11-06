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
          className="w-8 h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 shadow-2xs hover:shadow-xs border-none"
        >
          <Eye size={15} strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Ubah Data"
          aria-label="Ubah Data"
          className="w-8 h-8 rounded-md bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 shadow-2xs hover:shadow-xs border-none"
        >
          <Pencil size={14} strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          title="Hapus Data"
          aria-label="Hapus Data"
          className="w-8 h-8 rounded-md bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-90 shadow-2xs hover:shadow-xs border-none"
        >
          <Trash2 size={14} strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
