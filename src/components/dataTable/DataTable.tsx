import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import styles from "./DataTable.module.css";
import {
  LuArrowDown,
  LuArrowUp,
  LuArrowUpDown,
  LuSearch,
} from "react-icons/lu";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title = "Listă resurse",
  searchPlaceholder = "Caută...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className={styles.container}>
      {/* Title & Search */}
      <div className={styles.toolbar}>
        <h2 className={styles.tableTitle}>{title}</h2>
        <div className={styles.searchWrapper}>
          <LuSearch className={styles.searchIcon} />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className={styles.searchInput}
            placeholder={searchPlaceholder}
          />
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className={styles.th}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? styles.sortableHeader
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {/* Sorting icons */}
                          {{
                            asc: <LuArrowUp size={14} />,
                            desc: <LuArrowDown size={14} />,
                          }[header.column.getIsSorted() as string] ??
                            (header.column.getCanSort() ? (
                              <LuArrowUpDown size={14} opacity={0.3} />
                            ) : null)}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.tr}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className={styles.td}
                  style={{
                    textAlign: "center",
                    paddingTop: "7rem",
                    border: "none",
                  }}
                >
                  Nu s-au găsit rezultate
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <div className={styles.pageSizeWrapper}>
          <span className={styles.pageSizeLabel}>Rânduri:</span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className={styles.pageSizeSelect}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

        {table.getPageCount() > 1 ? (
          <div className={styles.pageButtons}>
            <button
              className={styles.pageBtn}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <CgChevronLeft />
            </button>
            <span className={styles.pageNumberDisplay}>
              Pagina {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <CgChevronRight />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
