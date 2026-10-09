import { useEffect } from 'react'
import { X } from 'lucide-react'

interface CrudModalProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  submitLabel?: string
  children: React.ReactNode
  wide?: boolean
}

export function CrudModal({ open, title, subtitle, onClose, onSubmit, submitLabel = 'Simpan', children, wide = false }: CrudModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose ])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-fco-dark/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${wide ? 'max-w-220' : 'max-w-135'} max-h-[90vh] overflow-y-auto surface-card border rounded-3xl shadow-2xl`}>
        <div className="sticky top-0 surface-card border-b border-fco-border px-6 sm:px-8 py-5 flex items-start justify-between gap-4 rounded-t-3xl">
          <div>
            <h2 className="m-0 text-xl font-extrabold tracking-tight">{title}</h2>
            {subtitle && <p className="m-0 mt-1 text-sm text-soft">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="w-9 h-9 rounded-fco border border-fco-border bg-transparent hover:surface-page flex items-center justify-center cursor-pointer transition-colors shrink-0">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="px-6 sm:px-8 py-6 flex flex-col gap-4">
          {children}
          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="h-12 px-6 rounded-xl border border-fco-border bg-transparent hover:surface-page text-sm font-semibold cursor-pointer transition-colors">
              Batal
            </button>
            <button type="submit" className="flex-1 h-12 rounded-xl border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-fco-md font-semibold cursor-pointer transition-colors">
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
