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

  it("applies tabular-nums so values align as digits change", () => {
    render(<MetricValue value={100} data-testid="metric" />);

    const el = screen.getByTestId("metric");
    expect(el).toHaveStyle({ fontVariantNumeric: "tabular-nums" });
    expect(el).toHaveClass("ml-metric");
  });

  it("merges a consumer style without dropping tabular-nums", () => {
    render(
      <MetricValue value={5} data-testid="metric" style={{ fontWeight: 600 }} />,
    );

    const el = screen.getByTestId("metric");
    expect(el).toHaveStyle({ fontVariantNumeric: "tabular-nums" });
    expect(el).toHaveStyle({ fontWeight: "600" });
  });

  it("renders an up delta as functional success and hides the sign in the number", () => {
    render(<MetricValue value={120} delta={8} data-testid="metric" />);

    const delta = screen.getByTestId("metric").querySelector(".ml-metric-delta");
    expect(delta).toBeInTheDocument();
    expect(delta).toHaveClass("ml-metric-positive");
    expect(delta).toHaveTextContent("8");
    expect(delta).not.toHaveTextContent("-");
  });

  it("renders a down delta as functional danger", () => {
    render(<MetricValue value={120} delta={-8} data-testid="metric" />);

    const delta = screen.getByTestId("metric").querySelector(".ml-metric-delta");
    expect(delta).toHaveClass("ml-metric-negative");
    expect(delta).toHaveTextContent("8");
  });

  it("respects an explicit deltaDirection over the sign", () => {
    render(
      <MetricValue value={120} delta={4} deltaDirection="down" data-testid="metric" />,
    );

    const delta = screen.getByTestId("metric").querySelector(".ml-metric-delta");
    expect(delta).toHaveClass("ml-metric-negative");
  });
});
