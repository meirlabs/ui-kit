import { useEffect } from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePagination } from "./usePagination";

describe("usePagination", () => {
  it("paginates with default page size (12)", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    expect(result.current.page).toHaveLength(12);
    expect(result.current.pageCount).toBe(3);
    expect(result.current.pageIndex).toBe(0);
  });

  it("paginates with custom page size", () => {
    const items = Array.from({ length: 10 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 3));

    expect(result.current.page).toHaveLength(3);
    expect(result.current.pageCount).toBe(4);
    expect(result.current.page).toEqual([0, 1, 2]);
  });

  it("clamps page index when items shrink", () => {
    const bigList = Array.from({ length: 25 }, (_, i) => i);
    const smallList = Array.from({ length: 5 }, (_, i) => i);

    const { result, rerender } = renderHook(
      ({ items }) => usePagination(items),
      { initialProps: { items: bigList } },
    );

    // Navigate to page 2 (index 2)
    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.pageIndex).toBe(2);

    // Re-render with smaller list — should clamp to page 0
    rerender({ items: smallList });
    expect(result.current.pageIndex).toBe(0);
  });

  it("returns single page for empty array", () => {
    const { result } = renderHook(() => usePagination([]));

    expect(result.current.page).toEqual([]);
    expect(result.current.pageCount).toBe(1);
    expect(result.current.pageIndex).toBe(0);
  });

  it("reset() returns to page 0", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items));

    // Navigate to page 2
    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.pageIndex).toBe(2);

    // Reset
    act(() => {
      result.current.reset();
    });
    expect(result.current.pageIndex).toBe(0);
  });
});

describe("usePagination identities", () => {
  it("keeps setPage and reset stable across renders", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result, rerender } = renderHook(() => usePagination(items));
    const first = { setPage: result.current.setPage, reset: result.current.reset };

    rerender();

    expect(result.current.setPage).toBe(first.setPage);
    expect(result.current.reset).toBe(first.reset);
  });

  it("stays on the chosen page when an effect is keyed on reset", () => {
    // The shape every caller writes: "a filter or a sort starts again at the first page".
    // An unstable reset makes that effect fire on every render, so a page click snaps back.
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => {
      const pagination = usePagination(items);
      const { reset } = pagination;
      useEffect(() => reset(), [reset]);
      return pagination;
    });

    act(() => {
      result.current.setPage(1);
    });

    expect(result.current.pageIndex).toBe(1);
    expect(result.current.page).toEqual([12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]);
  });
});
