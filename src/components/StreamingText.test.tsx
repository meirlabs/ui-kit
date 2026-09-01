import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StreamingText } from "./StreamingText";

function mockMatchMedia(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

beforeEach(() => {
  mockMatchMedia(false);
});

afterEach(() => {
  // @ts-expect-error jsdom has no native matchMedia; drop the stub
  delete window.matchMedia;
});

describe("StreamingText", () => {
  it("exposes the full text immediately to assistive tech via a status region", () => {
    render(<StreamingText text="Hello world" />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Hello world");
    expect(status).toHaveClass("ml-visually-hidden");
  });

  it("reveals the visible text progressively and calls onComplete once done", async () => {
    const onComplete = vi.fn();
    const { container } = render(
      <StreamingText text="Hi" speed={1000} onComplete={onComplete} />,
    );
    const visible = container.querySelector(
      ".ml-streamingtext > span[aria-hidden='true']",
    )!;
    await waitFor(() => expect(visible.textContent).toContain("Hi"));
    await waitFor(() => expect(onComplete).toHaveBeenCalledTimes(1));
  });

  it("shows the cursor while streaming and hides it once complete", async () => {
    const { container } = render(<StreamingText text="Hi" speed={1000} />);
    await waitFor(() =>
      expect(container.querySelector(".ml-streamingtext-cursor")).toBeNull(),
    );
  });

  it("never renders a cursor when cursor is false", () => {
    const { container } = render(<StreamingText text="Hi" cursor={false} />);
    expect(container.querySelector(".ml-streamingtext-cursor")).toBeNull();
  });

  it("under prefers-reduced-motion renders the full text instantly with no cursor", () => {
    mockMatchMedia(true);
    const onComplete = vi.fn();
    const { container } = render(
      <StreamingText text="Instant" onComplete={onComplete} />,
    );
    const visible = container.querySelector(
      ".ml-streamingtext > span[aria-hidden='true']",
    )!;
    expect(visible.textContent).toBe("Instant");
    expect(container.querySelector(".ml-streamingtext-cursor")).toBeNull();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete immediately for an empty string", () => {
    const onComplete = vi.fn();
    render(<StreamingText text="" onComplete={onComplete} />);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("merges a custom className onto the root", () => {
    const { container } = render(<StreamingText text="Hi" className="extra" />);
    expect(container.querySelector(".ml-streamingtext")).toHaveClass("extra");
  });
});
