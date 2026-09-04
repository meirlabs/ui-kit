import type { Meta, StoryObj } from "@storybook/react";
import { PulseLoader } from "./PulseLoader";

const meta: Meta<typeof PulseLoader> = {
  title: "Components/PulseLoader",
  component: PulseLoader,
};
export default meta;

export const Default: StoryObj = {
  render: () => <PulseLoader />,
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <PulseLoader size="sm" />
      <PulseLoader size="md" />
      <PulseLoader size="lg" />
    </div>
  ),
};

export const InheritsColor: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <span style={{ color: "var(--ml-text)" }}>
        <PulseLoader />
      </span>
      <span style={{ color: "var(--ml-text-faint)" }}>
        <PulseLoader />
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
      <PulseLoader label="Syncing changes" />
      Syncing…
    </div>
  ),
};
