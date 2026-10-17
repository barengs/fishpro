import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
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
  searchable?: boolean;
  searchPlaceholder?: string;
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
  searchable = false,
  searchPlaceholder = "Ketik untuk mencari...",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      if (searchable) {
        const t = setTimeout(() => searchInputRef.current?.focus(), 50);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          clearTimeout(t);
        };
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, searchable]);

  // Find currently selected option
  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value),
  );

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => {
      if (prev) setQuery("");
      return !prev;
    });
  };

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled || disabled) return;
    setOpen(false);
    setQuery("");
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
          onClick={handleToggle}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={`w-full h-11 border border-fco-border dark:border-fco-border-dark rounded-xl px-3.5 text-sm surface-card flex items-center justify-between text-left cursor-pointer transition-colors focus:outline-hidden focus:border-fco-blue disabled:opacity-60 disabled:cursor-not-allowed ${className} ${
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
            {searchable && (
              <div
                className="sticky top-0 surface-card pb-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Search
                    size={15}
                    className="text-soft absolute left-3 top-2.5 pointer-events-none"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={searchPlaceholder}
                    aria-label={`Cari ${label}`}
                    className="w-full h-9 border border-fco-border dark:border-fco-border-dark rounded-lg pl-8.5 pr-2.5 text-xs sm:text-sm field-input focus:outline-hidden focus:border-fco-blue"
                  />
                </div>
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-soft text-center">
                {searchable && query.trim()
                  ? `Tidak ada hasil untuk "${query.trim()}"`
                  : "Tidak ada opsi tersedia"}
              </div>
            ) : (
              filteredOptions.map((opt) => {
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
