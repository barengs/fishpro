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
          className={`w-full h-[44px] border rounded-[10px] px-3.5 text-sm bg-white dark:bg-[#0f1729] flex items-center justify-between text-left cursor-pointer transition-colors focus:outline-none focus:border-[#2563eb] dark:focus:border-[#5b94ff] focus:ring-2 focus:ring-[#2563eb]/15 disabled:opacity-60 disabled:cursor-not-allowed ${className} ${
            open
              ? "border-[#2563eb] dark:border-[#5b94ff] ring-2 ring-[#2563eb]/15"
              : "border-[#d9dee8] dark:border-[#2a3753]"
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 truncate">
            {selectedOption?.icon && (
              <span className="shrink-0 text-[#2563eb] dark:text-[#5b94ff] flex items-center">
                {selectedOption.icon}
              </span>
            )}
            <span
              className={`truncate ${
                selectedOption && selectedOption.value !== ""
                  ? "text-[#0f172a] dark:text-[#e8edf7] font-medium"
                  : "text-[#94a0b8] dark:text-[#6b7a96]"
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={`shrink-0 text-[#64718a] dark:text-[#98a6c0] ml-2 transition-transform duration-200 ${
              open ? "rotate-180 text-[#2563eb] dark:text-[#5b94ff]" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {open && !disabled && (
          <div
            role="listbox"
            aria-labelledby={id}
            className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#0f1729] border border-[#e8ebf0] dark:border-[#1f2a42] rounded-[12px] shadow-xl p-1.5 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          >
            {searchable && (
              <div
                className="sticky top-0 bg-white dark:bg-[#0f1729] pb-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <Search
                    size={15}
                    className="text-[#94a0b8] dark:text-[#6b7a96] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
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
                    className="w-full h-9 border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] rounded-[8px] pl-8.5 pr-2.5 text-xs sm:text-sm text-[#0f172a] dark:text-[#e8edf7] placeholder:text-[#94a0b8] dark:placeholder:text-[#6b7a96] focus:outline-none focus:border-[#2563eb] dark:focus:border-[#5b94ff]"
                  />
                </div>
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-[#64718a] dark:text-[#98a6c0] text-center">
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
                    className={`flex items-center justify-between gap-2 px-3 py-2 rounded-[8px] text-sm transition-colors cursor-pointer select-none ${
                      opt.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : isSelected
                          ? "bg-[#2563eb] text-white font-semibold"
                          : "text-[#0f172a] dark:text-[#e8edf7] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] font-medium"
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
