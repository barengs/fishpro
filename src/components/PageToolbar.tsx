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
        <div>
          <h1 className="m-0 text-[28px] leading-[1.2] tracking-[-0.02em] font-extrabold text-[#0f172a] dark:text-[#e8edf7]">
            {title}
          </h1>
          {desc && (
            <p className="m-0 mt-1.5 text-sm text-[#64718a] dark:text-[#98a6c0]">
              {desc}
            </p>
          )}
        </div>
      )}

      {tabs && tabs.length > 1 && (
        <div className="border-b border-[#e8ebf0] dark:border-[#1f2a42] my-5">
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
                  className={`inline-flex items-center gap-2 py-3 px-1 border-b-2 font-semibold text-sm transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
                    active
                      ? "border-b-[#2563eb] text-[#2563eb] dark:border-b-[#5b94ff] dark:text-[#5b94ff]"
                      : "border-b-transparent text-[#64718a] dark:text-[#98a6c0] hover:text-[#0f172a] dark:hover:text-[#e8edf7] hover:border-b-[#e8ebf0]"
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
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
            hasHeader || (tabs && tabs.length > 1) ? "mt-8" : "mt-0"
          } mb-6`}
        >
          {hasSearch ? (
            <div className="relative w-full sm:w-[380px]">
              <Search
                size={17}
                className="text-[#94a0b8] dark:text-[#6b7a96] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchValue ?? ""}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder={searchPlaceholder ?? "Cari data..."}
                className="w-full h-[46px] border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] rounded-[12px] pl-[42px] pr-3.5 text-sm font-medium text-[#0f172a] dark:text-[#e8edf7] placeholder:text-[#94a0b8] dark:placeholder:text-[#6b7a96] focus:outline-none focus:border-[#2563eb] dark:focus:border-[#5b94ff] transition-colors"
              />
            </div>
          ) : (
            <div />
          )}

          {hasActions && (
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-start sm:justify-end">
              {extraActions}
              {children}
              {onAdd && addLabel && (
                <button
                  type="button"
                  onClick={onAdd}
                  className="inline-flex items-center justify-center gap-2 h-[46px] px-5 rounded-[12px] border-0 bg-[#2563eb] hover:bg-[#1d4ed8] dark:bg-[#5b94ff] dark:hover:bg-[#78a7ff] text-white text-sm font-semibold cursor-pointer transition-colors shadow-none whitespace-nowrap"
                >
                  <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
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
