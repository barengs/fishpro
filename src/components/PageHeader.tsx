interface PageHeaderProps {
  title: string
  desc: string
  actions?: React.ReactNode
  showSearch?: boolean
  searchPlaceholder?: string
}

import { Search } from 'lucide-react'

export function PageHeader({ title, desc, actions, showSearch, searchPlaceholder }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div>
        <h1 className="m-0 text-3xl font-extrabold tracking-tight">{title}</h1>
        <div className="text-sm text-soft mt-1">{desc}</div>
      </div>
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <Search size={18} className="text-soft absolute left-3 top-2.5 pointer-events-none" strokeWidth={1.8} aria-hidden="true" />
            <input type="search" placeholder={searchPlaceholder ?? 'Cari...'} className="w-full sm:w-65 h-10 border rounded-fco pl-9.5 pr-3 text-sm field-input focus:outline-none focus:border-fco-blue transition-colors" />
          </div>
        )}
        {actions}
      </div>
    </div>
  )
}
