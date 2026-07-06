import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tag } from "./Tag";

describe("Tag", () => {
  it("defaults to the neutral (gray) tone", () => {
    render(<Tag data-testid="tag">Design</Tag>);
    expect(screen.getByTestId("tag")).toHaveClass("ml-tag-neutral");
  });

  it("applies functional tones", () => {
    render(
      <Tag tone="danger" data-testid="tag">
        Blocked
      </Tag>,
    );
    expect(screen.getByTestId("tag")).toHaveClass("ml-tag-danger");
  });

  it("does not render a remove button without onRemove", () => {
    render(<Tag>Design</Tag>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a remove button with an accessible name derived from the label", () => {
    render(<Tag onRemove={() => {}}>Design</Tag>);
    expect(screen.getByRole("button", { name: "Remove Design" })).toBeInTheDocument();
  });

  it("honors a custom removeLabel", () => {
    render(
      <Tag onRemove={() => {}} removeLabel="Dismiss filter">
        Design
      </Tag>,
    );
    expect(screen.getByRole("button", { name: "Dismiss filter" })).toBeInTheDocument();
  });

  it("calls onRemove when the remove button is clicked", () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Design</Tag>);
    fireEvent.click(screen.getByRole("button", { name: "Remove Design" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("applies the sm size class", () => {
    render(
      <Tag size="sm" data-testid="tag">
        Design
      </Tag>,
    );
    expect(screen.getByTestId("tag")).toHaveClass("ml-tag-sm");
  });

  it("forwards the ref", () => {
    let node: HTMLSpanElement | null = null;
    render(<Tag ref={(el) => (node = el)}>Design</Tag>);
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });
});
