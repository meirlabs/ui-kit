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

export const Danger: StoryObj = {
  render: () => <StatusPill tone="danger">Failed</StatusPill>,
};

export const Neutral: StoryObj = {
  render: () => <StatusPill tone="neutral">Draft</StatusPill>,
};

export const WithDot: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <StatusPill tone="good" dot>
        Online
      </StatusPill>
      <StatusPill tone="warn" dot>
        Degraded
      </StatusPill>
      <StatusPill tone="danger" dot>
        Offline
      </StatusPill>
      <StatusPill tone="neutral" dot>
        Idle
      </StatusPill>
    </div>
  ),
};

export const LivePulse: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {/* pulse is strictly opt-in — no dot breathes unless pulse is passed */}
      <StatusPill tone="good" dot>
        Online (no pulse)
      </StatusPill>
      {/* opt in on any tone */}
      <StatusPill tone="good" dot pulse>
        Online
      </StatusPill>
      <StatusPill tone="danger" dot pulse>
        Critical
      </StatusPill>
    </div>
  ),
};

export const AllTones: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <StatusPill tone="good">Active</StatusPill>
      <StatusPill tone="warn">Pending</StatusPill>
      <StatusPill tone="danger">Failed</StatusPill>
      <StatusPill tone="neutral">Draft</StatusPill>
    </div>
  ),
};
