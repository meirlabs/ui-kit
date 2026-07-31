import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

/* ────────────────────────────────────────────────────────────────────────────
   DataTable — a generic, typed table primitive.

   Semantics: real <table><thead><th scope="col"><tbody>. Header cells are 12px
   uppercase muted with a border-bottom; body cells are 14px/400. Numeric columns
   right-align and use tabular-nums so digits never nudge neighbors. Row hover is
   a surface shift (never a colored fill); selection/hover express through color,
   never metrics.

   Sorting is controlled (`sortState` + `onSortChange`) or uncontrolled
   (`defaultSort`); a sortable header cycles asc → desc → none and sets `aria-sort`
   on the <th>. Sorting is performed client-side unless `manualSort` is set (for
   server-sorted data — the component then only reports intent).

   Selection is optional (`selectable`), decoupled from the WS6 Checkbox (a local
   look-alike is used so this component never cross-imports). Rows carry
   `aria-selected`.

   Pagination is intentionally NOT hard-wired: drop a WS5 <Pagination> (or any
   node) into the `footer` slot to keep the dependency direction clean.
   ──────────────────────────────────────────────────────────────────────────── */

export type SortDirection = "asc" | "desc";

export interface SortState {
  /** The `id` of the sorted column. */
  columnId: string;
  direction: SortDirection;
}

export type ColumnAlign = "left" | "right" | "center";

export interface Column<Row> {
  /** Stable identifier — also the key reported in `SortState`. */
  id: string;
  /** Header content. */
  header: ReactNode;
  /**
   * How to read a cell. A function returns arbitrary content; a `keyof Row`
   * reads the field directly (and doubles as the default sort key).
   */
  accessor?: ((row: Row) => ReactNode) | keyof Row;
  /** Enable the sort affordance on this column's header. */
  sortable?: boolean;
  /** Text alignment. Defaults to `right` for numeric columns, else `left`. */
  align?: ColumnAlign;
  /** Fixed column width (px number or any CSS length). */
  width?: number | string;
  /** Right-align + tabular-nums for numbers that align as digits change. */
  numeric?: boolean;
  /** Custom comparator (receives raw rows). Overrides the default sort. */
  sortFn?: (a: Row, b: Row) => number;
}

export interface DataTableProps<Row> {
  columns: Column<Row>[];
  data: Row[];
  /** Stable row id. Defaults to `row.id` when present, else the row index. */
  getRowId?: (row: Row, index: number) => string;

  /* Sorting — controlled */
  sortState?: SortState | null;
  onSortChange?: (state: SortState | null) => void;
  /* Sorting — uncontrolled initial value */
  defaultSort?: SortState | null;
  /** Skip internal sorting (data is already sorted, e.g. server-side). */
  manualSort?: boolean;

  /* Selection (optional) */
  selectable?: "single" | "multiple";
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  defaultSelectedIds?: string[];

  /* Layout & density */
  stickyHeader?: boolean;
  compact?: boolean;

  /* States */
  loading?: boolean;
  /** How many skeleton rows to reserve while loading (default 5). */
  loadingRowCount?: number;
  error?: ReactNode;
  /** Rendered (spanning all columns) when `data` is empty. */
  emptyState?: ReactNode;

  /* Interaction */
  onRowClick?: (row: Row) => void;

  /* Semantics */
  caption?: ReactNode;
  "aria-label"?: string;

  /** Slot below the table body — drop a <Pagination>/<PaginationFooter> or summary here. */
  footer?: ReactNode;
  /** Slot above the table — drop a <FilterBar> (search + Filters button) or any toolbar here. */
  toolbar?: ReactNode;
  className?: string;
}

function defaultGetRowId<Row>(row: Row, index: number): string {
  const id = (row as { id?: unknown })?.id;
  return id == null ? String(index) : String(id);
}

function rawCellValue<Row>(row: Row, column: Column<Row>): unknown {
  if (typeof column.accessor === "function") return column.accessor(row);
  if (column.accessor != null) return row[column.accessor];
  return undefined;
}

function defaultCompare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true });
}

/* Local checkbox look-alike (decoupled from WS6 Checkbox). */
function DtCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return (
    <label
      className="ml-dt-check"
      // Selecting a row must not also fire the row's onRowClick.
      onClick={(e) => e.stopPropagation()}
    >
      <input
        ref={ref}
        type="checkbox"
        className="ml-dt-check-input"
        checked={checked}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="ml-dt-check-box" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" className="ml-dt-check-mark">
          <path
            d="M13.25 4.75 6.5 11.5 3.25 8.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="ml-dt-check-dash" />
      </span>
    </label>
  );
}

