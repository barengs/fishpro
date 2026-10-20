import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CornerDownLeft,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";

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
          size={16}
          className="text-soft absolute left-3 pointer-events-none"
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
          className="w-full h-9 pl-9 pr-8 rounded-lg border border-fco-border-subtle surface-inset text-xs sm:text-sm field-input focus:outline-hidden focus:border-fco-blue transition-colors"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            aria-label="Hapus pencarian"
            className="absolute right-2 p-1 text-soft hover:text-strong border-none bg-transparent cursor-pointer"
          >
            <X size={14} aria-hidden="true" />
          </button>
        ) : (
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2 px-1.5 py-0.5 text-2xs font-mono font-medium text-soft surface-card border border-fco-border-subtle rounded">
            Ctrl+K
          </kbd>
        )}
      </div>

      {/* Dropdown Popover */}
      {open && (
        <div
          id="quick-search-dropdown"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-1.5 surface-card border dark:border-fco-border-dark rounded-xl shadow-2xl p-1.5 z-50 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-2.5 py-1 text-2xs font-bold text-soft uppercase tracking-wider flex items-center justify-between border-b border-fco-border-subtle mb-1">
            <span>Menu</span>
            <span className="text-soft font-normal normal-case">
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
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-2xs px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
                          <span>Buka</span>
                          <CornerDownLeft size={10} aria-hidden="true" />
                        </span>
                      ) : (
                        <ArrowRight
                          size={13}
                          className="text-soft"
                          aria-hidden="true"
                        />
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
