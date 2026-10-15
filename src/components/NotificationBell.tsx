interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
}

import { Bell } from "lucide-react";

export function NotificationBell({ count, onClick }: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Notifikasi"
      className="w-10 h-10 border border-fco-border rounded-fco bg-white hover:surface-page transition-colors cursor-pointer flex items-center justify-center relative"
    >
      <Bell
        size={18}
        className="text-strong"
        strokeWidth={1.8}
        aria-hidden="true"
      />
      {Boolean(count && count > 0) && (
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fco-blue" />
      )}
    </button>
  );
}
