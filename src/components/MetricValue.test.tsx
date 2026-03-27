import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MetricValue } from "./MetricValue";

describe("MetricValue", () => {
  it("applies ml-metric-positive for positive values", () => {
    render(<MetricValue value={42} data-testid="metric" />);

    const el = screen.getByTestId("metric");
    expect(el).toHaveClass("ml-metric-positive");
  });

  it("applies ml-metric-negative for negative values", () => {
    render(<MetricValue value={-10} data-testid="metric" />);

    const el = screen.getByTestId("metric");
    expect(el).toHaveClass("ml-metric-negative");
  });

  it("uses custom formatter when provided", () => {
    render(
      <MetricValue
        value={1234}
        formatter={(v) => `$${v}`}
        data-testid="metric"
      />,
    );

    const el = screen.getByTestId("metric");
    expect(el).toHaveTextContent("$1234");
  });

  it("handles zero correctly", () => {
    render(<MetricValue value={0} data-testid="metric" />);

    const el = screen.getByTestId("metric");
    expect(el).not.toHaveClass("ml-metric-positive");
    expect(el).not.toHaveClass("ml-metric-negative");
  });

  it("passes through native span props", () => {
    render(<MetricValue value={5} data-testid="metric" className="custom" />);

    const el = screen.getByTestId("metric");
    expect(el).toHaveAttribute("data-testid", "metric");
    expect(el).toHaveClass("custom");
  });
});
