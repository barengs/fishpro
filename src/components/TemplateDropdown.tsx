import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";

export interface TemplateOption {
  label: string;
  format: "csv" | "excel";
  url: string;
  filename?: string;
}

interface TemplateDropdownProps {
  options: TemplateOption[];
  label?: string;
}

export function TemplateDropdown({
  options,
  label = "Unduh Template",
}: TemplateDropdownProps) {
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

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex items-center gap-2 h-10 px-3.5 rounded-fco text-xs sm:text-sm font-semibold border border-fco-border dark:border-fco-border-dark surface-card hover:surface-page text-strong transition-colors cursor-pointer shadow-2xs"
      >
        <Download size={15} className="text-fco-blue" aria-hidden="true" />
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`text-soft transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 surface-card border dark:border-fco-border-dark rounded-xl shadow-xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3 py-1.5 text-2xs font-bold text-soft uppercase tracking-wider border-b border-fco-border-subtle mb-1">
            Pilih Format Template
          </div>
          <div className="flex flex-col gap-0.5">
            {options.map((opt) => (
              <a
                key={opt.url}
                href={opt.url}
                download={opt.filename}
                onClick={() => setOpen(false)}
                role="menuitem"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-strong hover:surface-page no-underline transition-colors"
              >
                {opt.format === "csv" ? (
                  <FileText
                    size={16}
                    className="text-fco-blue shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <FileSpreadsheet
                    size={16}
                    className="text-emerald-600 dark:text-emerald-400 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-strong">{opt.label}</span>
                  <span className="text-2xs text-soft">
                    {opt.format === "csv"
                      ? "File teks .csv"
                      : "Spreadsheet .xlsx"}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