function SortCaret({ direction }: { direction: SortDirection | null }) {
  return (
    <span
      className={cn(
        "ml-dt-caret",
        direction === "asc" && "ml-dt-caret--asc",
        direction === "desc" && "ml-dt-caret--desc",
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 8 12" fill="none" width="8" height="12">
        <path
          className="ml-dt-caret-up"
          d="M4 1.5 6.5 5H1.5L4 1.5Z"
          fill="currentColor"
        />
        <path
          className="ml-dt-caret-down"
          d="M4 10.5 1.5 7H6.5L4 10.5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

export function DataTable<Row>({
  columns,
  data,
  getRowId = defaultGetRowId,
  sortState,
  onSortChange,
  defaultSort = null,
  manualSort = false,
  selectable,
  selectedIds,
  onSelectionChange,
  defaultSelectedIds = [],
  stickyHeader = false,
  compact = false,
  loading = false,
  loadingRowCount = 5,
  error,
  emptyState,
  onRowClick,
  caption,
  "aria-label": ariaLabel,
  footer,
  toolbar,
  className,
}: DataTableProps<Row>) {
  /* ── Sort state (controlled | uncontrolled) ── */
  const [internalSort, setInternalSort] = useState<SortState | null>(defaultSort);
  const isSortControlled = sortState !== undefined;
  const activeSort = isSortControlled ? sortState ?? null : internalSort;

  const cycleSort = useCallback(
    (columnId: string) => {
      let next: SortState | null;
      if (!activeSort || activeSort.columnId !== columnId) {
        next = { columnId, direction: "asc" };
      } else if (activeSort.direction === "asc") {
        next = { columnId, direction: "desc" };
      } else {
        next = null; // asc → desc → none
      }
      if (!isSortControlled) setInternalSort(next);
      onSortChange?.(next);
    },
    [activeSort, isSortControlled, onSortChange],
  );

  /* ── Selection state (controlled | uncontrolled) ── */
  const [internalSelected, setInternalSelected] =
    useState<string[]>(defaultSelectedIds);
  const isSelectionControlled = selectedIds !== undefined;
  const activeSelected = isSelectionControlled ? selectedIds ?? [] : internalSelected;
  const selectedSet = useMemo(() => new Set(activeSelected), [activeSelected]);

  const commitSelection = useCallback(
    (ids: string[]) => {
      if (!isSelectionControlled) setInternalSelected(ids);
      onSelectionChange?.(ids);
    },
    [isSelectionControlled, onSelectionChange],
  );

  /* ── Derived, sorted rows ── */
  const sortedData = useMemo(() => {
    if (manualSort || !activeSort) return data;
    const column = columns.find((c) => c.id === activeSort.columnId);
    if (!column) return data;
    const factor = activeSort.direction === "asc" ? 1 : -1;
    const comparator =
      column.sortFn ??
      ((a: Row, b: Row) =>
        defaultCompare(rawCellValue(a, column), rawCellValue(b, column)));
    // Stable sort: decorate with index so equal rows keep source order.
    return data
      .map((row, index) => ({ row, index }))
      .sort((x, y) => {
        const cmp = comparator(x.row, y.row);
        return cmp !== 0 ? cmp * factor : x.index - y.index;
      })
      .map((d) => d.row);
  }, [manualSort, activeSort, columns, data]);

  const rowIds = useMemo(
    () => sortedData.map((row, i) => getRowId(row, i)),
    [sortedData, getRowId],
  );

  const allSelected =
    rowIds.length > 0 && rowIds.every((id) => selectedSet.has(id));
  const someSelected = !allSelected && rowIds.some((id) => selectedSet.has(id));

  const toggleAll = useCallback(() => {
    commitSelection(allSelected ? [] : rowIds);
  }, [allSelected, rowIds, commitSelection]);

  const toggleRow = useCallback(
    (id: string) => {
      if (selectable === "single") {
        commitSelection(selectedSet.has(id) ? [] : [id]);
        return;
      }
      const nextSet = new Set(selectedSet);
      if (nextSet.has(id)) nextSet.delete(id);
      else nextSet.add(id);
      commitSelection([...nextSet]);
    },
    [selectable, selectedSet, commitSelection],
  );

  const totalCols = columns.length + (selectable ? 1 : 0);

  const handleRowKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTableRowElement>, row: Row) => {
      if (!onRowClick) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onRowClick(row);
      }
    },
    [onRowClick],
  );

  const colStyle = (column: Column<Row>) =>
    column.width != null
      ? { width: typeof column.width === "number" ? `${column.width}px` : column.width }
      : undefined;

  const alignOf = (column: Column<Row>): ColumnAlign =>
    column.align ?? (column.numeric ? "right" : "left");

  const renderBody = () => {
    if (loading) {
      return Array.from({ length: loadingRowCount }, (_, r) => (
        <tr className="ml-dt-row ml-dt-row--skeleton" key={`sk-${r}`} aria-hidden="true">
          {selectable && (
            <td className="ml-dt-check-cell">
              <span className="ml-dt-skel ml-dt-skel--check" />
            </td>
          )}
          {columns.map((column) => (
            <td
              key={column.id}
              className={cn(column.numeric && "ml-dt-num")}
              style={{ ...colStyle(column), textAlign: alignOf(column) }}
            >
              <span className="ml-dt-skel" />
            </td>
          ))}
        </tr>
      ));
    }

    if (error != null) {
      return (
        <tr className="ml-dt-row">
          <td className="ml-dt-state ml-dt-state--error" colSpan={totalCols}>
            {error}
          </td>
        </tr>
      );
    }

    if (sortedData.length === 0) {
      return (
        <tr className="ml-dt-row">
          <td className="ml-dt-state" colSpan={totalCols}>
            {emptyState ?? <span className="ml-dt-empty-fallback">No data.</span>}
          </td>
        </tr>
      );
    }

    return sortedData.map((row, i) => {
      const id = rowIds[i];
      const isSelected = selectedSet.has(id);
      return (
        <tr
          key={id}
          className={cn(
            "ml-dt-row",
            onRowClick && "ml-dt-row--clickable",
            isSelected && "ml-dt-row--selected",
          )}
          aria-selected={selectable ? isSelected : undefined}
          tabIndex={onRowClick ? 0 : undefined}
          onClick={onRowClick ? () => onRowClick(row) : undefined}
          onKeyDown={onRowClick ? (e) => handleRowKeyDown(e, row) : undefined}
        >
          {selectable && (
            <td className="ml-dt-check-cell">
              <DtCheckbox
                checked={isSelected}
                onChange={() => toggleRow(id)}
                label={`Select row ${i + 1}`}
              />
            </td>
          )}
          {columns.map((column) => (
            <td
              key={column.id}
              className={cn(column.numeric && "ml-dt-num")}
              style={{ ...colStyle(column), textAlign: alignOf(column) }}
            >
              {rawCellValue(row, column) as ReactNode}
            </td>
          ))}
        </tr>
      );
    });
  };

  const table = (
    <table
      className={cn("ml-dt", compact && "ml-dt--compact", stickyHeader && "ml-dt--sticky")}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {caption != null && (
        <caption className="ml-visually-hidden">{caption}</caption>
      )}
      <thead>
        <tr>
          {selectable && (
            <th scope="col" className="ml-dt-check-cell">
              {selectable === "multiple" ? (
                <DtCheckbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  label="Select all rows"
                  disabled={rowIds.length === 0 || loading}
                />
              ) : (
                <span className="ml-visually-hidden">Select</span>
              )}
            </th>
          )}
          {columns.map((column) => {
            const align = alignOf(column);
            const isActive = activeSort?.columnId === column.id;
            const ariaSort = column.sortable
              ? isActive
                ? activeSort!.direction === "asc"
                  ? "ascending"
                  : "descending"
                : "none"
              : undefined;
            return (
              <th
                key={column.id}
                scope="col"
                aria-sort={ariaSort}
                className={cn(
                  "ml-dt-th",
                  `ml-dt-align-${align}`,
                  column.numeric && "ml-dt-num",
                )}
                style={colStyle(column)}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className="ml-dt-sort"
                    onClick={() => cycleSort(column.id)}
                  >
                    <span className="ml-dt-th-label">{column.header}</span>
                    <SortCaret direction={isActive ? activeSort!.direction : null} />
                  </button>
                ) : (
                  <span className="ml-dt-th-label">{column.header}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>{renderBody()}</tbody>
    </table>
  );

  return (
    <div className={cn("ml-dt-root", className)}>
      {toolbar != null && <div className="ml-dt-toolbar">{toolbar}</div>}
      {stickyHeader ? <div className="ml-dt-scroll">{table}</div> : table}
      {footer != null && <div className="ml-dt-footer">{footer}</div>}
    </div>
  );
}
