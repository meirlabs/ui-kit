import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a native textarea and forwards value/placeholder", () => {
    render(<Textarea value="hi" onChange={() => {}} placeholder="Say something" />);
    const el = screen.getByPlaceholderText("Say something") as HTMLTextAreaElement;
    expect(el.tagName).toBe("TEXTAREA");
    expect(el.value).toBe("hi");
  });

  it("does not add the autoresize class by default", () => {
    render(<Textarea value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveClass("ml-textarea--autoresize");
  });

  it("adds the autoresize class (resize:none) when autoResize is set", () => {
    render(<Textarea autoResize value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveClass("ml-textarea--autoresize");
  });

  it("uses minRows (falling back to rows, then 3) as the initial rows attribute", () => {
    render(<Textarea autoResize minRows={2} maxRows={6} value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "2");
  });

  it("marks invalid state via aria-invalid and the invalid class", () => {
    render(<Textarea invalid value="" onChange={() => {}} />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el).toHaveClass("ml-textarea--invalid");
  });

  it("disables the field and forces resize:none via the disabled class", () => {
    render(<Textarea disabled value="" onChange={() => {}} />);
    const el = screen.getByRole("textbox");
    expect(el).toBeDisabled();
    expect(el).toHaveClass("ml-textarea--disabled");
  });
});
