import { useState } from "react";

const DEFAULT_PAGE_SIZE = 12;

export function usePagination<T>(
  items: T[],
  pageSize = DEFAULT_PAGE_SIZE,
): {
  page: T[];
  pageIndex: number;
  pageCount: number;
  setPage: (index: number) => void;
  reset: () => void;
} {
  const [pageIndex, setPageIndex] = useState(0);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const clamped = Math.min(pageIndex, pageCount - 1);

  if (clamped !== pageIndex) {
    setPageIndex(clamped);
  }

  const start = clamped * pageSize;
  const page = items.slice(start, start + pageSize);

  return {
    page,
    pageIndex: clamped,
    pageCount,
    setPage: setPageIndex,
    reset: () => setPageIndex(0),
  };
}
