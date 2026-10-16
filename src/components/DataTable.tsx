import { Loader2 } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  flex?: number;
  align?: "left" | "center" | "right";
  render: (row: T) => React.ReactNode;
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
      <div className="min-w-200">
        <div className="flex items-center py-2.5 text-xs font-semibold text-soft px-2 gap-3">
          {columns.map((c) => {
            const isAction = c.key === "aksi";
            return (
              <div
                key={c.key}
                style={
                  isAction
                    ? { flex: "0 0 auto", minWidth: 168 }
                    : { flex: c.flex ?? 1 }
                }
                className={`${isAction ? "shrink-0" : "min-w-0 overflow-hidden"} ${
                  c.align === "right"
                    ? "text-right"
                    : c.align === "center"
                      ? "text-center"
                      : ""
                }`}
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
              className={`flex items-center gap-3 py-3.5 px-2 rounded-xl border-t border-fco-border-subtle transition-colors ${
                onRowClick
                  ? "cursor-pointer hover:bg-fco-blue-light/30 dark:hover:bg-fco-blue/10"
                  : ""
              }`}
            >
              {columns.map((c) => {
                const isAction = c.key === "aksi";
                return (
                  <div
                    key={c.key}
                    style={
                      isAction
                        ? { flex: "0 0 auto", minWidth: 168 }
                        : { flex: c.flex ?? 1 }
                    }
                    className={`${isAction ? "shrink-0 flex justify-end" : "min-w-0 overflow-hidden"} ${
                      !isAction && c.align === "right"
                        ? "flex justify-end"
                        : !isAction && c.align === "center"
                          ? "flex justify-center"
                          : ""
                    }`}
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
