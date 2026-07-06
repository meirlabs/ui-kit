import type { Meta, StoryObj } from "@storybook/react";
import { MetricValue } from "./MetricValue";

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
