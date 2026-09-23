import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterBar } from "./FilterBar";

describe("FilterBar", () => {
  it("renders an always-visible search field by default", () => {
    render(<FilterBar searchValue="" onSearchChange={() => {}} />);
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
  });

  it("calls onSearchChange as the user types", () => {
    const onSearchChange = vi.fn();
    render(<FilterBar searchValue="" onSearchChange={onSearchChange} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Search" }), {
      target: { value: "acme" },
    });
    expect(onSearchChange).toHaveBeenCalledWith("acme");
  });

  it("hides the Filters button when onFiltersClick is omitted", () => {
    render(<FilterBar searchValue="" onSearchChange={() => {}} />);
    expect(screen.queryByRole("button", { name: /filters/i })).not.toBeInTheDocument();
  });

  it("renders a plain Filters button with no active filters", () => {
    render(<FilterBar searchValue="" onSearchChange={() => {}} onFiltersClick={() => {}} />);
    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
  });

  it("shows the active-filter count in the Filters button label", () => {
    render(
      <FilterBar
        searchValue=""
        onSearchChange={() => {}}
        onFiltersClick={() => {}}
        filterCount={3}
      />,
    );
    expect(screen.getByRole("button", { name: "Filters (3)" })).toBeInTheDocument();
  });

  it("calls onFiltersClick when the Filters button is clicked", () => {
    const onFiltersClick = vi.fn();
    render(
      <FilterBar searchValue="" onSearchChange={() => {}} onFiltersClick={onFiltersClick} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Filters" }));
    expect(onFiltersClick).toHaveBeenCalledTimes(1);
  });

  it("renders extra left/right slots and the active-filter chip row", () => {
    render(
      <FilterBar searchValue="" onSearchChange={() => {}} activeFilters={<span>Tier: A</span>}>
        <span>Left slot</span>
      </FilterBar>,
    );
    expect(screen.getByText("Left slot")).toBeInTheDocument();
    expect(screen.getByText("Tier: A")).toBeInTheDocument();
  });

  describe("collapsible search", () => {
    it("starts collapsed to an icon trigger when empty", () => {
      render(<FilterBar searchValue="" onSearchChange={() => {}} collapsible />);
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
      expect(screen.queryByRole("textbox", { name: "Search" })).not.toBeInTheDocument();
    });

    it("starts expanded when there is already a query", () => {
      render(<FilterBar searchValue="acme" onSearchChange={() => {}} collapsible />);
      expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    });

    it("expands to the input when the trigger is clicked", () => {
      render(<FilterBar searchValue="" onSearchChange={() => {}} collapsible />);
      fireEvent.click(screen.getByRole("button", { name: "Search" }));
      expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    });

    it("collapses back on blur only when the query is empty", () => {
      render(<FilterBar searchValue="" onSearchChange={() => {}} collapsible />);
      fireEvent.click(screen.getByRole("button", { name: "Search" }));
      fireEvent.blur(screen.getByRole("textbox", { name: "Search" }));
      expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    });

    it("stays open on blur when the query is non-empty", () => {
      render(<FilterBar searchValue="acme" onSearchChange={() => {}} collapsible />);
      fireEvent.blur(screen.getByRole("textbox", { name: "Search" }));
      expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    });
  });
});
