import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LiveChart } from "./LiveChart";

// Canvas is not implemented in jsdom, so liveline is mocked. The wrapper's
// contract under test is what it renders around the chart and which props it
// forwards / overrides.
const capturedProps: Array<Record<string, unknown>> = [];
vi.mock("liveline", () => ({
  Liveline: (props: Record<string, unknown>) => {
    capturedProps.push(props);
    return (
      <div data-testid="liveline-mock" className={props.className as string} />
    );
  },
  LivelineTransition: ({ children }: { children?: unknown }) => (
    <div>{children as never}</div>
  ),
}));

function lastProps() {
  expect(capturedProps.length).toBeGreaterThan(0);
  return capturedProps[capturedProps.length - 1];
}

function mockMatchMedia(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

const DATA = [{ time: 1, value: 100 }];

beforeEach(() => {
  capturedProps.length = 0;
  mockMatchMedia(false);
});

afterEach(() => {
  // @ts-expect-error jsdom has no native matchMedia; drop the stub
  delete window.matchMedia;
});

describe("LiveChart", () => {
  it("renders the container with the ml-livechart class and merges className", () => {
    const { container } = render(
      <LiveChart data={DATA} value={100} className="extra" />,
    );
    const root = container.firstElementChild;
    expect(root).toHaveClass("ml-livechart", "extra");
    expect(screen.getByTestId("liveline-mock")).toHaveClass(
      "ml-livechart-chart",
    );
  });

  it("turns decorative effects off by default (monochrome house style)", () => {
    render(<LiveChart data={DATA} value={100} />);
    const props = lastProps();
    expect(props.momentum).toBe(false);
    expect(props.pulse).toBe(false);
    expect(props.degen).toBe(false);
    expect(props.valueMomentumColor).toBe(false);
    expect(props.badgeVariant).toBe("minimal");
  });

  it("lets consumers opt back in to effects via props", () => {
    render(
      <LiveChart data={DATA} value={100} pulse degen momentum lerpSpeed={0.2} />,
    );
    const props = lastProps();
    expect(props.pulse).toBe(true);
    expect(props.degen).toBe(true);
    expect(props.momentum).toBe(true);
    expect(props.lerpSpeed).toBe(0.2);
  });

  it("forces effects off and snaps interpolation under prefers-reduced-motion", () => {
    mockMatchMedia(true);
    render(
      <LiveChart data={DATA} value={100} pulse degen lerpSpeed={0.05} />,
    );
    const props = lastProps();
    expect(props.pulse).toBe(false);
    expect(props.degen).toBe(false);
    expect(props.lerpSpeed).toBe(1);
  });

  it("does not crash when matchMedia is unavailable and treats motion as allowed", () => {
    // @ts-expect-error simulate an environment without matchMedia
    delete window.matchMedia;
    render(<LiveChart data={DATA} value={100} pulse />);
    expect(lastProps().pulse).toBe(true);
  });

  it("picks up the ambient data-meirlabs-theme and defaults to dark without one", () => {
    render(
      <div data-meirlabs-theme="light">
        <LiveChart data={DATA} value={100} />
      </div>,
    );
    expect(lastProps().theme).toBe("light");

    capturedProps.length = 0;
    render(<LiveChart data={DATA} value={100} />);
    expect(lastProps().theme).toBe("dark");
  });

  it("lets an explicit theme prop win over the ambient theme", () => {
    render(
      <div data-meirlabs-theme="light">
        <LiveChart data={DATA} value={100} theme="dark" />
      </div>,
    );
    expect(lastProps().theme).toBe("dark");
  });

  it("passes concrete colors through untouched", () => {
    render(<LiveChart data={DATA} value={100} color="#8b949e" />);
    expect(lastProps().color).toBe("#8b949e");
  });

  it("resolves the default token color to a concrete value, never a var()", () => {
    render(<LiveChart data={DATA} value={100} />);
    const color = lastProps().color as string;
    expect(color.startsWith("var(")).toBe(false);
    expect(color.length).toBeGreaterThan(0);
  });

  it("resolves var() series colors to concrete values", () => {
    render(
      <LiveChart
        data={[]}
        value={0}
        series={[
          { id: "a", data: DATA, value: 100, color: "var(--ml-text)" },
          { id: "b", data: DATA, value: 90, color: "#656d76" },
        ]}
      />,
    );
    const series = lastProps().series as Array<{ color: string }>;
    expect(series[0].color.startsWith("var(")).toBe(false);
    expect(series[1].color).toBe("#656d76");
  });

  it("applies the height prop as the --ml-livechart-height variable", () => {
    const { container } = render(
      <LiveChart data={DATA} value={100} height={320} />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue("--ml-livechart-height")).toBe("320px");
  });
});
