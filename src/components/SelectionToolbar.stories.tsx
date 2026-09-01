import { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SelectionToolbar } from "./SelectionToolbar";

const meta: Meta<typeof SelectionToolbar> = {
  title: "Components/SelectionToolbar",
  component: SelectionToolbar,
};
export default meta;

function BasicDemo() {
  const containerRef = useRef<HTMLParagraphElement>(null);
  return (
    <div style={{ maxWidth: 480 }}>
      <p ref={containerRef} style={{ color: "var(--ml-text)", lineHeight: 1.6 }}>
        Select any part of this paragraph to see a floating toolbar with
        Explain, Shorten, and Improve actions appear above the selection.
      </p>
      <SelectionToolbar
        containerRef={containerRef}
        aria-label="Text selection actions"
        actions={[
          { id: "explain", label: "Explain", onSelect: (text) => console.log("Explain:", text) },
          { id: "shorten", label: "Shorten", onSelect: (text) => console.log("Shorten:", text) },
          { id: "improve", label: "Improve", onSelect: (text) => console.log("Improve:", text) },
        ]}
      />
    </div>
  );
}

export const Default: StoryObj = {
  render: () => <BasicDemo />,
};
