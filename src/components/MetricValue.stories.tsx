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
