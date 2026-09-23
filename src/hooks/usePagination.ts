import { useCallback, useState } from "react";

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

  // Callers key effects on reset ("a filter or a sort starts again at the first
  // page"). A fresh identity each render would fire those effects on every render
  // and snap the table back to page 1 the moment a page is clicked.
  const reset = useCallback(() => setPageIndex(0), []);

  return {
    page,
    pageIndex: clamped,
    pageCount,
    setPage: setPageIndex,
    reset,
  };
}
