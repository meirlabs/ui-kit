import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MetricGroup, MetricValue } from "./MetricValue";

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

  it("does not render a NumberFlow element on the static path", () => {
    render(<MetricValue value={42} data-testid="metric" />);

    const el = screen.getByTestId("metric");
    expect(el.querySelector("number-flow-react")).toBeNull();
    expect(el).toHaveTextContent("42");
  });

  describe("animated", () => {
    it("renders a NumberFlow element instead of formatted text", () => {
      render(<MetricValue animated value={1234} data-testid="metric" />);

      const flow = screen.getByTestId("metric").querySelector("number-flow-react");
      expect(flow).toBeInTheDocument();
    });

    it("forces dir=ltr on the animated element so numbers stay LTR in RTL pages", () => {
      render(
        <div dir="rtl">
          <MetricValue animated value={1234} data-testid="metric" />
        </div>,
      );

      const flow = screen.getByTestId("metric").querySelector("number-flow-react");
      expect(flow).toHaveAttribute("dir", "ltr");
    });

    it("accepts Intl format options plus prefix/suffix without crashing", () => {
      render(
        <MetricValue
          animated
          value={0.42}
          format={{ style: "percent", maximumFractionDigits: 0 }}
          prefix="~"
          suffix=" MoM"
          data-testid="metric"
        />,
      );

      expect(
        screen.getByTestId("metric").querySelector("number-flow-react"),
      ).toBeInTheDocument();
    });

    it("keeps the wrapper span's tone classes and tabular-nums", () => {
      render(<MetricValue animated value={-9} data-testid="metric" />);

      const el = screen.getByTestId("metric");
      expect(el).toHaveClass("ml-metric", "ml-metric-negative");
      expect(el).toHaveStyle({ fontVariantNumeric: "tabular-nums" });
    });

    it("still renders the delta indicator next to the animated value", () => {
      render(<MetricValue animated value={120} delta={8} data-testid="metric" />);

      const el = screen.getByTestId("metric");
      expect(el.querySelector("number-flow-react")).toBeInTheDocument();
      const delta = el.querySelector(".ml-metric-delta");
      expect(delta).toHaveClass("ml-metric-positive");
      expect(delta).toHaveTextContent("8");
    });

    it("falls back to static Intl-formatted text for non-finite values", () => {
      render(
        <MetricValue animated value={Number.NaN} prefix="$" data-testid="metric" />,
      );

      const el = screen.getByTestId("metric");
      expect(el.querySelector("number-flow-react")).toBeNull();
      expect(el).toHaveTextContent("$NaN");
    });
  });

  describe("MetricGroup", () => {
    it("renders multiple animated metrics without extra DOM", () => {
      const { container } = render(
        <MetricGroup>
          <MetricValue animated value={10} data-testid="a" />
          <MetricValue animated value={20} data-testid="b" />
        </MetricGroup>,
      );

      expect(container.querySelectorAll("number-flow-react")).toHaveLength(2);
      expect(screen.getByTestId("a")).toBeInTheDocument();
      expect(screen.getByTestId("b")).toBeInTheDocument();
    });
  });
});
