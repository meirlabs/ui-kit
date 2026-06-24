import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SegmentedControl } from "./SegmentedControl";

const options = [
  { label: "Terms", value: "terms", count: 42 },
  { label: "Diplomas", value: "diplomas", count: 0 },
];

describe("SegmentedControl", () => {
  it("renders a tablist with one tab per option", () => {
    render(
      <SegmentedControl
        aria-label="View"
        value="terms"
        onChange={() => {}}
        options={options}
      />,
    );
    expect(screen.getByRole("tablist", { name: "View" })).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("marks the active option as selected", () => {
    render(
      <SegmentedControl
        aria-label="View"
        value="diplomas"
        onChange={() => {}}
        options={options}
      />,
    );
    expect(screen.getByRole("tab", { name: /Diplomas/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /Terms/ })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("shows a count only when greater than zero", () => {
    render(
      <SegmentedControl
        aria-label="View"
        value="terms"
        onChange={() => {}}
        options={options}
      />,
    );
    expect(screen.getByText(/· 42/)).toBeInTheDocument();
    expect(screen.queryByText(/· 0/)).not.toBeInTheDocument();
  });

  it("calls onChange with the clicked value", () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="View"
        value="terms"
        onChange={onChange}
        options={options}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: /Diplomas/ }));
    expect(onChange).toHaveBeenCalledWith("diplomas");
  });
});
