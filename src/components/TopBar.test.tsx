import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("renders the provided slots in reading order inside a header", () => {
    const { container } = render(
      <TopBar left={<span>Logo</span>} center={<span>Search</span>} right={<span>Account</span>} />,
    );
    const header = screen.getByRole("banner");
    expect(header).toHaveClass("ml-top-bar");
    expect(
      Array.from(container.querySelectorAll(".ml-top-bar > div")).map((el) => el.className),
    ).toEqual(["ml-top-bar-left", "ml-top-bar-center", "ml-top-bar-right"]);
  });

  it("renders children directly when no slot is given", () => {
    const { container } = render(
      <TopBar>
        <span>Custom</span>
      </TopBar>,
    );
    expect(screen.getByText("Custom").parentElement).toHaveClass("ml-top-bar");
    expect(container.querySelector(".ml-top-bar-right")).toBeNull();
  });

  describe("trailing slot", () => {
    let style: HTMLStyleElement;

    beforeEach(() => {
      // vitest runs with cwd at the package root.
      style = document.createElement("style");
      style.textContent = readFileSync(join(process.cwd(), "src/styles/layout.css"), "utf8");
      document.head.append(style);
    });

    afterEach(() => {
      style.remove();
    });

    it("is pushed to the end edge with a logical margin, so it mirrors under RTL", () => {
      const { container } = render(<TopBar right={<span>Account</span>} />);
      const computed = getComputedStyle(container.querySelector(".ml-top-bar-right")!);
      expect(computed.marginInlineStart).toBe("auto");
      // A physical margin would keep it on the right in both directions.
      expect(computed.marginLeft).not.toBe("auto");
    });
  });
});
