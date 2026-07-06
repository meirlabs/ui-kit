import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

function getInput(): HTMLInputElement {
  return screen.getByRole("checkbox") as HTMLInputElement;
}

describe("Checkbox", () => {
  it("renders a real checkbox with an associated label", () => {
    render(<Checkbox label="Accept terms" />);
    const input = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("sets input.indeterminate from the prop", () => {
    const { rerender } = render(<Checkbox label="Some" indeterminate />);
    expect(getInput().indeterminate).toBe(true);
    rerender(<Checkbox label="Some" indeterminate={false} />);
    expect(getInput().indeterminate).toBe(false);
  });

  it("works uncontrolled via defaultChecked", () => {
    render(<Checkbox label="Remember me" defaultChecked />);
    const input = getInput();
    expect(input.checked).toBe(true);
    fireEvent.click(input);
    expect(input.checked).toBe(false);
  });

  it("works controlled via checked + onChange", () => {
    function Controlled() {
      const [on, setOn] = useState(false);
      return (
        <Checkbox
          label="Subscribe"
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
        />
      );
    }
    render(<Controlled />);
    const input = getInput();
    expect(input.checked).toBe(false);
    fireEvent.click(input);
    expect(input.checked).toBe(true);
  });

  it("does not toggle a controlled checkbox without onChange updating state", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Locked" checked={false} onChange={onChange} />);
    const input = getInput();
    fireEvent.click(input);
    expect(onChange).toHaveBeenCalled();
    expect(input.checked).toBe(false);
  });

  it("forwards disabled to the input", () => {
    render(<Checkbox label="Off" disabled />);
    expect(getInput()).toBeDisabled();
  });

  it("renders a description", () => {
    render(<Checkbox label="Marketing" description="Weekly product news" />);
    expect(screen.getByText("Weekly product news")).toHaveClass(
      "ml-checkbox-description",
    );
  });
});
