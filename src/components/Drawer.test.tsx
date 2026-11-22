import { render, screen, fireEvent } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { Drawer, resolveDrawerSide, type DrawerSide } from "./Drawer";

/** Render an open drawer, read where it landed, then unmount it again. */
function sideOf(side?: DrawerSide, dir?: "ltr" | "rtl") {
  const { unmount } = render(
    <Drawer open onClose={() => {}} side={side} dir={dir} title="Filters">
      Body
    </Drawer>,
  );
  const dialog = screen.getByRole("dialog");
  const result = {
    panel: dialog.getAttribute("data-side"),
    overlay: dialog.parentElement?.getAttribute("data-side"),
    dirAttr: dialog.getAttribute("dir"),
  };
  unmount();
  return result;
}

describe("resolveDrawerSide", () => {
  it("maps start/end to physical edges per direction", () => {
    expect(resolveDrawerSide("start", "ltr")).toBe("left");
    expect(resolveDrawerSide("end", "ltr")).toBe("right");
    expect(resolveDrawerSide("start", "rtl")).toBe("right");
    expect(resolveDrawerSide("end", "rtl")).toBe("left");
  });

  it.each(["left", "right", "top", "bottom"] as const)(
    "leaves the physical side %s alone in both directions",
    (side) => {
      expect(resolveDrawerSide(side, "ltr")).toBe(side);
      expect(resolveDrawerSide(side, "rtl")).toBe(side);
    },
  );
});

describe("Drawer", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("dir");
  });

  it("renders nothing while closed and a labelled dialog when open", () => {
    const { rerender } = render(
      <Drawer open={false} onClose={() => {}} title="Filters" />,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<Drawer open onClose={() => {}} title="Filters" />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("Filters");
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="Filters" />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('names the close button "Close" by default', () => {
    render(<Drawer open onClose={() => {}} title="Filters" />);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("names the close button with closeLabel, and it still closes", () => {
    const onClose = vi.fn();
    render(<Drawer open onClose={onClose} title="Filters" closeLabel="Fermer" />);
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Fermer" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  describe("side resolution", () => {
    it("defaults to the right edge in LTR, on the panel and the overlay", () => {
      const { panel, overlay } = sideOf();
      expect(panel).toBe("right");
      expect(overlay).toBe("right");
    });

    it("defaults to the left edge when the document is RTL", () => {
      document.documentElement.setAttribute("dir", "rtl");
      const { panel, overlay } = sideOf();
      expect(panel).toBe("left");
      expect(overlay).toBe("left");
    });

    it("resolves start/end against an LTR document", () => {
      expect(sideOf("start").panel).toBe("left");
      expect(sideOf("end").panel).toBe("right");
    });

    it("resolves start/end against an RTL document", () => {
      document.documentElement.setAttribute("dir", "rtl");
      expect(sideOf("start").panel).toBe("right");
      expect(sideOf("end").panel).toBe("left");
    });

    it.each(["left", "right", "top", "bottom"] as const)(
      "keeps the physical side %s in an RTL document",
      (side) => {
        document.documentElement.setAttribute("dir", "rtl");
        expect(sideOf(side).panel).toBe(side);
      },
    );

    it("lets the dir prop win over the document direction", () => {
      document.documentElement.setAttribute("dir", "rtl");
      const { panel, dirAttr } = sideOf("end", "ltr");
      expect(panel).toBe("right");
      expect(dirAttr).toBe("ltr");
    });

    it("resolves against dir='rtl' in an LTR document", () => {
      const { panel, dirAttr } = sideOf("start", "rtl");
      expect(panel).toBe("right");
      expect(dirAttr).toBe("rtl");
    });
  });
});
