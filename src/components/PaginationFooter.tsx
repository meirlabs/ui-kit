import { type ComponentPropsWithoutRef, useId } from "react";
import { cn } from "../utils/cn";

/* ────────────────────────────────────────────────────────────────────────────
   PaginationFooter — the mailgail table-footer convention: a page-size picker
   reading "Show N ▾ results (X total)" on the left, and a "Page x of y"
   chevron stepper on the right. Deliberately no numbered page buttons (that's
   what the plain `<Pagination>` component is for) — page counts under this
   pattern are small by construction, so a stepper is enough; a table that
   needs jump-to-page wants a filter instead.

   Drop this straight into DataTable's `footer` slot:
     <DataTable ... footer={<PaginationFooter ... />} />
   ──────────────────────────────────────────────────────────────────────────── */

export interface PaginationFooterProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  pageIndex: number;
  pageCount: number;
  onPage: (index: number) => void;
  /** Total row count across all pages (feeds the "(N total)" copy). */
  total: number;
  pageSize: number;
  /** Omit to render the size select disabled (rows-per-page fixed by the caller). */
  onPageSizeChange?: (size: number) => void;
  /** Options offered in the page-size `<select>`. Default `[10, 25, 50, 100]`. */
  pageSizeOptions?: number[];
  /** Singular noun for the count, e.g. `"lead"`. Default `"row"`. */
  noun?: string;
  /** Plural noun. Defaults to `${noun}s`. */
  nounPlural?: string;
  className?: string;
}

function ChevronLeft() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M7.5 2.5L4 6L7.5 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M4.5 2.5L8 6L4.5 9.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DEFAULT_SIZE_OPTIONS = [10, 25, 50, 100];

export function PaginationFooter({
  pageIndex,
  pageCount,
  onPage,
  total,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_SIZE_OPTIONS,
  noun = "row",
  nounPlural,
  className,
  ...rest
}: PaginationFooterProps) {
  const sizeId = useId();
  const label = total === 1 ? noun : (nounPlural ?? `${noun}s`);
  const safePageCount = Math.max(pageCount, 1);
  const atStart = pageIndex <= 0;
  const atEnd = pageIndex >= safePageCount - 1;

  return (
    <div className={cn("ml-pgf", className)} {...rest}>
      <span className="ml-pgf-size">
        <span>Show</span>
        <span className="ml-pgf-size-shell">
          <select
            id={sizeId}
            aria-label="Rows per page"
            value={pageSize}
            disabled={onPageSizeChange == null}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <ChevronDown />
        </span>
        <span>
          results ({total} {label} total)
        </span>
      </span>

      <nav aria-label="Pagination" className="ml-pgf-stepper">
        <button
          type="button"
          className="ml-pgf-arrow"
          aria-label="Previous page"
          disabled={atStart}
          onClick={() => onPage(pageIndex - 1)}
        >
          <ChevronLeft />
        </button>
        <span className="ml-pgf-label">
          Page {pageIndex + 1} of {safePageCount}
        </span>
        <button
          type="button"
          className="ml-pgf-arrow"
          aria-label="Next page"
          disabled={atEnd}
          onClick={() => onPage(pageIndex + 1)}
        >
          <ChevronRight />
        </button>
      </nav>
    </div>
  );
}
