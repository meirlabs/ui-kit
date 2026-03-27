import type { Meta, StoryObj } from "@storybook/react";
import { StatusPill } from "./StatusPill";

const meta: Meta<typeof StatusPill> = {
  title: "Components/StatusPill",
  component: StatusPill,
};
export default meta;

export const Good: StoryObj = {
  render: () => <StatusPill tone="good">Active</StatusPill>,
};

export const Warn: StoryObj = {
  render: () => <StatusPill tone="warn">Pending</StatusPill>,
};

export const Neutral: StoryObj = {
  render: () => <StatusPill tone="neutral">Draft</StatusPill>,
};

export const AllTones: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <StatusPill tone="good">Active</StatusPill>
      <StatusPill tone="warn">Pending</StatusPill>
      <StatusPill tone="neutral">Draft</StatusPill>
    </div>
  ),
};
