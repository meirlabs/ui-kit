import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PaginationFooter } from "./PaginationFooter";

describe("PaginationFooter", () => {
  it('renders the "Show N of X results" summary with the default noun', () => {
    render(
      <PaginationFooter
        pageIndex={0}
        pageCount={3}
        onPage={() => {}}
        total={42}
        pageSize={10}
      />,
    );
    expect(screen.getByText(/of 42 results/)).toBeInTheDocument();
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
    expect(screen.getByText(/of 1 lead/)).toBeInTheDocument();
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
    expect(screen.getByText(/of 5 people/)).toBeInTheDocument();
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

  describe("labels", () => {
    it("keeps every English default when labels is omitted", () => {
      render(
        <PaginationFooter pageIndex={0} pageCount={3} onPage={() => {}} total={42} pageSize={10} />,
      );
      expect(screen.getByText("Show")).toBeInTheDocument();
      expect(screen.getByText("of 42 results")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
      expect(screen.getByLabelText("Rows per page")).toBeInTheDocument();
      expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
      expect(screen.getByLabelText("Next page")).toBeInTheDocument();
    });

    it("replaces every visible and accessible string", () => {
      const ofTotal = vi.fn((total: number, noun: string) => `sur ${total} ${noun}`);
      const pageOf = vi.fn((page: number, pageCount: number) => `Page ${page} / ${pageCount}`);
      render(
        <PaginationFooter
          pageIndex={1}
          pageCount={4}
          onPage={() => {}}
          total={40}
          pageSize={10}
          noun="ligne"
          labels={{
            show: "Afficher",
            ofTotal,
            rowsPerPage: "Lignes par page",
            pagination: "Navigation des pages",
            previousPage: "Page précédente",
            nextPage: "Page suivante",
            pageOf,
          }}
        />,
      );
      expect(screen.getByText("Afficher")).toBeInTheDocument();
      expect(screen.getByText("sur 40 lignes")).toBeInTheDocument();
      expect(screen.getByText("Page 2 / 4")).toBeInTheDocument();
      expect(screen.getByLabelText("Lignes par page")).toBeInTheDocument();
      expect(
        screen.getByRole("navigation", { name: "Navigation des pages" }),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Page précédente")).toBeInTheDocument();
      expect(screen.getByLabelText("Page suivante")).toBeInTheDocument();

      // Number-bearing labels get the numbers; the page is 1-based and the
      // noun is already singular/plural.
      expect(ofTotal).toHaveBeenCalledWith(40, "lignes");
      expect(pageOf).toHaveBeenCalledWith(2, 4);

      expect(screen.queryByText("Show")).not.toBeInTheDocument();
      expect(screen.queryByText(/results/)).not.toBeInTheDocument();
    });

    it("falls back to the default for any key left out", () => {
      render(
        <PaginationFooter
          pageIndex={0}
          pageCount={2}
          onPage={() => {}}
          total={1}
          pageSize={10}
          labels={{ nextPage: "Suivant" }}
        />,
      );
      expect(screen.getByLabelText("Suivant")).toBeInTheDocument();
      expect(screen.getByLabelText("Previous page")).toBeInTheDocument();
      expect(screen.getByText("of 1 result")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    });

    it("passes the singular noun to ofTotal when total is 1", () => {
      const ofTotal = vi.fn(() => "x");
      render(
        <PaginationFooter
          pageIndex={0}
          pageCount={1}
          onPage={() => {}}
          total={1}
          pageSize={10}
          noun="lead"
          labels={{ ofTotal }}
        />,
      );
      expect(ofTotal).toHaveBeenCalledWith(1, "lead");
    });

    it('omits the leading word when show is ""', () => {
      const { container } = render(
        <PaginationFooter
          pageIndex={0}
          pageCount={1}
          onPage={() => {}}
          total={8}
          pageSize={10}
          labels={{ show: "" }}
        />,
      );
      expect(screen.queryByText("Show")).not.toBeInTheDocument();
      // Only the select shell and the "of N results" span remain.
      expect(container.querySelector(".ml-pgf-size")?.children).toHaveLength(2);
    });
  });
});
