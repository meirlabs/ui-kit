import { createRef } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tooltip } from "./Tooltip";

describe("Tooltip refs", () => {
  it("preserves the trigger ref without deprecated React element access", () => {
    const error = vi.spyOn(console, "error");
    const ref = createRef<HTMLButtonElement>();
    render(<Tooltip content="Daily reading" delay={0}><button ref={ref}>Day</button></Tooltip>);
    expect(ref.current).toBe(screen.getByRole("button", { name: "Day" }));
    fireEvent.focus(ref.current!);
    expect(screen.getByRole("tooltip")).toHaveTextContent("Daily reading");
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
