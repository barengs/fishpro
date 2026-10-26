export interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  activeText?: string;
  inactiveText?: string;
  className?: string;
}

export function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  activeText = "Aktif",
  inactiveText = "Tidak Aktif",
  className = "",
}: ToggleSwitchProps) {
  return (
    <div
      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all surface-card ${
        checked
          ? "border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/15"
          : "border-fco-border-subtle"
      } ${className}`}
    >
      <div className="flex-1 pr-3 min-w-0">
        {label && (
          <label
            htmlFor={id}
            onClick={() => !disabled && onChange(!checked)}
            className="block text-sm font-semibold text-strong cursor-pointer truncate select-none"
          >
            {label}
          </label>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Dynamic Text & Color Indicator */}
        <span
          onClick={() => !disabled && onChange(!checked)}
          className={`text-xs font-bold select-none cursor-pointer transition-colors ${
            checked
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {checked ? activeText : inactiveText}
        </span>

        {/* Toggle Track Button */}
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden disabled:opacity-50 disabled:cursor-not-allowed ${
            checked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-600"
          }`}
        >
          <span className="sr-only">
            {label || (checked ? activeText : inactiveText)}
          </span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
