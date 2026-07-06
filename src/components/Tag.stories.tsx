import type { Meta, StoryObj } from "@storybook/react";
import { Tag } from "./Tag";
import { ChipRow } from "./ChipRow";

const meta: Meta<typeof Tag> = {
  title: "Components/Tag",
  component: Tag,
};
export default meta;

export const Default: StoryObj = {
  render: () => <Tag>Label</Tag>,
};

export const Tones: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Tag tone="neutral">Neutral</Tag>
      <Tag tone="success">Success</Tag>
      <Tag tone="warning">Warning</Tag>
      <Tag tone="danger">Danger</Tag>
    </div>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <Tag size="sm">Small</Tag>
      <Tag size="md">Medium</Tag>
    </div>
  ),
};

export const Removable: StoryObj = {
  render: () => (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Tag onRemove={() => {}}>Design</Tag>
      <Tag tone="success" onRemove={() => {}}>
        Engineering
      </Tag>
      <Tag tone="danger" onRemove={() => {}}>
        Blocked
      </Tag>
    </div>
  ),
};

export const InChipRow: StoryObj = {
  render: () => (
    <ChipRow>
      <Tag>Design</Tag>
      <Tag>Engineering</Tag>
      <Tag>Marketing</Tag>
    </ChipRow>
  ),
};
