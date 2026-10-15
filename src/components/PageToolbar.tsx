import { Plus } from "lucide-react";
import { PageHeader } from "./PageHeader";

interface SubTab {
  key: string;
  label: string;
}

interface PageToolbarProps {
  title: string;
  desc: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  tabs?: SubTab[];
  activeTab?: string;
  onTabChange?: (key: string) => void;
  addLabel: string;
  onAdd: () => void;
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
}: PageToolbarProps) {
  return (
    <div>
      <PageHeader
        title={title}
        desc={desc}
        showSearch
        searchPlaceholder={searchPlaceholder}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        actions={
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-fco border-none bg-fco-blue hover:bg-fco-blue-hover text-white text-sm font-semibold cursor-pointer transition-colors shadow-xs whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.2} aria-hidden="true" />
            {addLabel}
          </button>
        }
      />
      {tabs && tabs.length > 1 && (
        <div
          className="flex gap-1.5 mb-6 p-1 surface-inset border rounded-xl w-fit"
          role="tablist"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={activeTab === t.key}
              onClick={() => onTabChange?.(t.key)}
              className={`h-9.5 px-5 rounded-lg text-sm font-semibold border-none cursor-pointer transition-all ${
                activeTab === t.key
                  ? "bg-fco-blue text-white shadow-xs"
                  : "bg-transparent text-soft hover:text-strong"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
