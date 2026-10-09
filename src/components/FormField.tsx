interface FormFieldProps {
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}

export function FormField({ label, htmlFor, hint, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-strong mb-2">{label}</label>
      {children}
      {hint && <span className="text-xs text-soft mt-1 block">{hint}</span>}
    </div>
  )
}

export const inputCls = 'w-full h-13 border rounded-xl px-3.5 text-fco-md field-input focus:outline-none focus:border-fco-blue transition-colors'

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
