import { type ComponentPropsWithoutRef, useId } from "react";
import { cn } from "../utils/cn";

export const PAGINATION_DOTS = "dots" as const;
type PageToken = number | typeof PAGINATION_DOTS;

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Compute the windowed list of 0-based page indices to render, inserting
 * `"dots"` gap tokens so a large `pageCount` never renders every button.
 * Always keeps the first and last page plus `siblingCount` pages on each side
 * of the current page.
 */
export function getPaginationRange(
  pageCount: number,
  pageIndex: number,
  siblingCount = 1,
): PageToken[] {
  // first + last + current + 2 dots + siblings on both sides
  const totalNumbers = siblingCount * 2 + 5;
  if (totalNumbers >= pageCount) return range(0, pageCount - 1);

  const first = 0;
  const last = pageCount - 1;
  const leftSibling = Math.max(pageIndex - siblingCount, first);
  const rightSibling = Math.min(pageIndex + siblingCount, last);

  // Show dots only when there is a hidden gap of >1 page.
  const showLeftDots = leftSibling > first + 1;
  const showRightDots = rightSibling < last - 1;

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + 2 * siblingCount;
    return [...range(first, first + leftCount - 1), PAGINATION_DOTS, last];
  }
  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + 2 * siblingCount;
    return [first, PAGINATION_DOTS, ...range(last - rightCount + 1, last)];
  }
  return [
    first,
    PAGINATION_DOTS,
    ...range(leftSibling, rightSibling),
    PAGINATION_DOTS,
    last,
  ];
}

export interface PaginationProps
  extends Omit<ComponentPropsWithoutRef<"nav">, "onChange"> {
  pageIndex: number;
  pageCount: number;
  onPage: (index: number) => void;
  /** Pages to show on each side of the current page (default 1). */
  siblingCount?: number;
  /** Render first/last jump buttons on the outer edges. */
  showEdges?: boolean;
  /** Current rows-per-page value; renders a page-size selector when set. */
  pageSize?: number;
  /** Options for the page-size selector (default 10 / 25 / 50 / 100). */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

const DEFAULT_SIZE_OPTIONS = [10, 25, 50, 100];

function ChevronLeft() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M7.5 2.5L4 6L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronFirst() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M9 2.5L5.5 6L9 9.5M5 2.5L1.5 6L5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ChevronLast() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 2.5L6.5 6L3 9.5M7 2.5L10.5 6L7 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Pagination — a `<nav aria-label="Pagination">` landmark with windowed page
 * buttons. For large `pageCount` it collapses the middle into `…` gaps
 * (`siblingCount` controls the window). The current page expresses selection by
 * **color only** (inverted monochrome fill) — weight/size/padding stay constant
 * so nothing reflows. Disabled edge/step arrows keep their reserved space.
 *
 * Optionally renders first/last jump buttons (`showEdges`) and a rows-per-page
 * selector (`pageSize` + `onPageSizeChange`). All controls get a
 * `:focus-visible` ring.
 */
export function Pagination({
  pageIndex,
  pageCount,
  onPage,
  siblingCount = 1,
  showEdges = false,
  pageSize,
  pageSizeOptions = DEFAULT_SIZE_OPTIONS,
  onPageSizeChange,
  className,
  ...rest
}: PaginationProps) {
  const sizeId = useId();
  const hasPager = pageCount > 1;
  const hasSizeControl = pageSize != null && onPageSizeChange != null;

  if (!hasPager && !hasSizeControl) return null;

  const tokens = hasPager ? getPaginationRange(pageCount, pageIndex, siblingCount) : [];
  const atStart = pageIndex <= 0;
  const atEnd = pageIndex >= pageCount - 1;

  return (
    <nav aria-label="Pagination" className={cn("ml-pg", className)} {...rest}>
      {hasPager && (
        <>
          {showEdges && (
            <button
              type="button"
              className="ml-pg-arrow"
              disabled={atStart}
              onClick={() => onPage(0)}
              aria-label="First page"
            >
              <ChevronFirst />
            </button>
          )}
          <button
            type="button"
            className="ml-pg-arrow"
            disabled={atStart}
            onClick={() => onPage(pageIndex - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </button>

          {tokens.map((token, i) =>
            token === PAGINATION_DOTS ? (
              <span key={`dots-${i}`} className="ml-pg-dots" aria-hidden="true">
                …
              </span>
            ) : (
              <button
                key={token}
                type="button"
                className={cn("ml-pg-num", token === pageIndex && "active")}
                onClick={() => onPage(token)}
                aria-label={`Page ${token + 1}`}
                aria-current={token === pageIndex ? "page" : undefined}
              >
                {token + 1}
              </button>
            ),
          )}

          <button
            type="button"
            className="ml-pg-arrow"
            disabled={atEnd}
            onClick={() => onPage(pageIndex + 1)}
            aria-label="Next page"
          >
            <ChevronRight />
          </button>
          {showEdges && (
            <button
              type="button"
              className="ml-pg-arrow"
              disabled={atEnd}
              onClick={() => onPage(pageCount - 1)}
              aria-label="Last page"
            >
              <ChevronLast />
            </button>
          )}
        </>
      )}

      {hasSizeControl && (
        <div className="ml-pg-size">
          <label htmlFor={sizeId}>Rows</label>
          <select
            id={sizeId}
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </nav>
  );
}
