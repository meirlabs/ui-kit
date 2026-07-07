import {
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { TableVirtuoso, type TableComponents } from "react-virtuoso";
import { cn } from "../utils/cn";
import type {
  Column,
  ColumnAlign,
  SortDirection,
  SortState,
} from "./DataTable";

/* ────────────────────────────────────────────────────────────────────────────
   VirtualDataTable — DataTable's virtualized sibling, built on react-virtuoso's
   TableVirtuoso. Ships ONLY from the `@meir-labs/ui-kit/virtual` subpath entry
   because react-virtuoso is an optional peer dependency.

   Drop-in contract with DataTable:
   - Same `Column` / `SortState` / `SortDirection` types (imported, not forked).
   - Same `.ml-dt` class markup for header/cells/rows, so table.css styles both.
   - Same sort model: controlled (`sortState`/`onSortChange`) or uncontrolled
     (`defaultSort`), cycling asc → desc → none with `aria-sort` on the <th>.
   - Same empty-state rendering (a spanning `.ml-dt-state` cell).

   Virtualization specifics:
   - Sticky header via `fixedHeaderContent` (virtuoso keeps the <thead> sticky).
   - `table-layout: fixed` + a <colgroup> of explicit column widths so the
     layout stays stable while rows mount/unmount (virtuoso requirement).
   - `height` (or `style`/`className`) sizes the scroll container.
   - `onEndReached` for infinite scroll; `initialItemCount` for SSR/tests.

   Intentionally NOT ported: selection and loading skeletons — start a request
   for them if a consumer needs either in a virtualized context.
   ──────────────────────────────────────────────────────────────────────────── */

export interface VirtualDataTableProps<Row> {
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

  /* Layout & density */
  compact?: boolean;
  /** Scroll-container height (number = px, or any CSS length). Default 480. */
  height?: number | string;
  /** Extra style for the scroll container (wins over `height`). */
  style?: CSSProperties;
  /** Extra class for the scroll container. */
  className?: string;

  /* Virtualization tuning (passed through to TableVirtuoso) */
  /** Extra pixels rendered outside the viewport before unmounting. */
  overscan?: number;
  /** Artificially grow the viewport so rows render ahead of the scroll. */
  increaseViewportBy?: number | { top: number; bottom: number };
  /** Rows to render before measurement happens — for SSR and jsdom tests. */
  initialItemCount?: number;
  /** Fires with the last rendered index when the list bottoms out — infinite scroll hook. */
  onEndReached?: (index: number) => void;

  /* States */
  /** Rendered (spanning all columns) when `data` is empty. */
  emptyState?: ReactNode;

  /* Interaction */
  onRowClick?: (row: Row) => void;

  /* Semantics */
  "aria-label"?: string;

  /** Slot below the scroll container — drop a summary/footer here. */
  footer?: ReactNode;
}

/* ── Helpers mirrored from DataTable's internals (kept private there) ── */

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

function colWidth<Row>(column: Column<Row>): CSSProperties | undefined {
  return column.width != null
    ? {
        width:
          typeof column.width === "number" ? `${column.width}px` : column.width,
      }
    : undefined;
}

function alignOf<Row>(column: Column<Row>): ColumnAlign {
  return column.align ?? (column.numeric ? "right" : "left");
}

/* Same caret as DataTable's (private there) — identical classes/markup. */
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

/* Context handed to the memoized virtuoso components, so their identity stays
   stable across renders (recreating `components` makes virtuoso remount). */
interface VdtContext<Row> {
  columns: Column<Row>[];
  compact: boolean;
  ariaLabel?: string;
  emptyState?: ReactNode;
  onRowClick?: (row: Row) => void;
}

export function VirtualDataTable<Row>({
  columns,
  data,
  getRowId = defaultGetRowId,
  sortState,
  onSortChange,
  defaultSort = null,
  manualSort = false,
  compact = false,
  height = 480,
  style,
  className,
  overscan,
  increaseViewportBy,
  initialItemCount,
  onEndReached,
  emptyState,
  onRowClick,
  "aria-label": ariaLabel,
  footer,
}: VirtualDataTableProps<Row>) {
  /* ── Sort state (controlled | uncontrolled) — same model as DataTable ── */
  const [internalSort, setInternalSort] = useState<SortState | null>(
    defaultSort,
  );
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

  /* ── Derived, sorted rows (stable sort, same as DataTable) ── */
  const sortedData = useMemo(() => {
    if (manualSort || !activeSort) return data;
    const column = columns.find((c) => c.id === activeSort.columnId);
    if (!column) return data;
    const factor = activeSort.direction === "asc" ? 1 : -1;
    const comparator =
      column.sortFn ??
      ((a: Row, b: Row) =>
        defaultCompare(rawCellValue(a, column), rawCellValue(b, column)));
    return data
      .map((row, index) => ({ row, index }))
      .sort((x, y) => {
        const cmp = comparator(x.row, y.row);
        return cmp !== 0 ? cmp * factor : x.index - y.index;
      })
      .map((d) => d.row);
  }, [manualSort, activeSort, columns, data]);

  const context = useMemo<VdtContext<Row>>(
    () => ({ columns, compact, ariaLabel, emptyState, onRowClick }),
    [columns, compact, ariaLabel, emptyState, onRowClick],
  );

  /* ── Virtuoso element overrides — stable identity, all state via context ── */
  const components = useMemo<TableComponents<Row, VdtContext<Row>>>(
    () => ({
      Table: ({ style: tableStyle, context: ctx, children }) => (
        <table
          className={cn("ml-dt", "ml-vdt", ctx!.compact && "ml-dt--compact")}
          aria-label={ctx!.ariaLabel}
          /* table-layout: fixed + explicit col widths = stable layout while
             virtuoso swaps rows (unmeasured rows can't reflow columns). */
          style={{ ...tableStyle, tableLayout: "fixed", width: "100%" }}
        >
          <colgroup>
            {ctx!.columns.map((column) => (
              <col key={column.id} style={colWidth(column)} />
            ))}
          </colgroup>
          {children}
        </table>
      ),
      TableRow: ({ item, context: ctx, ...props }) => {
        const rowClick = ctx!.onRowClick;
        const handleKeyDown = rowClick
          ? (e: KeyboardEvent<HTMLTableRowElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                rowClick(item);
              }
            }
          : undefined;
        return (
          <tr
            {...props}
            className={cn("ml-dt-row", rowClick && "ml-dt-row--clickable")}
            tabIndex={rowClick ? 0 : undefined}
            onClick={rowClick ? () => rowClick(item) : undefined}
            onKeyDown={handleKeyDown}
          />
        );
      },
      /* Virtuoso renders this INSTEAD of the tbody when data is empty, so it
         owns the <tbody>. Markup matches DataTable's empty row. */
      EmptyPlaceholder: ({ context: ctx }) => (
        <tbody>
          <tr className="ml-dt-row">
            <td className="ml-dt-state" colSpan={ctx!.columns.length}>
              {ctx!.emptyState ?? (
                <span className="ml-dt-empty-fallback">No data.</span>
              )}
            </td>
          </tr>
        </tbody>
      ),
    }),
    [],
  );

  /* ── Sticky header — identical th markup to DataTable ── */
  const fixedHeaderContent = useCallback(
    () => (
      <tr>
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
              style={colWidth(column)}
            >
              {column.sortable ? (
                <button
                  type="button"
                  className="ml-dt-sort"
                  onClick={() => cycleSort(column.id)}
                >
                  <span className="ml-dt-th-label">{column.header}</span>
                  <SortCaret
                    direction={isActive ? activeSort!.direction : null}
                  />
                </button>
              ) : (
                <span className="ml-dt-th-label">{column.header}</span>
              )}
            </th>
          );
        })}
      </tr>
    ),
    [columns, activeSort, cycleSort],
  );

  const itemContent = useCallback(
    (_index: number, row: Row) => (
      <>
        {columns.map((column) => (
          <td
            key={column.id}
            className={cn(column.numeric && "ml-dt-num")}
            style={{ textAlign: alignOf(column) }}
          >
            {rawCellValue(row, column) as ReactNode}
          </td>
        ))}
      </>
    ),
    [columns],
  );

  const computeItemKey = useCallback(
    (index: number, row: Row) => getRowId(row, index),
    [getRowId],
  );

  return (
    <div className="ml-dt-root ml-vdt-root">
      <TableVirtuoso<Row, VdtContext<Row>>
        data={sortedData}
        context={context}
        components={components}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={itemContent}
        computeItemKey={computeItemKey}
        /* Virtuoso applies a passed prop even when its value is `undefined`
           (clobbering its internal defaults) — only spread what's set. */
        {...(overscan !== undefined && { overscan })}
        {...(increaseViewportBy !== undefined && { increaseViewportBy })}
        {...(initialItemCount !== undefined && { initialItemCount })}
        endReached={onEndReached}
        className={cn("ml-vdt-scroll", className)}
        style={{ height, ...style }}
      />
      {footer != null && <div className="ml-dt-footer">{footer}</div>}
    </div>
  );
}
