import type { Meta, StoryObj } from "@storybook/react";
import { DotsLoader } from "./DotsLoader";

const meta: Meta<typeof DotsLoader> = {
  title: "Components/DotsLoader",
  component: DotsLoader,
};
export default meta;

export const Default: StoryObj = {
  render: () => <DotsLoader />,
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <DotsLoader size="sm" />
      <DotsLoader size="md" />
      <DotsLoader size="lg" />
    </div>
  ),
};

export const InheritsColor: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <span style={{ color: "var(--ml-text)" }}>
        <DotsLoader />
      </span>
      <span style={{ color: "var(--ml-text-faint)" }}>
        <DotsLoader />
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
      <DotsLoader label="Sending message" />
      Sending…
    </div>
  ),
};
