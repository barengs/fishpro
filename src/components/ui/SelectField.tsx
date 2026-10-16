import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import { FormField } from "../FormField";

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SelectFieldProps {
  label: string;
  id: string;
  value?: string | number;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
  options?: SelectOption[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
  children?: ReactNode;
}

export function SelectField({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = "— Pilih Opsi —",
  hint,
  required,
  optional,
  disabled = false,
  className = "",
  name,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Find currently selected option
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value),
  );

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled || disabled) return;
    setOpen(false);
    if (onChange) {
      onChange({
        target: {
          value: String(opt.value),
          name,
        },
      });
    }
  };

  return (
    <FormField
      label={label}
      htmlFor={id}
      hint={hint}
      required={required}
      optional={optional}
    >
      <div ref={containerRef} className="relative w-full">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`w-full h-11 border border-fco-border dark:border-fco-border-dark rounded-xl px-3.5 text-sm surface-card flex items-center justify-between text-left cursor-pointer transition-colors focus:outline-none focus:border-fco-blue disabled:opacity-60 disabled:cursor-not-allowed ${className} ${
            open ? "border-fco-blue ring-2 ring-fco-blue/15" : ""
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 truncate">
            {selectedOption?.icon && (
              <span className="shrink-0 text-fco-blue flex items-center">
                {selectedOption.icon}
              </span>
            )}
            <span
              className={`truncate ${
                selectedOption && selectedOption.value !== ""
                  ? "text-strong font-medium"
                  : "text-soft"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`shrink-0 text-soft ml-2 transition-transform duration-200 ${
              open ? "rotate-180 text-fco-blue" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {open && !disabled && (
          <div
            role="listbox"
            aria-labelledby={id}
            className="absolute left-0 right-0 top-full mt-1.5 surface-card border dark:border-fco-border-dark rounded-xl shadow-xl p-1 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-soft text-center">
                Tidak ada opsi tersedia
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer select-none ${
                      opt.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : isSelected
                          ? "bg-fco-blue text-white font-semibold"
                          : "text-strong hover:surface-page font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 truncate">
                      {opt.icon && (
                        <span
                          className={`shrink-0 flex items-center ${
                            isSelected ? "text-white" : "text-soft"
                          }`}
                        >
                          {opt.icon}
                        </span>
                      )}
                      <span className="truncate">{opt.label}</span>
                    </div>
                    {isSelected && (
                      <Check
                        size={15}
                        className="shrink-0 text-white"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}
