import { Loader2 } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  flex?: number
  align?: 'left' | 'center' | 'right'
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  emptyText?: string
  loading?: boolean
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyText = 'Belum ada data.',
  loading = false,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-180">
        <div className="flex items-center py-2.5 text-xs font-semibold text-soft">
          {columns.map((c) => (
            <div
              key={c.key}
              style={{ flex: c.flex ?? 1 }}
              className={c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}
            >
              {c.header}
            </div>
          ))}
        </div>
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-sm text-soft">
            <Loader2 size={24} className="animate-spin text-fco-blue" aria-hidden="true" />
            <span>Memuat data...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-soft">{emptyText}</div>
        ) : (
          rows.map((row) => (
            <div key={rowKey(row)} className="flex items-center py-4 border-t border-fco-border-subtle">
              {columns.map((c) => (
                <div
                  key={c.key}
                  style={{ flex: c.flex ?? 1 }}
                  className={c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : ''}
                >
                  {c.render(row)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
