import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PaginationFooter } from "./PaginationFooter";

describe("PaginationFooter", () => {
  it('renders the "Show N results (X total)" summary with the default noun', () => {
    render(
      <PaginationFooter
        pageIndex={0}
        pageCount={3}
        onPage={() => {}}
        total={42}
        pageSize={10}
      />,
    );
    expect(screen.getByText(/results \(42 rows total\)/)).toBeInTheDocument();
  });

  it("singularizes the noun when total is 1", () => {
    render(
      <PaginationFooter
        pageIndex={0}
        pageCount={1}
        onPage={() => {}}
        total={1}
        pageSize={10}
        noun="lead"
      />,
    );
    expect(screen.getByText(/results \(1 lead total\)/)).toBeInTheDocument();
  });

  it("pluralizes with the custom noun/nounPlural pair", () => {
    render(
      <PaginationFooter
        pageIndex={0}
        pageCount={1}
        onPage={() => {}}
        total={5}
        pageSize={10}
        noun="person"
        nounPlural="people"
      />,
    );
    expect(screen.getByText(/results \(5 people total\)/)).toBeInTheDocument();
  });

  it('renders "Page x of y"', () => {
    render(
      <PaginationFooter
        pageIndex={1}
        pageCount={4}
        onPage={() => {}}
        total={40}
        pageSize={10}
      />,
    );
    expect(screen.getByText("Page 2 of 4")).toBeInTheDocument();
  });

  it("disables Previous on the first page and Next on the last page", () => {
    render(
      <PaginationFooter
        pageIndex={0}
        pageCount={2}
        onPage={() => {}}
        total={20}
        pageSize={10}
      />,
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).toBeEnabled();
  });

  it("calls onPage with the right index for the chevrons", () => {
    const onPage = vi.fn();
    render(
      <PaginationFooter
        pageIndex={1}
        pageCount={3}
        onPage={onPage}
        total={30}
        pageSize={10}
      />,
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPage).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByLabelText("Previous page"));
    expect(onPage).toHaveBeenCalledWith(0);
  });

  it("reports page-size changes and disables the select when no handler is given", () => {
    const onPageSizeChange = vi.fn();
    render(
      <PaginationFooter
        pageIndex={0}
        pageCount={1}
        onPage={() => {}}
        total={8}
        pageSize={25}
        pageSizeOptions={[10, 25, 50]}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    const select = screen.getByLabelText("Rows per page") as HTMLSelectElement;
    expect(select.value).toBe("25");
    fireEvent.change(select, { target: { value: "50" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(50);
  });

  it("disables the page-size select when onPageSizeChange is omitted", () => {
    render(
      <PaginationFooter pageIndex={0} pageCount={1} onPage={() => {}} total={8} pageSize={10} />,
    );
    expect(screen.getByLabelText("Rows per page")).toBeDisabled();
  });
});
