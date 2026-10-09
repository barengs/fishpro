interface NotificationBellProps {
  count?: number
  onClick?: () => void
}

export function NotificationBell({ count, onClick }: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifikasi"
      className="w-10 h-10 border border-[#DCE6F5] rounded-[10px] bg-white hover:bg-[#F6F9FE] transition-colors cursor-pointer flex items-center justify-center relative"
    >
      <svg
        className="w-[18px] h-[18px] stroke-[#0F1F3D]"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16zM10 21h4" />
      </svg>
      {Boolean(count && count > 0) && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1A56DB]" />
      )}
    </button>
  )
}
