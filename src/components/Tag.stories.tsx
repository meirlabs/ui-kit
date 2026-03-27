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

export const InChipRow: StoryObj = {
  render: () => (
    <ChipRow>
      <Tag>Design</Tag>
      <Tag>Engineering</Tag>
      <Tag>Marketing</Tag>
    </ChipRow>
  ),
};
