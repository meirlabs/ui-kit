import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface PaginationProps extends ComponentPropsWithoutRef<"div"> {
  pageIndex: number;
  pageCount: number;
  onPage: (index: number) => void;
}

export function Pagination({
  pageIndex,
  pageCount,
  onPage,
  className,
  ...rest
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className={cn("ml-pg", className)} {...rest}>
      <button
        className="ml-pg-arrow"
        type="button"
        disabled={pageIndex === 0}
        onClick={() => onPage(pageIndex - 1)}
        aria-label="Previous page"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M7.5 2.5L4 6L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {pages.map((i) => (
        <button
          key={i}
          type="button"
          className={cn("ml-pg-num", i === pageIndex && "active")}
          onClick={() => onPage(i)}
          aria-current={i === pageIndex ? "page" : undefined}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="ml-pg-arrow"
        type="button"
        disabled={pageIndex === pageCount - 1}
        onClick={() => onPage(pageIndex + 1)}
        aria-label="Next page"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
