import type { Meta, StoryObj } from "@storybook/react";
import { Toaster, toast } from "./Toast";
import { Button } from "./Button";

const meta: Meta<typeof Toaster> = {
  title: "Components/Toast",
  component: Toaster,
};
export default meta;

const row: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
};

export const Tones: StoryObj = {
  render: () => (
    <>
      <Toaster />
      <div style={row}>
        <Button
          variant="secondary"
          onClick={() =>
            toast("Changes saved", { description: "Everything is up to date." })
          }
        >
          Neutral
        </Button>
        <Button variant="secondary" onClick={() => toast.success("Deployed to production")}>
          Success
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast.warning("Approaching plan limit", {
              description: "You have used 90% of this month's quota.",
            })
          }
        >
          Warning
        </Button>
        <Button variant="secondary" onClick={() => toast.error("Delete failed")}>
          Danger
        </Button>
        <Button variant="secondary" onClick={() => toast.info("A new version is available")}>
          Info (neutral)
        </Button>
      </div>
    </>
  ),
};

export const WithAction: StoryObj = {
  render: () => (
    <>
      <Toaster />
      <div style={row}>
        <Button
          variant="secondary"
          onClick={() =>
            toast("Item deleted", {
              action: { label: "Undo", onClick: () => toast("Restored") },
            })
          }
        >
          Action
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast("Send this report?", {
              duration: 10000,
              action: { label: "Send", onClick: () => toast.success("Sent") },
              cancel: { label: "Dismiss", onClick: () => {} },
            })
          }
        >
          Action + cancel
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast("Kept until dismissed", { duration: Infinity, closeButton: true })}
        >
          Sticky + close button
        </Button>
      </div>
    </>
  ),
};

export const Async: StoryObj = {
  render: () => (
    <>
      <Toaster />
      <Button
        variant="secondary"
        onClick={() =>
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
              loading: "Saving report…",
              success: "Report saved",
              error: "Could not save",
            },
          )
        }
      >
        Run async task
      </Button>
    </>
  ),
};

export const TopCenter: StoryObj = {
  render: () => (
    <>
      <Toaster placement="top-center" />
      <Button variant="secondary" onClick={() => toast("Announced from the top")}>
        Show toast
      </Button>
    </>
  ),
};

export const RTL: StoryObj = {
  render: () => (
    <div dir="rtl">
      <Toaster dir="rtl" placement="bottom-left" />
      <Button
        variant="secondary"
        onClick={() =>
          toast.success("השינויים נשמרו", { description: "הדוח עודכן בהצלחה." })
        }
      >
        הצג הודעה
      </Button>
    </div>
  ),
};
