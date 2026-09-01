import type { Meta, StoryObj } from "@storybook/react";
import { StreamingText } from "./StreamingText";

const meta: Meta<typeof StreamingText> = {
  title: "Components/StreamingText",
  component: StreamingText,
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <StreamingText text="This response is streaming in one character at a time." />
  ),
};

export const Fast: StoryObj = {
  render: () => <StreamingText text="Streaming at 120 characters per second." speed={120} />,
};

export const NoCursor: StoryObj = {
  render: () => <StreamingText text="No blinking cursor while streaming." cursor={false} />,
};

export const OnComplete: StoryObj = {
  render: () => (
    <StreamingText
      text="Watch the console once this finishes streaming."
      onComplete={() => console.log("StreamingText: complete")}
    />
  ),
};
