import { useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2, LogOut, Menu, User, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { FullscreenToggle } from "./FullscreenToggle";

interface Profile {
  initials: string;
  name: string;
  role: string;
  avatarBg?: string;
}

interface MobileTopbarProps {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  profile: Profile;
  onLogout?: () => void | Promise<void>;
  isLoggingOut?: boolean;
  children: React.ReactNode;
}

export function MobileTopbar({
  open,
  onToggle,
  onClose,
  profile,
  onLogout,
  isLoggingOut: externalLoggingOut,
  children,
}: MobileTopbarProps) {
  const [accountOpen, setAccountOpen] = useState(false);
  const [internalLoggingOut, setInternalLoggingOut] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const isLoggingOut = externalLoggingOut ?? internalLoggingOut;

  const handleLogoutClick = async () => {
    if (!onLogout || isLoggingOut) return;
    setInternalLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setInternalLoggingOut(false);
      setAccountOpen(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!accountOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [accountOpen]);

  return (
    <>
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 surface-topbar border-b">
        <div className="flex items-center justify-between px-4 h-16">
          <button
            type="button"
            onClick={onToggle}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="w-10 h-10 rounded-fco border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-soft hover:text-strong dark:text-fco-muted-dark dark:hover:text-fco-text-dark flex items-center justify-center cursor-pointer shrink-0 transition-colors"
          >
            <Menu size={20} strokeWidth={2} aria-hidden="true" />
          </button>
          <div className="flex items-center gap-2">
            <FullscreenToggle compact />
            <ThemeToggle compact />
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-label="Menu akun"
                className="flex items-center gap-1.5 p-1 rounded-full border-none bg-transparent hover:surface-page cursor-pointer transition-colors"
              >
                <span
                  className="w-9 h-9 rounded-full text-white text-fco-sm font-bold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: profile.avatarBg ?? "#1A56DB" }}
                >
                  {profile.initials}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-soft transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 surface-card border rounded-xl shadow-lg p-1.5 z-50"
                >
                  <div className="px-3 py-2 border-b border-fco-border-subtle mb-1">
                    <div className="text-sm font-semibold tracking-tight text-strong truncate">
                      {profile.name}
                    </div>
                    <div className="text-xs text-soft mt-0.5">
                      {profile.role}
                    </div>
                  </div>
                  <a
                    href="#profil"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-strong hover:surface-page no-underline transition-colors"
                  >
                    <User size={16} className="text-soft" aria-hidden="true" />
                    Profil saya
                  </a>
                  {onLogout && (
                    <button
                      type="button"
                      role="menuitem"
                      disabled={isLoggingOut}
                      onClick={handleLogoutClick}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border-none bg-transparent cursor-pointer transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-red-600 dark:text-red-400 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <LogOut
                          size={16}
                          aria-hidden="true"
                          className="shrink-0"
                        />
                      )}
                      <span>{isLoggingOut ? "Mengeluarkan..." : "Keluar"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-fco-dark/50 backdrop-blur-xs transition-opacity duration-300 ease-out ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-label="Menu navigasi"
          className={`absolute left-0 top-0 bottom-0 w-72 surface-card p-4 overflow-y-auto shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
          style={{ maxWidth: "85vw" }}
        >
          <div className="flex items-center gap-3 px-1 mb-5">
            <span className="text-sm font-extrabold tracking-tight text-strong">
              FISHPRO
            </span>
            <span className="text-xs text-soft">Menu navigasi</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup menu"
              className="ml-auto w-9 h-9 rounded-fco border border-fco-border dark:border-fco-border-dark surface-card flex items-center justify-center cursor-pointer hover:surface-page transition-colors shrink-0 text-soft hover:text-strong dark:text-fco-muted-dark dark:hover:text-fco-text-dark"
            >
              <X size={18} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
