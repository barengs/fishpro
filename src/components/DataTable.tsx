import { Skeleton } from "./ui/Skeleton";

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
  skeletonCount?: number;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyText = "Belum ada data.",
  loading = false,
  onRowClick,
  skeletonCount = 5,
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
          Array.from({ length: skeletonCount }).map((_, rIdx) => (
            <div
              key={`skel-${rIdx}`}
              className="flex items-center gap-3 py-3.5 px-3 border-t border-fco-border-subtle"
            >
              {columns.map((c, cIdx) => {
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
                        ? "justify-end"
                        : isCentered
                          ? "justify-center"
                          : ""
                    } ${c.className || ""}`}
                  >
                    {isAction ? (
                      <div className="flex gap-1.5 justify-end">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-lg" />
                      </div>
                    ) : isCentered ? (
                      <Skeleton className="h-5 w-16 rounded-full" />
                    ) : isRight ? (
                      <Skeleton className="h-4 w-14 rounded" />
                    ) : (
                      <div className="space-y-1.5 w-full pr-4">
                        <Skeleton
                          className={`h-4 rounded ${cIdx === 0 ? "w-3/5" : "w-4/5"}`}
                        />
                        <Skeleton
                          className={`h-3 rounded opacity-60 ${cIdx === 0 ? "w-2/5" : "w-1/2"}`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
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
