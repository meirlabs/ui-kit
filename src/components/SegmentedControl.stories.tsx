import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof SegmentedControl> = {
  title: "Navigation/SegmentedControl",
  component: SegmentedControl,
};
export default meta;

export const TwoViews: StoryObj = {
  render: () => {
    const [view, setView] = useState("learned");
    return (
      <SegmentedControl
        aria-label="Wisdom view"
        value={view}
        onChange={setView}
        options={[
          { label: "Terms learned", value: "learned", count: 42 },
          { label: "Diplomas", value: "diplomas", count: 3 },
        ]}
      />
    );
  },
};

export const ThreeViews: StoryObj = {
  render: () => {
    const [view, setView] = useState("week");
    return (
      <SegmentedControl
        aria-label="Time range"
        value={view}
        onChange={setView}
        options={[
          { label: "Week", value: "week" },
          { label: "Month", value: "month" },
          { label: "Year", value: "year" },
        ]}
      />
    );
  },
};

/**
 * Keyboard: focus a tab (Tab reaches only the selected one — roving tabindex),
 * then ArrowLeft/ArrowRight move focus **and** selection (wrapping), and
 * Home/End jump to the ends. Focus shows a 2px ring.
 */
export const KeyboardAndFocus: StoryObj = {
  render: () => {
    const [view, setView] = useState("month");
    return (
      <SegmentedControl
        aria-label="Time range"
        value={view}
        onChange={setView}
        options={[
          { label: "Week", value: "week" },
          { label: "Month", value: "month" },
          { label: "Year", value: "year" },
        ]}
      />
    );
  },
};
