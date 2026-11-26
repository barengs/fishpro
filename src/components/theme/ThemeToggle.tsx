import { Moon, Sun } from "lucide-react";
import { useTheme } from "./useTheme";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
      aria-pressed={isDark}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={`${compact ? "w-9 h-9" : "w-10 h-10"} rounded-xl border-0 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-charcoal hover:text-ink dark:text-slate-300 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors relative overflow-hidden shrink-0 focus:outline-none`}
    >
      <span
        className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}
      >
        <Moon
          size={compact ? 16 : 18}
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
      <span
        className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
      >
        <Sun
          size={compact ? 16 : 18}
          className="text-amber-400"
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
