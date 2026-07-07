import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { useState } from "react";
import { OtpInput } from "./OtpInput";

beforeAll(() => {
  // input-otp observes the hidden input's size and probes for password-manager
  // badges; jsdom implements neither API.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  if (typeof document.elementFromPoint !== "function") {
    document.elementFromPoint = () => null;
  }
});

afterEach(async () => {
  // input-otp schedules trailing 0/10/50ms timeouts (selection mirroring);
  // drain them before teardown so nothing fires after the env is gone.
  await new Promise((resolve) => setTimeout(resolve, 60));
});

function getSlots(container: HTMLElement) {
  return container.querySelectorAll(".ml-otp-slot");
}

describe("OtpInput", () => {
  it("renders `length` slots and typing fills them in order", () => {
    const { container } = render(<OtpInput aria-label="Verification code" />);
    const input = screen.getByLabelText(
      "Verification code",
    ) as HTMLInputElement;

    const slots = getSlots(container);
    expect(slots).toHaveLength(6);

    fireEvent.change(input, { target: { value: "12" } });
    expect(slots[0]).toHaveTextContent("1");
    expect(slots[1]).toHaveTextContent("2");
    expect(slots[2]).toHaveTextContent("");
  });

  it("respects a custom length", () => {
    const { container } = render(<OtpInput aria-label="code" length={4} />);
    expect(getSlots(container)).toHaveLength(4);
  });

  it("works controlled via value + onChange", () => {
    function Controlled() {
      const [v, setV] = useState("");
      return <OtpInput aria-label="code" value={v} onChange={setV} />;
    }
    const { container } = render(<Controlled />);
    const input = screen.getByLabelText("code") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "987" } });
    expect(input.value).toBe("987");
    expect(getSlots(container)[0]).toHaveTextContent("9");
  });

  it("fires onComplete once the code reaches length", () => {
    const onComplete = vi.fn();
    render(<OtpInput aria-label="code" onComplete={onComplete} />);
    const input = screen.getByLabelText("code") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "123" } });
    expect(onComplete).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "123456" } });
    expect(onComplete).toHaveBeenCalledWith("123456");
  });

  it("rejects non-digit characters by default", () => {
    const onChange = vi.fn();
    render(<OtpInput aria-label="code" onChange={onChange} />);
    const input = screen.getByLabelText("code") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "ab" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables the hidden input and marks the wrapper", () => {
    render(<OtpInput aria-label="code" disabled />);
    const input = screen.getByLabelText("code") as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input.closest(".ml-otp")).toHaveClass("ml-otp--disabled");
  });

  it("reflects invalid as the error class and aria-invalid", () => {
    render(<OtpInput aria-label="code" invalid />);
    const input = screen.getByLabelText("code");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.closest(".ml-otp")).toHaveClass("ml-otp--invalid");
  });

  it("omits the error class and aria-invalid when valid", () => {
    render(<OtpInput aria-label="code" />);
    const input = screen.getByLabelText("code");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input.closest(".ml-otp")).not.toHaveClass("ml-otp--invalid");
  });

  it("hardcodes dir=ltr on the container", () => {
    render(<OtpInput aria-label="code" />);
    const wrapper = screen.getByLabelText("code").closest(".ml-otp");
    expect(wrapper).toHaveAttribute("dir", "ltr");
  });

  it("defaults to one-time-code autocomplete and numeric inputMode", () => {
    render(<OtpInput aria-label="code" />);
    const input = screen.getByLabelText("code");
    expect(input).toHaveAttribute("autocomplete", "one-time-code");
    expect(input).toHaveAttribute("inputmode", "numeric");
  });

  it("renders groups with a separator between them", () => {
    const { container } = render(
      <OtpInput aria-label="code" groups={[3, 3]} />,
    );
    expect(container.querySelectorAll(".ml-otp-group")).toHaveLength(2);
    expect(container.querySelectorAll(".ml-otp-separator")).toHaveLength(1);
    expect(getSlots(container)).toHaveLength(6);
  });

  it("ignores groups that don't sum to length", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { container } = render(
      <OtpInput aria-label="code" groups={[2, 2]} />,
    );
    expect(container.querySelectorAll(".ml-otp-group")).toHaveLength(1);
    expect(getSlots(container)).toHaveLength(6);
    warn.mockRestore();
  });

  it("forwards the ref to the underlying input", () => {
    let node: HTMLInputElement | null = null;
    render(<OtpInput aria-label="code" ref={(n) => (node = n)} />);
    expect(node).toBeInstanceOf(HTMLInputElement);
  });
});
