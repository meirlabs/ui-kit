import { type ComponentPropsWithoutRef, useId } from "react";
import { cn } from "../utils/cn";

/* ────────────────────────────────────────────────────────────────────────────
   PaginationFooter — the mailgail table-footer convention: a page-size picker
   reading "Show N ▾ of X results" at the start edge, and a "Page x of y"
   chevron stepper at the end edge (the row and its chevrons mirror under
   dir="rtl"; every string is overridable through `labels`). Deliberately no numbered page buttons (that's
   what the plain `<Pagination>` component is for) — page counts under this
   pattern are small by construction, so a stepper is enough; a table that
   needs jump-to-page wants a filter instead.

   Drop this straight into DataTable's `footer` slot:
     <DataTable ... footer={<PaginationFooter ... />} />
   ──────────────────────────────────────────────────────────────────────────── */

/**
 * Every visible and accessible string the footer renders. All keys are
 * optional; anything omitted keeps its English default. Strings that embed
 * numbers are functions, so word order and plural rules stay with the caller.
 */
export interface PaginationFooterLabels {
  /** Text before the page-size select. Default `"Show"`. Pass `""` to omit it. */
  show?: string;
  /**
   * Text after the page-size select. `noun` is the already singular/plural
   * form picked from the `noun`/`nounPlural` props. Default
   * `` `of ${total} ${noun}` ``.
   */
  ofTotal?: (total: number, noun: string) => string;
  /** Accessible name of the page-size select. Default `"Rows per page"`. */
  rowsPerPage?: string;
  /** Accessible name of the stepper `<nav>`. Default `"Pagination"`. */
  pagination?: string;
  /** Accessible name of the previous-page button. Default `"Previous page"`. */
  previousPage?: string;
  /** Accessible name of the next-page button. Default `"Next page"`. */
  nextPage?: string;
  /** The stepper label; `page` is 1-based. Default `` `Page ${page} of ${pageCount}` ``. */
  pageOf?: (page: number, pageCount: number) => string;
}

const DEFAULT_LABELS: Required<PaginationFooterLabels> = {
  show: "Show",
  ofTotal: (total, noun) => `of ${total} ${noun}`,
  rowsPerPage: "Rows per page",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  pageOf: (page, pageCount) => `Page ${page} of ${pageCount}`,
};

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
  /** Singular noun for the count, e.g. `"lead"`. Default `"result"`. */
  noun?: string;
  /** Plural noun. Defaults to `${noun}s`. */
  nounPlural?: string;
  /** Override any of the built-in strings (translation). English by default. */
  labels?: PaginationFooterLabels;
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
  noun = "result",
  nounPlural,
  labels,
  className,
  ...rest
}: PaginationFooterProps) {
  const sizeId = useId();
  const t = { ...DEFAULT_LABELS, ...labels };
  const label = total === 1 ? noun : (nounPlural ?? `${noun}s`);
  const safePageCount = Math.max(pageCount, 1);
  const atStart = pageIndex <= 0;
  const atEnd = pageIndex >= safePageCount - 1;

  return (
    <div className={cn("ml-pgf", className)} {...rest}>
      <span className="ml-pgf-size">
        {t.show !== "" && <span>{t.show}</span>}
        <span className="ml-pgf-size-shell">
          <select
            id={sizeId}
            aria-label={t.rowsPerPage}
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
        <span>{t.ofTotal(total, label)}</span>
      </span>

      <nav aria-label={t.pagination} className="ml-pgf-stepper">
        <button
          type="button"
          className="ml-pgf-arrow"
          aria-label={t.previousPage}
          disabled={atStart}
          onClick={() => onPage(pageIndex - 1)}
        >
          <ChevronLeft />
        </button>
        <span className="ml-pgf-label">{t.pageOf(pageIndex + 1, safePageCount)}</span>
        <button
          type="button"
          className="ml-pgf-arrow"
          aria-label={t.nextPage}
          disabled={atEnd}
          onClick={() => onPage(pageIndex + 1)}
        >
          <ChevronRight />
        </button>
      </nav>
    </div>
  );
}
