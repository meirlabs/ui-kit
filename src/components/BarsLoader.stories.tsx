import type { Meta, StoryObj } from "@storybook/react";
import { BarsLoader } from "./BarsLoader";

const meta: Meta<typeof BarsLoader> = {
  title: "Components/BarsLoader",
  component: BarsLoader,
};
export default meta;

export const Default: StoryObj = {
  render: () => <BarsLoader />,
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <BarsLoader size="sm" />
      <BarsLoader size="md" />
      <BarsLoader size="lg" />
    </div>
  ),
};

export const InheritsColor: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <span style={{ color: "var(--ml-text)" }}>
        <BarsLoader />
      </span>
      <span style={{ color: "var(--ml-text-faint)" }}>
        <BarsLoader />
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
      <BarsLoader label="Uploading file" />
      Uploading…
    </div>
  ),
};
