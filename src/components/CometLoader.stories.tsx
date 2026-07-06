import type { Meta, StoryObj } from "@storybook/react";
import { CometLoader } from "./CometLoader";

const meta: Meta<typeof CometLoader> = {
  title: "Components/CometLoader",
  component: CometLoader,
};
export default meta;

export const Default: StoryObj = {
  render: () => <CometLoader />,
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <CometLoader size="sm" />
      <CometLoader size="md" />
      <CometLoader size="lg" />
    </div>
  ),
};

export const InheritsColor: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <span style={{ color: "var(--ml-text)" }}>
        <CometLoader />
      </span>
      <span style={{ color: "var(--ml-text-faint)" }}>
        <CometLoader />
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
      <CometLoader label="Analyzing domain" />
      Analyzing domain…
    </div>
  ),
};
