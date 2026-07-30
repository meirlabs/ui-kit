import type { Meta, StoryObj } from "@storybook/react";
import { PulseRingLoader } from "./PulseRingLoader";

const meta: Meta<typeof PulseRingLoader> = {
  title: "Components/PulseRingLoader",
  component: PulseRingLoader,
};
export default meta;

export const Default: StoryObj = {
  render: () => <PulseRingLoader />,
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <PulseRingLoader size="sm" />
      <PulseRingLoader size="md" />
      <PulseRingLoader size="lg" />
    </div>
  ),
};

export const InheritsColor: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <span style={{ color: "var(--ml-text)" }}>
        <PulseRingLoader />
      </span>
      <span style={{ color: "var(--ml-color-success)" }}>
        <PulseRingLoader label="Connected" />
      </span>
    </div>
  ),
};

export const WithLabelText: StoryObj = {
  render: () => (
    <div
      style={{
        display: "inline-flex",
        gap: "8px",
        alignItems: "center",
        color: "var(--ml-text-muted)",
        font: "500 0.88rem var(--ml-font-sans)",
      }}
    >
      <PulseRingLoader label="Connecting" />
      Connecting…
    </div>
  ),
};
