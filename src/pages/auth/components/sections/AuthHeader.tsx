import { Home, Moon, Sun } from "lucide-react";
import { useTheme } from "../../../../components/theme/useTheme";

interface AuthHeaderProps {
  onNavigateHome: () => void;
}

export function AuthHeader({ onNavigateHome }: AuthHeaderProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="hdr">
      <button
        type="button"
        onClick={onNavigateHome}
        className="brand bg-transparent border-0 p-0 cursor-pointer font-inherit text-left"
        aria-label="FishPro"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect className="bg" width="32" height="32" rx="8" />
          <g className="fg" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="M7 11c3-2.5 5-2.5 9 0s6 2.5 9 0" />
            <path d="M7 16c3-2.5 5-2.5 9 0s6 2.5 9 0" />
            <path d="M7 21c3-2.5 5-2.5 9 0s6 2.5 9 0" />
          </g>
        </svg>
        <span>FISHPRO</span>
      </button>
      <div className="actions">
        <button
          type="button"
          onClick={toggle}
          className="btn-theme-toggle cursor-pointer"
          aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
          title={isDark ? "Mode terang" : "Mode gelap"}
        >
          {isDark ? (
            <Sun size={17} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Moon size={17} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className="btn-outline cursor-pointer"
          onClick={onNavigateHome}
        >
          <Home size={17} strokeWidth={1.8} aria-hidden="true" />
          <span>Beranda</span>
        </button>
      </div>
    </div>
  );
}
