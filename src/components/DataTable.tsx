import { Skeleton } from "./ui/Skeleton";

export interface Column<T> {
  key: string;
  header: string;
  flex?: number;
  minWidth?: number | string;
  align?: "left" | "center" | "right";
  render: (row: T, index?: number) => React.ReactNode;
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyText?: string;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  skeletonCount?: number;
  showRowNumber?: boolean;
  startIndex?: number;
  rowNumberHeader?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyText = "Belum ada data.",
  loading = false,
  onRowClick,
  skeletonCount = 5,
  showRowNumber = true,
  startIndex = 1,
  rowNumberHeader = "No",
}: DataTableProps<T>) {
  return (
    <div className="border border-fco-border-subtle surface-card rounded-xs overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Column Headers */}
          <div className="flex items-center py-3 px-3 sm:px-4 text-xs font-bold text-white gap-2.5 sm:gap-3 bg-fco-blue">
            {showRowNumber && (
              <div
                style={{ flex: "0 0 38px" }}
                className="shrink-0 text-center text-xs font-bold text-white/90"
              >
                <span>{rowNumberHeader}</span>
              </div>
            )}
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
                      ? { flex: "0 0 auto", minWidth: 80 }
                      : {
                          flex: c.flex ?? 1,
                          minWidth: c.minWidth ?? undefined,
                        }
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
                className="flex items-center gap-2.5 sm:gap-3 py-3.5 px-3 sm:px-4 border-t border-fco-border-subtle"
              >
                {showRowNumber && (
                  <div
                    style={{ flex: "0 0 38px" }}
                    className="shrink-0 flex justify-center"
                  >
                    <Skeleton className="h-4 w-5 rounded-xs" />
                  </div>
                )}
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
                          ? { flex: "0 0 auto", minWidth: 80 }
                          : {
                              flex: c.flex ?? 1,
                              minWidth: c.minWidth ?? undefined,
                            }
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
                          <Skeleton className="w-8 h-8 rounded-xs" />
                          <Skeleton className="w-8 h-8 rounded-xs" />
                        </div>
                      ) : isCentered ? (
                        <Skeleton className="h-5 w-16 rounded-xs" />
                      ) : isRight ? (
                        <Skeleton className="h-4 w-14 rounded-xs" />
                      ) : (
                        <div className="space-y-1.5 w-full pr-4">
                          <Skeleton
                            className={`h-4 rounded-xs ${cIdx === 0 ? "w-3/5" : "w-4/5"}`}
                          />
                          <Skeleton
                            className={`h-3 rounded-xs opacity-60 ${cIdx === 0 ? "w-2/5" : "w-1/2"}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-sm text-soft bg-white dark:bg-fco-card-dark">
              {emptyText}
            </div>
          ) : (
            rows.map((row, index) => (
              <div
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`flex items-center gap-2.5 sm:gap-3 py-3 px-3 sm:px-4 border-t border-fco-border-subtle transition-colors bg-white dark:bg-fco-card-dark ${
                  onRowClick
                    ? "cursor-pointer hover:bg-black/3 dark:hover:bg-white/5"
                    : ""
                }`}
              >
                {showRowNumber && (
                  <div
                    style={{ flex: "0 0 38px" }}
                    className="shrink-0 text-center text-xs font-semibold tabular-nums text-soft"
                  >
                    {startIndex + index}
                  </div>
                )}
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
                          ? { flex: "0 0 auto", minWidth: 80 }
                          : {
                              flex: c.flex ?? 1,
                              minWidth: c.minWidth ?? undefined,
                            }
                      }
                      className={`${isAction ? "shrink-0 justify-end" : "min-w-0 overflow-hidden"} ${hideCls} ${
                        isRight
                          ? "justify-end text-right"
                          : isCentered
                            ? "justify-center text-center"
                            : ""
                      } ${c.className || ""}`}
                    >
                      {c.render(row, index)}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
