import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CornerDownLeft, Search, X, type LucideIcon } from "lucide-react";

export interface QuickSearchItem {
  label: string;
  to: string;
  category?: string;
  keywords?: string[];
  icon?: LucideIcon;
}

interface QuickSearchMenuProps {
  items: QuickSearchItem[];
  placeholder?: string;
  className?: string;
}

export function QuickSearchMenu({
  items,
  placeholder = "Cari menu... (Ctrl+K)",
  className = "",
}: QuickSearchMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      const matchLabel = item.label.toLowerCase().includes(q);
      const matchCategory = item.category?.toLowerCase().includes(q) ?? false;
      const matchKeywords =
        item.keywords?.some((k) => k.toLowerCase().includes(q)) ?? false;
      return matchLabel || matchCategory || matchKeywords;
    });
  }, [items, query]);

  // Safely clamp active index within filtered items range
  const activeIndex = Math.min(
    selectedIndex,
    Math.max(0, filteredItems.length - 1),
  );

  // Click outside to close
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

  // Global shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (item: QuickSearchItem) => {
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    navigate(item.to);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredItems.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredItems.length - 1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredItems[activeIndex];
      if (target) {
        handleSelect(target);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-72 sm:max-w-88 ${className}`}
    >
      {/* Input Field */}
      <div className="relative flex items-center">
        <Search
          size={15}
          className="text-subtext dark:text-slate-400 absolute left-3 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
            if (!open) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="quick-search-dropdown"
          className="w-full h-8.5 pl-9 pr-14 py-1.5 rounded-lg bg-[#F9FAFB] dark:bg-slate-800/80 border border-[#E5E7EB] dark:border-slate-700 text-[13px] font-medium text-ink dark:text-white placeholder:text-faint focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 dark:focus:ring-brand-900/40 transition-all"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Hapus pencarian"
            className="absolute right-2 p-1 text-subtext hover:text-ink dark:hover:text-white border-none bg-transparent cursor-pointer"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10.5px] font-medium text-subtext bg-white dark:bg-slate-700 border border-[#E5E7EB] dark:border-slate-600 rounded absolute right-2 pointer-events-none">
            ⌘ + K
          </span>
        )}
      </div>

      {/* Dropdown Popover */}
      {open && (
        <div
          id="quick-search-dropdown"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-slate-700 rounded-xl shadow-popover p-1.5 z-50 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1 text-[10.5px] font-semibold text-faint uppercase tracking-wider flex items-center justify-between border-b border-[#E5E7EB] dark:border-slate-800 mb-1">
            <span>Menu</span>
            <span className="text-subtext font-normal normal-case">
              {filteredItems.length} ditemukan
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-soft">
              Tidak ada menu yang cocok dengan{" "}
              <span className="font-semibold text-strong">"{query}"</span>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {filteredItems.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === activeIndex;

                return (
                  <div
                    key={item.to + item.label}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => handleSelect(item)}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                      isSelected
                        ? "bg-fco-blue text-white font-semibold"
                        : "text-strong hover:surface-page font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {Icon && (
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "surface-inset text-fco-blue"
                          }`}
                        >
                          <Icon size={14} aria-hidden="true" />
                        </span>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="truncate">{item.label}</span>
                        {item.category && (
                          <span
                            className={`text-2xs truncate ${
                              isSelected ? "text-white/80" : "text-soft"
                            }`}
                          >
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-2xs px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
                          <span>Buka</span>
                          <CornerDownLeft size={10} aria-hidden="true" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
