import type { Meta, StoryObj } from "@storybook/react";
import { OrbitLoader } from "./OrbitLoader";

const meta: Meta<typeof OrbitLoader> = {
  title: "Components/OrbitLoader",
  component: OrbitLoader,
};
export default meta;

export const Default: StoryObj = {
  render: () => <OrbitLoader />,
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <OrbitLoader size="sm" />
      <OrbitLoader size="md" />
      <OrbitLoader size="lg" />
    </div>
  ),
};

export const InheritsColor: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <span style={{ color: "var(--ml-text)" }}>
        <OrbitLoader />
      </span>
      <span style={{ color: "var(--ml-text-faint)" }}>
        <OrbitLoader />
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
      <OrbitLoader label="Connecting to server" />
      Connecting…
    </div>
  ),
};
