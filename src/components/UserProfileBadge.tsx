import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, LogOut, User } from "lucide-react";
import { RoleBadge } from "./RoleBadge";

interface UserProfileBadgeProps {
  initials: string;
  name: string;
  role: string;
  rawRole?: string;
  avatarBg?: string;
  onLogout?: () => void | Promise<void>;
  isLoggingOut?: boolean;
}

export function UserProfileBadge({
  initials,
  name,
  role,
  rawRole,
  avatarBg: _avatarBg,
  onLogout,
  isLoggingOut: externalLoggingOut,
}: UserProfileBadgeProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [internalLoggingOut, setInternalLoggingOut] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const isLoggingOut = externalLoggingOut ?? internalLoggingOut;

  const handleLogoutClick = async () => {
    if (!onLogout || isLoggingOut) return;
    setInternalLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setInternalLoggingOut(false);
      setDropdownOpen(false);
    }
  };

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
        aria-label={`Menu profil ${name} (${initials})`}
        className="flex items-center gap-2.5 pl-1 pr-1.5 py-1 rounded-lg border-none bg-transparent hover:bg-gray-100/70 dark:hover:bg-slate-800 transition-colors cursor-pointer text-left"
      >
        <div
          className="w-8 h-8 rounded-full bg-[#111827] text-white text-[11.5px] font-semibold flex items-center justify-center shrink-0 shadow-subtle"
        >
          {initials}
        </div>
        <div className="min-w-0 text-left hidden sm:block leading-tight">
          <div className="text-[13px] font-semibold text-ink dark:text-white truncate max-w-36">
            {name}
          </div>
          <div className="text-[11px] text-subtext dark:text-slate-400 whitespace-nowrap mt-0.5">{role}</div>
        </div>
        <ChevronDown
          size={14}
          className={`text-subtext dark:text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>

      {dropdownOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-800 rounded-xl shadow-popover p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-2 border-b border-[#E5E7EB] dark:border-slate-800 mb-1">
            <div className="text-[13px] font-semibold text-ink dark:text-white truncate">
              {name}
            </div>
            <div className="mt-1">
              <RoleBadge role={rawRole || role} size="sm" />
            </div>
          </div>
          <a
            href="#profil"
            role="menuitem"
            onClick={() => setDropdownOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-inkSoft dark:text-slate-300 hover:bg-[#F3F4F6] dark:hover:bg-slate-800 no-underline transition-colors"
          >
            <User
              size={15}
              className="text-subtext dark:text-slate-400"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Profil saya
          </a>
          {onLogout && (
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border-none bg-transparent cursor-pointer transition-colors"
            >
              {isLoggingOut ? (
                <Loader2
                  size={15}
                  className="animate-spin text-rose-600"
                  aria-hidden="true"
                />
              ) : (
                <LogOut
                  size={15}
                  className="text-rose-600 dark:text-rose-400"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              )}
              <span>{isLoggingOut ? "Keluar..." : "Keluar dari Akun"}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
