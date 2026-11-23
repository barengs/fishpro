import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  pagination?: boolean;
  pageSize?: number;
}

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
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
  pagination = true,
  pageSize = 10,
}: DataTableProps<T>) {
  const [prevRowsLength, setPrevRowsLength] = useState(rows.length);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when data length changes without triggering effect cascade
  if (rows.length !== prevRowsLength) {
    setPrevRowsLength(rows.length);
    setCurrentPage(1);
  }

  const effectivePageSize = pageSize > 0 ? pageSize : 10;
  const totalPages = Math.ceil(rows.length / effectivePageSize) || 1;
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const displayedRows = pagination
    ? rows.slice(
        (safePage - 1) * effectivePageSize,
        safePage * effectivePageSize,
      )
    : rows;

  const currentStartIndex = pagination
    ? (safePage - 1) * effectivePageSize + 1
    : startIndex;
  return (
    <div className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-slate-800 shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Column Headers */}
          <div className="flex items-center py-3 px-3 sm:px-4 text-xs font-bold text-white gap-2.5 sm:gap-3 bg-brand-600 dark:bg-blue-600">
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
              const isCentered = !isAction && c.align === "center";
              const isRight = isAction || c.align === "right";
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
                      ? { flex: "0 0 120px", minWidth: 120 }
                      : {
                          flex: c.flex ?? 1,
                          minWidth: c.minWidth ?? undefined,
                        }
                  }
                  className={`${isAction ? "shrink-0" : "min-w-0 overflow-hidden"} ${hideCls} px-1.5 ${
                    isRight
                      ? "text-right"
                      : isCentered
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
                className="flex items-center gap-2.5 sm:gap-3 py-3.5 px-3 sm:px-4 border-t border-[#E5E7EB] dark:border-slate-800"
              >
                {showRowNumber && (
                  <div
                    style={{ flex: "0 0 38px" }}
                    className="shrink-0 flex justify-center"
                  >
                    <Skeleton className="h-4 w-5 rounded-md" />
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
                          ? { flex: "0 0 120px", minWidth: 120 }
                          : {
                              flex: c.flex ?? 1,
                              minWidth: c.minWidth ?? undefined,
                            }
                      }
                      className={`${isAction ? "shrink-0 justify-end flex items-center" : "min-w-0 overflow-hidden"} ${hideCls} ${
                        isRight
                          ? "justify-end flex items-center"
                          : isCentered
                            ? "justify-center flex items-center"
                            : ""
                      } ${c.className || ""}`}
                    >
                      {isAction ? (
                        <div className="flex gap-1.5 justify-end">
                          <Skeleton className="w-7 h-7 rounded-lg" />
                          <Skeleton className="w-7 h-7 rounded-lg" />
                        </div>
                      ) : isCentered ? (
                        <Skeleton className="h-5 w-16 rounded-md" />
                      ) : isRight ? (
                        <Skeleton className="h-4 w-14 rounded-md" />
                      ) : (
                        <div className="space-y-1.5 w-full pr-4">
                          <Skeleton
                            className={`h-4 rounded-md ${cIdx === 0 ? "w-3/5" : "w-4/5"}`}
                          />
                          <Skeleton
                            className={`h-3 rounded-md opacity-60 ${cIdx === 0 ? "w-2/5" : "w-1/2"}`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))
          ) : rows.length === 0 ? (
            <div className="py-12 text-center text-sm text-subtext dark:text-slate-400 bg-white dark:bg-[#111827]">
              {emptyText}
            </div>
          ) : (
            displayedRows.map((row, index) => (
              <div
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`flex items-center gap-2.5 sm:gap-3 py-3.5 px-3 sm:px-4 border-t border-[#E5E7EB] dark:border-slate-800 transition-colors bg-white dark:bg-[#111827] text-ink dark:text-slate-200 ${
                  onRowClick
                    ? "cursor-pointer hover:bg-gray-50/80 dark:hover:bg-slate-800/40"
                    : "hover:bg-gray-50/50 dark:hover:bg-slate-800/30"
                }`}
              >
                {showRowNumber && (
                  <div
                    style={{ flex: "0 0 38px" }}
                    className="shrink-0 text-center text-xs font-semibold tabular-nums text-subtext dark:text-slate-400"
                  >
                    {currentStartIndex + index}
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
                          ? { flex: "0 0 120px", minWidth: 120 }
                          : {
                              flex: c.flex ?? 1,
                              minWidth: c.minWidth ?? undefined,
                            }
                      }
                      className={`${isAction ? "shrink-0 justify-end flex items-center" : "min-w-0 overflow-hidden"} ${hideCls} px-1.5 ${
                        isRight
                          ? "justify-end text-right flex items-center"
                          : isCentered
                            ? "justify-center text-center flex items-center"
                            : ""
                      } ${c.className || ""}`}
                    >
                      {c.render(row, currentStartIndex - 1 + index)}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {pagination && rows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#E5E7EB] dark:border-slate-800 bg-white dark:bg-[#111827] text-xs text-subtext dark:text-slate-400">
          <div className="tabular-nums">
            Menampilkan{" "}
            <strong className="text-ink dark:text-white font-semibold">
              {(safePage - 1) * effectivePageSize + 1}
            </strong>{" "}
            -{" "}
            <strong className="text-ink dark:text-white font-semibold">
              {Math.min(safePage * effectivePageSize, rows.length)}
            </strong>{" "}
            dari{" "}
            <strong className="text-ink dark:text-white font-semibold">{rows.length}</strong>{" "}
            data
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="Halaman sebelumnya"
                className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-charcoal dark:text-slate-200 flex items-center justify-center transition-colors shadow-subtle cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>

              {getPaginationItems(safePage, totalPages).map((item, idx) => {
                if (item === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="w-7 h-8 flex items-center justify-center text-xs font-bold text-subtext dark:text-slate-400 select-none tracking-widest"
                    >
                      ...
                    </span>
                  );
                }

                const isCurrent = item === safePage;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCurrentPage(item)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer border ${
                      isCurrent
                        ? "bg-brand-600 text-white border-brand-600 shadow-subtle font-bold"
                        : "border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-charcoal dark:text-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage >= totalPages}
                aria-label="Halaman berikutnya"
                className="w-8 h-8 rounded-lg border border-[#E5E7EB] dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-charcoal dark:text-slate-200 flex items-center justify-center transition-colors shadow-subtle cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
