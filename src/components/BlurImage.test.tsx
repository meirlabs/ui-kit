import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BlurImage } from "./BlurImage";

describe("BlurImage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts unloaded and marks itself loaded on the real load event", () => {
    const { container } = render(<BlurImage src="/photo.jpg" alt="A photo" />);
    const root = container.querySelector(".ml-blur-image")!;
    const img = container.querySelector("img")!;
    expect(root).not.toHaveClass("ml-blur-image-loaded");

    fireEvent.load(img);
    expect(root).toHaveClass("ml-blur-image-loaded");
  });

  it("resolves to the loaded end state on error instead of staying blurred, and shows the fallback", () => {
    const { container } = render(
      <BlurImage src="/broken.jpg" alt="Broken" fallback={<span>Unavailable</span>} />,
    );
    const root = container.querySelector(".ml-blur-image")!;
    const img = container.querySelector("img")!;

    fireEvent.error(img);
    expect(root).toHaveClass("ml-blur-image-error");
    expect(root).not.toHaveClass("ml-blur-image-loaded");
    expect(screen.getByText("Unavailable")).toBeInTheDocument();
  });

  it("does not render a fallback node when the image loads successfully", () => {
    render(<BlurImage src="/photo.jpg" alt="A photo" fallback={<span>Unavailable</span>} />);
    expect(screen.queryByText("Unavailable")).not.toBeInTheDocument();
  });

  it("marks itself loaded immediately for an already-cached image (no stuck blur)", () => {
    const originalComplete = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "complete");
    const originalNaturalWidth = Object.getOwnPropertyDescriptor(
      HTMLImageElement.prototype,
      "naturalWidth",
    );
    Object.defineProperty(HTMLImageElement.prototype, "complete", {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      configurable: true,
      get: () => 400,
    });

    try {
      const { container } = render(<BlurImage src="/cached.jpg" alt="Cached" />);
      expect(container.querySelector(".ml-blur-image")).toHaveClass("ml-blur-image-loaded");
    } finally {
      if (originalComplete) Object.defineProperty(HTMLImageElement.prototype, "complete", originalComplete);
      if (originalNaturalWidth) {
        Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", originalNaturalWidth);
      }
    }
  });

  it("resets to unloaded when the src changes", () => {
    const { container, rerender } = render(<BlurImage src="/one.jpg" alt="One" />);
    fireEvent.load(container.querySelector("img")!);
    expect(container.querySelector(".ml-blur-image")).toHaveClass("ml-blur-image-loaded");

    rerender(<BlurImage src="/two.jpg" alt="Two" />);
    expect(container.querySelector(".ml-blur-image")).not.toHaveClass("ml-blur-image-loaded");
  });

  it("derives the container aspect ratio from width and height", () => {
    const { container } = render(<BlurImage src="/photo.jpg" alt="A photo" width={400} height={300} />);
    const root = container.querySelector(".ml-blur-image") as HTMLElement;
    expect(root.style.aspectRatio).toBe("400 / 300");
    expect(root.style.width).toBe("400px");
  });

  it("accepts an explicit aspectRatio for a fluid-width box", () => {
    const { container } = render(<BlurImage src="/photo.jpg" alt="A photo" aspectRatio="16 / 9" />);
    const root = container.querySelector(".ml-blur-image") as HTMLElement;
    expect(root.style.aspectRatio).toBe("16 / 9");
    expect(root.style.width).toBe("100%");
  });

  it("passes width/height through to the <img> as native attributes", () => {
    const { container } = render(<BlurImage src="/photo.jpg" alt="A photo" width={400} height={300} />);
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("width", "400");
    expect(img).toHaveAttribute("height", "300");
  });

  it("merges a custom className onto the container", () => {
    const { container } = render(<BlurImage src="/photo.jpg" alt="A photo" className="extra" />);
    expect(container.querySelector(".ml-blur-image")).toHaveClass("ml-blur-image", "extra");
  });

  it("forwards additional img props like loading and decoding", () => {
    const { container } = render(
      <BlurImage src="/photo.jpg" alt="A photo" loading="lazy" decoding="async" />,
    );
    const img = container.querySelector("img")!;
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("exposes the underlying <img> element via ref", () => {
    let node: HTMLImageElement | null = null;
    render(
      <BlurImage
        src="/photo.jpg"
        alt="A photo"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    expect(node).toBeInstanceOf(HTMLImageElement);
  });
});
