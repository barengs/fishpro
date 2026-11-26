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
    <section className="bg-white dark:bg-[#0f1729] border border-[#e8ebf0] dark:border-[#1f2a42] rounded-[16px] overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Table Column Headers */}
          <div className="flex items-center py-3.5 px-4 sm:px-6 text-[13px] font-semibold text-white gap-3 bg-[#2563eb] dark:bg-[#2563eb]">
            {showRowNumber && (
              <div
                style={{ flex: "0 0 50px" }}
                className="shrink-0 text-center font-semibold text-white"
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
                      ? { flex: "0 0 140px", minWidth: 140 }
                      : {
                          flex: c.flex ?? 1,
                          minWidth: c.minWidth ?? undefined,
                        }
                  }
                  className={`${isAction ? "shrink-0 justify-self-end" : "min-w-0 overflow-hidden"} ${hideCls} px-1.5 ${
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
                className="flex items-center gap-3 py-4 px-4 sm:px-6 border-t border-[#e8ebf0] dark:border-[#1f2a42]"
              >
                {showRowNumber && (
                  <div
                    style={{ flex: "0 0 50px" }}
                    className="shrink-0 flex justify-center"
                  >
                    <Skeleton className="h-4 w-5 rounded-md" />
                  </div>
                )}
                {columns.map((c, cIdx) => {
                  const isAction = c.key === "aksi";
                  const isCentered = !isAction && c.align === "center";
                  const isRight = isAction || c.align === "right";

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
                          ? { flex: "0 0 140px", minWidth: 140 }
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
                      {isAction ? (
                        <div className="flex gap-2 justify-end">
                          <Skeleton className="w-[36px] h-[36px] rounded-[9px]" />
                          <Skeleton className="w-[36px] h-[36px] rounded-[9px]" />
                          <Skeleton className="w-[36px] h-[36px] rounded-[9px]" />
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
            <div className="py-12 text-center text-sm text-[#64718a] dark:text-[#98a6c0] bg-white dark:bg-[#0f1729]">
              {emptyText}
            </div>
          ) : (
            displayedRows.map((row, index) => (
              <div
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={`flex items-center gap-3 py-4 px-4 sm:px-6 ${
                  index === 0
                    ? "border-t-0"
                    : "border-t border-[#e8ebf0] dark:border-[#1f2a42]"
                } transition-colors bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7] ${
                  onRowClick ? "cursor-pointer" : ""
                }`}
              >
                {showRowNumber && (
                  <div
                    style={{ flex: "0 0 50px" }}
                    className="shrink-0 text-center text-sm font-medium tabular-nums text-[#64718a] dark:text-[#98a6c0]"
                  >
                    {currentStartIndex + index}
                  </div>
                )}
                {columns.map((c) => {
                  const isAction = c.key === "aksi";
                  const isCentered = !isAction && c.align === "center";
                  const isRight = isAction || c.align === "right";

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
                          ? { flex: "0 0 140px", minWidth: 140 }
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-t border-[#e8ebf0] dark:border-[#1f2a42] bg-white dark:bg-[#0f1729] text-[13px] text-[#64718a] dark:text-[#98a6c0]">
          <div className="tabular-nums">
            Menampilkan{" "}
            <strong className="text-[#0f172a] dark:text-[#e8edf7] font-semibold">
              {(safePage - 1) * effectivePageSize + 1}
            </strong>{" "}
            -{" "}
            <strong className="text-[#0f172a] dark:text-[#e8edf7] font-semibold">
              {Math.min(safePage * effectivePageSize, rows.length)}
            </strong>{" "}
            dari{" "}
            <strong className="text-[#0f172a] dark:text-[#e8edf7] font-semibold">{rows.length}</strong>{" "}
            data
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                aria-label="Halaman sebelumnya"
                className="w-8 h-8 rounded-lg border border-[#e8ebf0] dark:border-[#1f2a42] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#64718a] dark:text-[#98a6c0] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <ChevronLeft size={14} aria-hidden="true" />
              </button>

              {getPaginationItems(safePage, totalPages).map((item, idx) => {
                if (item === "...") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="w-7 h-8 flex items-center justify-center text-xs font-bold text-[#64718a] dark:text-[#98a6c0] select-none tracking-widest"
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
                        ? "bg-[#2563eb] text-white border-[#2563eb] font-bold"
                        : "border-[#e8ebf0] dark:border-[#1f2a42] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#0f172a] dark:text-[#e8edf7]"
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
                className="w-8 h-8 rounded-lg border border-[#e8ebf0] dark:border-[#1f2a42] bg-white dark:bg-[#0f1729] hover:bg-[#f1f4f9] dark:hover:bg-[#141d33] text-[#64718a] dark:text-[#98a6c0] flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
