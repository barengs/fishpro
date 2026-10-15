import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User } from "lucide-react";

interface UserProfileBadgeProps {
  initials: string;
  name: string;
  role: string;
  avatarBg?: string;
  onLogout?: () => void;
}

export function UserProfileBadge({
  initials,
  name,
  role,
  avatarBg = "#1A56DB",
  onLogout,
}: UserProfileBadgeProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [dropdownOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        aria-label="Menu profil pengguna"
        className="flex items-center gap-3 p-1.5 rounded-xl border-none bg-transparent hover:surface-page cursor-pointer transition-colors"
      >
        <div
          className="w-9 h-9 rounded-full text-white text-fco-sm font-bold flex items-center justify-center shrink-0"
          style={{ backgroundColor: avatarBg }}
        >
          {initials}
        </div>
        <div className="min-w-0 text-left hidden sm:block">
          <div className="text-sm font-semibold text-strong truncate max-w-40">
            {name}
          </div>
          <div className="text-xs text-soft whitespace-nowrap">{role}</div>
        </div>
        <ChevronDown
          size={16}
          className={`text-soft transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          strokeWidth={2}
          aria-hidden="true"
        />
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 surface-card border rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2.5 border-b border-fco-border-subtle mb-1">
            <div className="text-sm font-bold text-strong truncate">{name}</div>
            <div className="text-xs text-soft">{role}</div>
          </div>
          <a
            href="#profil"
            role="menuitem"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-strong hover:surface-page no-underline transition-colors"
          >
            <User
              size={16}
              className="text-soft"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            Profil saya
          </a>
          {onLogout && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setDropdownOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 border-none bg-transparent cursor-pointer transition-colors"
            >
              <LogOut size={16} strokeWidth={1.8} aria-hidden="true" />
              Keluar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
