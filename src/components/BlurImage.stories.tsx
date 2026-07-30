import type { Meta, StoryObj } from "@storybook/react";
import { BlurImage } from "./BlurImage";

const meta: Meta<typeof BlurImage> = {
  title: "Components/BlurImage",
  component: BlurImage,
};
export default meta;

export const FixedSize: StoryObj = {
  render: () => (
    <BlurImage
      src="https://picsum.photos/seed/ml-blur-1/480/320"
      alt="Random landscape photo"
      width={480}
      height={320}
    />
  ),
};

export const FluidAspectRatio: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <BlurImage
        src="https://picsum.photos/seed/ml-blur-2/960/540"
        alt="Random landscape photo, fluid width"
        aspectRatio="16 / 9"
      />
    </div>
  ),
};

export const SlowNetwork: StoryObj = {
  render: () => (
    <BlurImage
      // httpbin's /delay endpoint simulates a slow origin.
      src="https://picsum.photos/seed/ml-blur-3/480/320?delay=1500"
      alt="Simulated slow-loading photo"
      width={480}
      height={320}
    />
  ),
};

export const BrokenSourceWithFallback: StoryObj = {
  render: () => (
    <BlurImage
      src="/this-image-does-not-exist.jpg"
      alt="Broken image"
      width={480}
      height={320}
      fallback={<span>Image unavailable</span>}
    />
  ),
};
