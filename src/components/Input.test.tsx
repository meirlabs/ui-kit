import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { Input } from "./Input";

describe("Input", () => {
  it("works uncontrolled via defaultValue", () => {
    render(<Input defaultValue="hello" aria-label="name" />);
    const input = screen.getByLabelText("name") as HTMLInputElement;
    expect(input.value).toBe("hello");
    fireEvent.change(input, { target: { value: "world" } });
    expect(input.value).toBe("world");
  });

  it("works controlled via value + onChange", () => {
    function Controlled() {
      const [v, setV] = useState("a");
      return (
        <Input
          aria-label="name"
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      );
    }
    render(<Controlled />);
    const input = screen.getByLabelText("name") as HTMLInputElement;
    expect(input.value).toBe("a");
    fireEvent.change(input, { target: { value: "ab" } });
    expect(input.value).toBe("ab");
  });

  it("does not update a controlled value without onChange wiring", () => {
    const onChange = vi.fn();
    render(<Input aria-label="name" value="fixed" onChange={onChange} />);
    const input = screen.getByLabelText("name") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "nope" } });
    expect(onChange).toHaveBeenCalled();
    expect(input.value).toBe("fixed");
  });

  it("reflects invalid as aria-invalid", () => {
    render(<Input aria-label="email" invalid />);
    expect(screen.getByLabelText("email")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("omits aria-invalid when valid", () => {
    render(<Input aria-label="email" />);
    expect(screen.getByLabelText("email")).not.toHaveAttribute("aria-invalid");
  });

  it("renders left/right icon slots inside the shell", () => {
    render(
      <Input
        aria-label="search"
        leftIcon={<span data-testid="lead">L</span>}
        rightIcon={<span data-testid="trail">R</span>}
      />,
    );
    const lead = screen.getByTestId("lead");
    const trail = screen.getByTestId("trail");
    // icons live in dedicated 20px slots that create the input's inline padding
    expect(lead.closest(".ml-input-icon--left")).not.toBeNull();
    expect(trail.closest(".ml-input-icon--right")).not.toBeNull();
    // the shell (which owns the padding + focus ring) contains both slots
    const shell = lead.closest(".ml-input");
    expect(shell).not.toBeNull();
    expect(shell).toContainElement(trail);
  });

  it("forwards the ref to the underlying input", () => {
    let node: HTMLInputElement | null = null;
    render(<Input aria-label="ref" ref={(n) => (node = n)} />);
    expect(node).toBeInstanceOf(HTMLInputElement);
  });

  it("supports size + prefix/suffix adornments", () => {
    render(<Input aria-label="url" size="lg" prefix="https://" suffix=".com" />);
    expect(screen.getByText("https://")).toHaveClass("ml-input-affix--prefix");
    expect(screen.getByText(".com")).toHaveClass("ml-input-affix--suffix");
    expect(
      screen.getByLabelText("url").closest(".ml-input"),
    ).toHaveClass("ml-input--lg");
  });
});
