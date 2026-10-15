import type { Meta, StoryObj } from "@storybook/react";
import { DeleteButton } from "./DeleteButton";

const meta: Meta<typeof DeleteButton> = {
  title: "Components/DeleteButton",
  component: DeleteButton,
};
export default meta;

export const Default: StoryObj = {
  render: () => (
    <DeleteButton onDelete={() => new Promise((r) => setTimeout(r, 1200))} />
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <DeleteButton size="sm" onDelete={() => new Promise((r) => setTimeout(r, 1200))} />
      <DeleteButton size="md" onDelete={() => new Promise((r) => setTimeout(r, 1200))} />
      <DeleteButton size="lg" onDelete={() => new Promise((r) => setTimeout(r, 1200))} />
    </div>
  ),
};

export const CustomLabels: StoryObj = {
  render: () => (
    <DeleteButton
      label="Remove member"
      confirmLabel="Really remove?"
      loadingLabel="Removing…"
      doneLabel="Removed"
      onDelete={() => new Promise((r) => setTimeout(r, 1200))}
    />
  ),
};

export const FailureReverts: StoryObj = {
  render: () => (
    <DeleteButton
      onDelete={() =>
        new Promise((_resolve, reject) => setTimeout(() => reject(new Error("failed")), 1200))
      }
    />
  ),
};
