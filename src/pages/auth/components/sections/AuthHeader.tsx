import { ThemeToggle } from "../../../../components/ThemeToggle";

interface AuthHeaderProps {
  onNavigateHome: () => void;
}

export function AuthHeader({ onNavigateHome }: AuthHeaderProps) {
  return (
    <div className="hdr">
      <button
        type="button"
        onClick={onNavigateHome}
        className="brand bg-transparent border-0 p-0 cursor-pointer font-inherit text-left"
        aria-label="FishPro"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <rect className="bg" width="32" height="32" rx="4" />
          <g className="fg" fill="none" strokeWidth="2" strokeLinecap="round">
            <path d="M7 11c3-2.5 5-2.5 9 0s6 2.5 9 0" />
            <path d="M7 16c3-2.5 5-2.5 9 0s6 2.5 9 0" />
            <path d="M7 21c3-2.5 5-2.5 9 0s6 2.5 9 0" />
          </g>
        </svg>
        FISHPRO
      </button>
      <div className="actions">
        <ThemeToggle compact />
        <button
          type="button"
          className="btn-outline cursor-pointer"
          onClick={onNavigateHome}
        >
          Beranda
        </button>
      </div>
    </div>
  );
}
