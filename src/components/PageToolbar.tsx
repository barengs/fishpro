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
          <h1 className="m-0 text-[22px] sm:text-[26px] font-bold tracking-tight text-ink dark:text-white">
            {title}
          </h1>
          {desc && <p className="m-0 text-[13px] text-subtext dark:text-slate-400 mt-1">{desc}</p>}
        </div>
      )}

      {tabs && tabs.length > 1 && (
        <div className="border-b border-[#E5E7EB] dark:border-slate-800 mb-5">
          <nav className="-mb-px flex gap-6 overflow-x-auto" role="tablist">
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onTabChange?.(t.key)}
                  className={`inline-flex items-center gap-2 py-2.5 px-1 border-b-2 font-semibold text-[13px] transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
                    active
                      ? "border-b-brand-600 text-brand-600 dark:text-brand-400"
                      : "border-b-transparent text-subtext dark:text-slate-400 hover:text-ink dark:hover:text-white hover:border-b-line"
                  }`}
                >
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {(hasSearch || hasActions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {hasSearch ? (
            <div className="relative w-full sm:w-72 md:w-80">
              <Search
                size={15}
                className="text-subtext dark:text-slate-400 absolute left-3 top-2.5 pointer-events-none"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder ?? "Cari data..."}
                className="w-full h-9 border border-[#E5E7EB] dark:border-slate-700 bg-[#F9FAFB] dark:bg-slate-800/80 rounded-lg pl-9 pr-3.5 text-[13px] font-medium text-ink dark:text-white placeholder:text-subtext dark:placeholder:text-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all shadow-subtle"
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
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-transparent bg-brand-600 hover:bg-brand-700 text-white text-[13px] font-semibold cursor-pointer transition-colors shadow-subtle whitespace-nowrap"
                >
                  <Plus size={15} strokeWidth={2.2} aria-hidden="true" />
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
