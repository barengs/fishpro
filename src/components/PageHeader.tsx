import { NotificationBell } from './NotificationBell'

interface PageHeaderProps {
  title: string
  desc: string
  actions?: React.ReactNode
  showSearch?: boolean
  searchPlaceholder?: string
}

export function PageHeader({ title, desc, actions, showSearch, searchPlaceholder }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div>
        <h1 className="m-0 text-3xl font-extrabold tracking-tight">{title}</h1>
        <div className="text-sm text-fco-muted mt-1">{desc}</div>
      </div>
      <div className="flex items-center gap-3">
        {showSearch && (
          <div className="relative">
            <svg className="w-4.5 h-4.5 stroke-fco-muted absolute left-3 top-2.5 pointer-events-none" viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input type="search" placeholder={searchPlaceholder ?? 'Cari...'} className="w-full sm:w-65 h-10 border border-fco-border rounded-fco pl-9.5 pr-3 text-sm bg-white text-fco-dark focus:outline-none focus:border-fco-blue transition-colors" />
          </div>
        )}
        {actions}
        <NotificationBell />
      </div>
    </div>
  )
}
