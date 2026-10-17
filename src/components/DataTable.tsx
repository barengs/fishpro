import { Loader2 } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  flex?: number;
  align?: "left" | "center" | "right";
  render: (row: T) => React.ReactNode;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyText = "Belum ada data.",
  loading = false,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <div className="flex items-center py-2.5 px-3 text-xs font-semibold text-soft gap-3 bg-black/2 dark:bg-white/2 rounded-t-lg">
          {columns.map((c) => {
            const isAction = c.key === "aksi";
            const hideCls = c.hideOnMobile
              ? "hidden sm:block"
              : c.hideOnTablet
                ? "hidden md:block"
                : "";

            return (
              <div
                key={c.key}
                style={
                  isAction
                    ? { flex: "0 0 auto", minWidth: 104 }
                    : { flex: c.flex ?? 1 }
                }
                className={`${isAction ? "shrink-0" : "min-w-0 overflow-hidden"} ${hideCls} ${
                  c.align === "right"
                    ? "text-right"
                    : c.align === "center"
                      ? "text-center"
                      : ""
                } ${c.className || ""}`}
              >
                <span className={`block ${isAction ? "" : "truncate"}`}>
                  {c.header}
                </span>
              </div>
            );
          })}
        </div>
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-sm text-soft">
            <Loader2
              size={24}
              className="animate-spin text-fco-blue"
              aria-hidden="true"
            />
            <span>Memuat data...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-soft">{emptyText}</div>
        ) : (
          rows.map((row) => (
            <div
              key={rowKey(row)}
              onClick={() => onRowClick?.(row)}
              className={`flex items-center gap-3 py-3.5 px-3 border-t border-fco-border-subtle transition-colors ${
                onRowClick
                  ? "cursor-pointer hover:bg-black/3 dark:hover:bg-white/5"
                  : ""
              }`}
            >
              {columns.map((c) => {
                const isAction = c.key === "aksi";
                const isCentered = !isAction && c.align === "center";
                const isRight = !isAction && c.align === "right";

                const hideCls = c.hideOnMobile
                  ? isAction || isCentered || isRight
                    ? "hidden sm:flex"
                    : "hidden sm:block"
                  : c.hideOnTablet
                    ? isAction || isCentered || isRight
                      ? "hidden md:flex"
                      : "hidden md:block"
                    : isAction || isCentered || isRight
                      ? "flex"
                      : "";

                return (
                  <div
                    key={c.key}
                    style={
                      isAction
                        ? { flex: "0 0 auto", minWidth: 104 }
                        : { flex: c.flex ?? 1 }
                    }
                    className={`${isAction ? "shrink-0 justify-end" : "min-w-0 overflow-hidden"} ${hideCls} ${
                      isRight
                        ? "justify-end text-right"
                        : isCentered
                          ? "justify-center text-center"
                          : ""
                    } ${c.className || ""}`}
                  >
                    {c.render(row)}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
