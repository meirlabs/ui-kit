import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "./Button";
import { MetricGroup, MetricValue } from "./MetricValue";

const meta: Meta<typeof MetricValue> = {
  title: "Components/MetricValue",
  component: MetricValue,
};
export default meta;

const money = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(v);

export const Positive: StoryObj = {
  render: () => <MetricValue value={1234.56} formatter={money} />,
};

export const Negative: StoryObj = {
  render: () => <MetricValue value={-567.89} formatter={money} />,
};

export const Zero: StoryObj = {
  render: () => <MetricValue value={0} formatter={money} />,
};

export const WithDelta: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <MetricValue value={12500} formatter={money} delta={8.2} deltaFormatter={(v) => `${v}%`} />
      <MetricValue value={9800} formatter={money} delta={-3.4} deltaFormatter={(v) => `${v}%`} />
    </div>
  ),
};

/**
 * Opt-in `animated` variant: digits roll into place via NumberFlow. The
 * animated path takes `format` (Intl.NumberFormatOptions) plus `prefix`/
 * `suffix` instead of a `formatter` function. Respects
 * `prefers-reduced-motion` automatically.
 */
export const Animated: StoryObj = {
  render: () => {
    const [value, setValue] = useState(12500.5);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
        <MetricValue
          animated
          value={value}
          format={{ style: "currency", currency: "USD" }}
          style={{ fontSize: "2rem", fontWeight: 600 }}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setValue(Math.round(Math.random() * 2_000_000) / 100)}
        >
          Randomize
        </Button>
      </div>
    );
  },
};

/**
 * Wrap several animated metrics in `MetricGroup` (re-exported
 * NumberFlowGroup) so their transitions run in sync.
 */
export const AnimatedGroup: StoryObj = {
  render: () => {
    const [revenue, setRevenue] = useState(48200);
    const [conversion, setConversion] = useState(0.031);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
        <MetricGroup>
          <div style={{ display: "flex", gap: "2rem", fontSize: "1.5rem", fontWeight: 600 }}>
            <MetricValue
              animated
              value={revenue}
              format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
            />
            <MetricValue
              animated
              value={conversion}
              format={{ style: "percent", maximumFractionDigits: 1 }}
              suffix=" CVR"
            />
          </div>
        </MetricGroup>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setRevenue(Math.round(Math.random() * 100_000));
            setConversion(Math.random() * 0.08);
          }}
        >
          Randomize both
        </Button>
      </div>
    );
  },
};

/** On RTL (Hebrew) pages the animated number itself stays LTR. */
export const AnimatedRtl: StoryObj = {
  render: () => {
    const [value, setValue] = useState(8432.75);
    return (
      <div dir="rtl" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-start" }}>
        <span style={{ fontSize: "1.25rem" }}>
          {"הכנסה חודשית: "}
          <MetricValue
            animated
            value={value}
            format={{ style: "currency", currency: "ILS" }}
            style={{ fontWeight: 600 }}
          />
        </span>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setValue(Math.round(Math.random() * 2_000_000) / 100)}
        >
          ערבוב
        </Button>
      </div>
    );
  },
};
