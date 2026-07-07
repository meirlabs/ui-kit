import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { OtpInput } from "./OtpInput";

const meta: Meta<typeof OtpInput> = {
  title: "Components/OtpInput",
  component: OtpInput,
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const [code, setCode] = useState("");
    return (
      <OtpInput
        aria-label="Verification code"
        value={code}
        onChange={setCode}
        onComplete={(value) => console.log("complete:", value)}
      />
    );
  },
};

/** 3 + 3 with a dash separator — the common SMS-code layout. */
export const Grouped: StoryObj = {
  render: () => {
    const [code, setCode] = useState("");
    return (
      <OtpInput
        aria-label="Verification code"
        groups={[3, 3]}
        value={code}
        onChange={setCode}
      />
    );
  },
};

/** Danger borders + ring, mirrored as `aria-invalid` on the hidden input. */
export const ErrorState: StoryObj = {
  render: () => {
    const [code, setCode] = useState("123456");
    return (
      <OtpInput
        aria-label="Verification code"
        invalid
        value={code}
        onChange={setCode}
      />
    );
  },
};

export const Disabled: StoryObj = {
  render: () => (
    <OtpInput aria-label="Verification code" disabled defaultValue="42" />
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "grid", gap: 16, justifyItems: "start" }}>
      <OtpInput aria-label="Small code" size="sm" length={4} />
      <OtpInput aria-label="Medium code" size="md" length={4} />
      <OtpInput aria-label="Large code" size="lg" length={4} />
    </div>
  ),
};
