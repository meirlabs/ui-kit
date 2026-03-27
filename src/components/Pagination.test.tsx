import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders correct number of page buttons", () => {
    render(<Pagination pageIndex={0} pageCount={5} onPage={() => {}} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it("disables previous button on first page", () => {
    render(<Pagination pageIndex={0} pageCount={5} onPage={() => {}} />);

    const prevButton = screen.getByLabelText("Previous page");
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<Pagination pageIndex={4} pageCount={5} onPage={() => {}} />);

    const nextButton = screen.getByLabelText("Next page");
    expect(nextButton).toBeDisabled();
  });

  it("calls onPage with correct index on click", () => {
    const onPage = vi.fn();
    render(<Pagination pageIndex={0} pageCount={3} onPage={onPage} />);

    fireEvent.click(screen.getByText("2"));
    expect(onPage).toHaveBeenCalledWith(1);
  });

  it("returns null when pageCount <= 1", () => {
    const { container } = render(
      <Pagination pageIndex={0} pageCount={1} onPage={() => {}} />,
    );

    expect(container.innerHTML).toBe("");
  });
});
