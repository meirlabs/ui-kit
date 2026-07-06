import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Pagination, getPaginationRange, PAGINATION_DOTS } from "./Pagination";

describe("Pagination", () => {
  it("renders a Pagination nav landmark", () => {
    render(<Pagination pageIndex={0} pageCount={5} onPage={() => {}} />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("renders correct number of page buttons for small counts", () => {
    render(<Pagination pageIndex={0} pageCount={5} onPage={() => {}} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("button", { name: `Page ${i}` })).toBeInTheDocument();
    }
  });

  it("disables previous button on first page", () => {
    render(<Pagination pageIndex={0} pageCount={5} onPage={() => {}} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<Pagination pageIndex={4} pageCount={5} onPage={() => {}} />);
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("calls onPage with correct index on click", () => {
    const onPage = vi.fn();
    render(<Pagination pageIndex={0} pageCount={3} onPage={onPage} />);
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onPage).toHaveBeenCalledWith(1);
  });

  it("returns null when pageCount <= 1 and no size control", () => {
    const { container } = render(
      <Pagination pageIndex={0} pageCount={1} onPage={() => {}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("windows large page counts instead of rendering every button", () => {
    render(<Pagination pageIndex={24} pageCount={50} onPage={() => {}} />);
    // Nowhere near 50 numbered buttons.
    const numbered = screen
      .getAllByRole("button")
      .filter((b) => /^Page \d+$/.test(b.getAttribute("aria-label") ?? ""));
    expect(numbered.length).toBeLessThan(12);
    // First and last always present.
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 50" })).toBeInTheDocument();
    // Ellipsis gaps present.
    expect(screen.getAllByText("…").length).toBeGreaterThan(0);
  });

  it("marks the current page with aria-current and no weight jump", () => {
    render(<Pagination pageIndex={2} pageCount={5} onPage={() => {}} />);
    const current = screen.getByRole("button", { name: "Page 3" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("active");
    // Selection is color-only: the active button keeps the base weight class,
    // it does not add a bespoke weight utility.
  });

  it("renders first/last edge buttons when showEdges is set", () => {
    render(<Pagination pageIndex={2} pageCount={10} onPage={() => {}} showEdges />);
    expect(screen.getByLabelText("First page")).toBeInTheDocument();
    expect(screen.getByLabelText("Last page")).toBeInTheDocument();
  });

  it("renders a page-size selector and reports changes", () => {
    const onPageSizeChange = vi.fn();
    render(
      <Pagination
        pageIndex={0}
        pageCount={5}
        onPage={() => {}}
        pageSize={25}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    const select = screen.getByLabelText("Rows") as HTMLSelectElement;
    expect(select.value).toBe("25");
    fireEvent.change(select, { target: { value: "50" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it("renders the size control even with a single page", () => {
    render(
      <Pagination
        pageIndex={0}
        pageCount={1}
        onPage={() => {}}
        pageSize={10}
        onPageSizeChange={() => {}}
      />,
    );
    expect(screen.getByLabelText("Rows")).toBeInTheDocument();
    expect(screen.queryByLabelText("Next page")).not.toBeInTheDocument();
  });
});

describe("getPaginationRange", () => {
  it("returns every page when the count is small", () => {
    expect(getPaginationRange(5, 2)).toEqual([0, 1, 2, 3, 4]);
  });

  it("adds a trailing gap near the start", () => {
    const r = getPaginationRange(50, 1);
    expect(r[0]).toBe(0);
    expect(r).toContain(PAGINATION_DOTS);
    expect(r[r.length - 1]).toBe(49);
  });

  it("adds a leading gap near the end", () => {
    const r = getPaginationRange(50, 48);
    expect(r[0]).toBe(0);
    expect(r[1]).toBe(PAGINATION_DOTS);
    expect(r[r.length - 1]).toBe(49);
  });

  it("adds gaps on both sides in the middle", () => {
    const r = getPaginationRange(50, 24, 1);
    expect(r).toEqual([0, PAGINATION_DOTS, 23, 24, 25, PAGINATION_DOTS, 49]);
  });
});
