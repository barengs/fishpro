interface FormFieldProps {
  label: string
  htmlFor: string
  hint?: string
  required?: boolean
  optional?: boolean
  children: React.ReactNode
}

export function FormField({ label, htmlFor, hint, required, optional, children }: FormFieldProps) {
  const isOptional = optional ?? (!required)

  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-strong mb-2">
        {label}
        {required && (
          <span className="text-red-500 ml-1 font-bold" aria-label="mandatory" title="Mandatory">*</span>
        )}
        {isOptional && (
          <span className="text-soft font-normal text-xs ml-1.5">(optional)</span>
        )}
      </label>
      {children}
      {hint && <span className="text-xs text-soft mt-1 block">{hint}</span>}
    </div>
  )
}

export const inputCls = 'w-full h-13 border rounded-xl px-3.5 text-fco-md field-input focus:outline-none focus:border-fco-blue transition-colors'

interface SegmentedControlProps<T extends string> {
  label: string
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  required?: boolean
  optional?: boolean
}

export function SegmentedControl<T extends string>({ label, options, value, onChange, required, optional }: SegmentedControlProps<T>) {
  const isOptional = optional ?? (!required)

  return (
    <div>
      <span className="block text-sm font-semibold text-strong mb-2">
        {label}
        {required && (
          <span className="text-red-500 ml-1 font-bold" aria-label="mandatory" title="Mandatory">*</span>
        )}
        {isOptional && (
          <span className="text-soft font-normal text-xs ml-1.5">(optional)</span>
        )}
      </span>
      <div className="grid grid-cols-2 gap-1 p-1 rounded-xl surface-inset border" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const selected = value === o.value
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.value)}
              className={`h-11 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all ${
                selected ? 'bg-fco-blue text-white shadow-xs' : 'bg-transparent text-soft hover:text-strong'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function CrudActions({ onEdit, onDelete }: { onEdit?: () => void; onDelete?: () => void }) {
  return (
    <div className="flex gap-2 justify-end">
      {onEdit && (
        <button type="button" onClick={onEdit} className="px-3 py-1.5 rounded-lg border border-fco-border bg-white hover:surface-page text-fco-blue text-xs font-semibold cursor-pointer transition-colors">
          Ubah
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={onDelete} className="px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-600 text-xs font-semibold cursor-pointer transition-colors">
          Hapus
        </button>
      )}
    </div>
  )
}
