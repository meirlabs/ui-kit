import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EmptyState } from "./EmptyState";

const art = (container: HTMLElement) => container.querySelector(".ml-empty-state-art");

describe("EmptyState", () => {
  it("renders title, description and action", () => {
    render(
      <EmptyState
        title="No clients yet"
        description="Clients you add will show up here."
        action={<button>Add</button>}
      />,
    );
    expect(screen.getByText("No clients yet")).toHaveClass("ml-empty-state-title");
    expect(screen.getByText("Clients you add will show up here.")).toHaveClass(
      "ml-empty-state-desc",
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("draws the default illustration for no-data and no-results, none for error", () => {
    const noData = render(<EmptyState title="Nothing" />);
    expect(art(noData.container)?.querySelector("svg")).toBeInTheDocument();
    noData.unmount();

    const noResults = render(<EmptyState title="Nothing" variant="no-results" />);
    expect(art(noResults.container)?.querySelector("svg")).toBeInTheDocument();
    noResults.unmount();

    const error = render(<EmptyState title="Failed" variant="error" />);
    expect(art(error.container)).toBeNull();
  });

  it("prefers a custom illustration, then a custom icon, over the default", () => {
    const both = render(
      <EmptyState title="x" illustration={<i data-testid="ill" />} icon={<i data-testid="icon" />} />,
    );
    expect(screen.getByTestId("ill")).toBeInTheDocument();
    expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    both.unmount();

    render(<EmptyState title="x" icon={<i data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it.each([null, false] as const)(
    "renders no artwork (and no empty wrapper) with illustration={%s}",
    (off) => {
      const { container } = render(<EmptyState title="Nothing" illustration={off} />);
      expect(art(container)).toBeNull();
      expect(container.querySelector("svg")).toBeNull();
      expect(screen.getByText("Nothing")).toBeInTheDocument();
    },
  );

  it("still shows a custom icon when the illustration is switched off", () => {
    render(<EmptyState title="x" illustration={null} icon={<i data-testid="icon" />} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
