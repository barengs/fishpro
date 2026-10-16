import React from "react";
import { Plus, Search } from "lucide-react";

interface SubTab {
  key: string;
  label: string;
}

interface PageToolbarProps {
  title?: string;
  desc?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  tabs?: SubTab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  addLabel?: string;
  onAdd?: () => void;
  extraActions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageToolbar({
  title,
  desc,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  tabs,
  activeTab,
  onTabChange,
  addLabel,
  onAdd,
  extraActions,
  children,
}: PageToolbarProps) {
  const hasHeader = Boolean(title);
  const hasSearch = Boolean(onSearchChange || searchPlaceholder);
  const hasActions = Boolean(onAdd || extraActions || children);

  return (
    <div className="mb-6">
      {hasHeader && (
        <div className="mb-5">
          <h1 className="m-0 text-2xl sm:text-3xl font-extrabold tracking-tight text-strong">
            {title}
          </h1>
          {desc && <p className="m-0 text-sm text-soft mt-1">{desc}</p>}
        </div>
      )}

      {tabs && tabs.length > 1 && (
        <div
          className="flex gap-1.5 mb-5 p-1 surface-inset border dark:border-fco-border-dark rounded-xl w-fit flex-wrap"
          role="tablist"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={activeTab === t.key}
              onClick={() => onTabChange?.(t.key)}
              className={`h-9.5 px-4.5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all ${
                activeTab === t.key
                  ? "bg-fco-blue text-white shadow-xs"
                  : "bg-transparent text-soft hover:text-strong hover:surface-page"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {(hasSearch || hasActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {hasSearch ? (
            <div className="relative w-full sm:w-72 md:w-80">
              <Search
                size={17}
                className="text-soft absolute left-3.5 top-3 pointer-events-none"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder ?? "Cari data..."}
                className="w-full h-10 border dark:border-fco-border-dark rounded-fco pl-10 pr-3.5 text-sm field-input focus:outline-none focus:border-fco-blue transition-colors"
              />
            </div>
          ) : (
            <div />
          )}

          {hasActions && (
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-start sm:justify-end">
              {extraActions}
              {children}
              {onAdd && addLabel && (
                <button
                  type="button"
                  onClick={onAdd}
                  className="inline-flex items-center gap-2 h-10 px-4.5 rounded-fco border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs whitespace-nowrap"
                >
                  <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
                  <span>{addLabel}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
