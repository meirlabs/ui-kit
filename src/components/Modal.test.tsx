import { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "./Modal";

function Harness({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        data-testid="trigger"
        onClick={() => setOpen(true)}
      >
        Open
      </button>
      <Modal
        open={open}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        title="My Dialog"
        description="Some description"
      >
        <button data-testid="first">First</button>
        <button data-testid="second">Second</button>
      </Modal>
    </>
  );
}

describe("Modal", () => {
  it("renders nothing while closed and a labelled dialog when open", () => {
    const { rerender } = render(<Modal open={false} onClose={() => {}} title="T" />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<Modal open onClose={() => {}} title="T" description="D" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("T");
    expect(dialog).toHaveAccessibleDescription("D");
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="T" />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on overlay click but not panel click", () => {
    const onClose = vi.fn();
    render(<Modal open onClose={onClose} title="T" />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
    // The overlay is the dialog's parent.
    fireEvent.click(screen.getByRole("dialog").parentElement as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("autofocuses the first focusable element on open", () => {
    render(
      <Modal open onClose={() => {}} title="T">
        <button data-testid="first">First</button>
      </Modal>,
    );
    // The header close button is the first focusable node.
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close" }));
  });

  it("traps Tab focus within the dialog", () => {
    render(
      <Modal open onClose={() => {}} title="T">
        <button data-testid="first">First</button>
        <button data-testid="second">Second</button>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    const focusables = Array.from(dialog.querySelectorAll("button"));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    last.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("returns focus to the trigger on close", async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const trigger = screen.getByTestId("trigger");
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it("locks body scroll while open and restores it on close", () => {
    const { rerender } = render(<Modal open onClose={() => {}} title="T" />);
    expect(document.body.style.overflow).toBe("hidden");
    rerender(<Modal open={false} onClose={() => {}} title="T" />);
    expect(document.body.style.overflow).toBe("");
  });

  it("renders footer content in the footer region", () => {
    render(
      <Modal open onClose={() => {}} title="T" footer={<button>Save</button>} />,
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});
