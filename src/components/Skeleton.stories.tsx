import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton, SkeletonText } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
};
export default meta;

export const Text: StoryObj = {
  render: () => <Skeleton variant="text" width={160} />,
};

export const Rect: StoryObj = {
  render: () => <Skeleton variant="rect" width={120} height={40} />,
};

export const Circle: StoryObj = {
  render: () => <Skeleton variant="circle" width={40} height={40} />,
};

export const Variants: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <Skeleton variant="circle" width={40} height={40} />
      <Skeleton variant="rect" width={120} height={40} />
      <Skeleton variant="text" width={160} />
    </div>
  ),
};

export const TextBlock: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <SkeletonText lines={4} />
    </div>
  ),
};

export const CardPlaceholder: StoryObj = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: 24,
        border: "1px solid var(--ml-border)",
        borderRadius: "var(--ml-radius-lg)",
        background: "var(--ml-bg-card)",
        maxWidth: 320,
      }}
    >
      <Skeleton variant="circle" width={48} height={48} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <Skeleton variant="text" width="40%" height={16} />
        <Skeleton variant="text" width="70%" height={14} />
      </div>
    </div>
  ),
};
