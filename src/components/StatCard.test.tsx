import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("does not render the value as a bold <strong> (weight must not be 700)", () => {
    const { container } = render(<StatCard value="1,234" label="Users" />);
    // Old implementation used <strong> (implicit bold). Ensure it's gone.
    expect(container.querySelector("strong")).toBeNull();
    const valueEl = container.querySelector(".ml-stat-card-value");
    expect(valueEl).not.toBeNull();
    expect(valueEl).not.toHaveStyle({ fontWeight: "700" });
  });

  it("applies tabular-nums on the value", () => {
    const { container } = render(<StatCard value="9,001" label="Score" />);
    const valueEl = container.querySelector(".ml-stat-card-value");
    expect(valueEl).toHaveStyle({ fontVariantNumeric: "tabular-nums" });
    expect(valueEl).toHaveClass("ml-tabular");
  });

  it("colors a positive delta with the success trend class", () => {
    const { container } = render(
      <StatCard value="120" label="Revenue" delta={12} />,
    );
    const delta = container.querySelector(".ml-stat-card-delta");
    expect(delta).toHaveClass("ml-stat-card-delta--up");
    // Sign carried by the arrow; number shows absolute value.
    expect(delta).toHaveTextContent("12");
  });

  it("colors a negative delta with the danger trend class", () => {
    const { container } = render(
      <StatCard value="120" label="Revenue" delta={-8} />,
    );
    const delta = container.querySelector(".ml-stat-card-delta");
    expect(delta).toHaveClass("ml-stat-card-delta--down");
    expect(delta).toHaveTextContent("8");
    expect(delta).not.toHaveTextContent("-");
  });

  it("honors an explicit trend over the delta sign", () => {
    const { container } = render(
      <StatCard value="120" label="Revenue" delta={4} trend="down" />,
    );
    expect(container.querySelector(".ml-stat-card-delta")).toHaveClass(
      "ml-stat-card-delta--down",
    );
  });

  it("reserves value height with a skeleton while loading", () => {
    const { container } = render(<StatCard value="x" label="Loading" loading />);
    expect(container.querySelector(".ml-stat-card-value-skel")).not.toBeNull();
    expect(container.querySelector(".ml-stat-card-value")).toBeNull();
    expect(container.querySelector(".ml-stat-card")).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("renders the label", () => {
    render(<StatCard value="42" label="Total Widgets" />);
    expect(screen.getByText("Total Widgets")).toBeInTheDocument();
  });
});
