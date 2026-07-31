import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Composer } from "./Composer";

describe("Composer", () => {
  it("renders a textarea and a Send icon button", () => {
    render(<Composer value="" onChange={() => {}} onSend={() => {}} placeholder="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  it("disables the send button while the draft is empty", () => {
    render(<Composer value="" onChange={() => {}} onSend={() => {}} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("enables the send button once there is non-whitespace text", () => {
    render(<Composer value="hi" onChange={() => {}} onSend={() => {}} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });

  it("keeps the send button disabled for whitespace-only text", () => {
    render(<Composer value="   " onChange={() => {}} onSend={() => {}} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("calls onChange as the user types", () => {
    const onChange = vi.fn();
    render(<Composer value="" onChange={onChange} onSend={() => {}} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "hello" } });
    expect(onChange).toHaveBeenCalledWith("hello");
  });

  it("sends on Enter and prevents the default newline", () => {
    const onSend = vi.fn();
    render(<Composer value="hello" onChange={() => {}} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSend).toHaveBeenCalledWith("hello");
  });

  it("does not send on Shift+Enter (newline instead)", () => {
    const onSend = vi.fn();
    render(<Composer value="hello" onChange={() => {}} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter", shiftKey: true });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send on Enter while IME-composing", () => {
    const onSend = vi.fn();
    render(<Composer value="hello" onChange={() => {}} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
      isComposing: true,
    });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("does not send on Enter when the draft is empty", () => {
    const onSend = vi.fn();
    render(<Composer value="" onChange={() => {}} onSend={onSend} />);
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("sends when the send button is clicked", () => {
    const onSend = vi.fn();
    render(<Composer value="hello" onChange={() => {}} onSend={onSend} />);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onSend).toHaveBeenCalledWith("hello");
  });

  it("disables both the field and the send button while disabled", () => {
    render(<Composer value="hello" onChange={() => {}} onSend={() => {}} disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("shows a busy send button while loading and blocks Enter-to-send", () => {
    const onSend = vi.fn();
    render(<Composer value="hello" onChange={() => {}} onSend={onSend} loading />);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("aria-busy", "true");
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });
    expect(onSend).not.toHaveBeenCalled();
  });

  it("never leaves the native resize handle on (autoResize forces resize:none)", () => {
    render(<Composer value="" onChange={() => {}} onSend={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveClass("ml-textarea--autoresize");
  });

  it("flips to dir=rtl on the wrapper when requested", () => {
    render(<Composer value="" onChange={() => {}} onSend={() => {}} dir="rtl" />);
    // The wrapper is the textbox's grandparent-ish ancestor carrying `dir`.
    const wrapper = screen.getByRole("textbox").closest("[dir]");
    expect(wrapper).toHaveAttribute("dir", "rtl");
  });

  it("uses a custom sendLabel for the button's accessible name", () => {
    render(<Composer value="hi" onChange={() => {}} onSend={() => {}} sendLabel="Post" />);
    expect(screen.getByRole("button", { name: "Post" })).toBeInTheDocument();
  });
});
