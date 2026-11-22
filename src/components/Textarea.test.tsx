import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { Field } from "./Field";
import { Textarea } from "./Textarea";

/* jsdom resolves competing rules by source order, not specificity, so its
   getComputedStyle can't tell which `resize` wins. Work it out from the real
   stylesheets instead: among the rules that match the element and declare
   `resize`, the most specific wins, and source order breaks ties. */
function specificity(selector: string): number {
  const classLike = /\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g;
  const classes = selector.match(classLike)?.length ?? 0;
  const types = selector.replace(classLike, " ").match(/[a-zA-Z][\w-]*/g)?.length ?? 0;
  return classes * 100 + types;
}

function winningResize(el: Element): string {
  let best = { spec: -1, value: "" };
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules) as CSSStyleRule[]) {
      const value = rule.style?.getPropertyValue("resize");
      if (!value || !rule.selectorText) continue;
      for (const part of rule.selectorText.split(",")) {
        if (!el.matches(part.trim())) continue;
        const spec = specificity(part);
        if (spec >= best.spec) best = { spec, value };
      }
    }
  }
  return best.value;
}

describe("Textarea", () => {
  it("renders a native textarea and forwards value/placeholder", () => {
    render(<Textarea value="hi" onChange={() => {}} placeholder="Say something" />);
    const el = screen.getByPlaceholderText("Say something") as HTMLTextAreaElement;
    expect(el.tagName).toBe("TEXTAREA");
    expect(el.value).toBe("hi");
  });

  it("does not add the autoresize class by default", () => {
    render(<Textarea value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveClass("ml-textarea--autoresize");
  });

  it("adds the autoresize class (resize:none) when autoResize is set", () => {
    render(<Textarea autoResize value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveClass("ml-textarea--autoresize");
  });

  it("uses minRows (falling back to rows, then 3) as the initial rows attribute", () => {
    render(<Textarea autoResize minRows={2} maxRows={6} value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "2");
  });

  it("marks invalid state via aria-invalid and the invalid class", () => {
    render(<Textarea invalid value="" onChange={() => {}} />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveAttribute("aria-invalid", "true");
    expect(el).toHaveClass("ml-textarea--invalid");
  });

  it("disables the field and forces resize:none via the disabled class", () => {
    render(<Textarea disabled value="" onChange={() => {}} />);
    const el = screen.getByRole("textbox");
    expect(el).toBeDisabled();
    expect(el).toHaveClass("ml-textarea--disabled");
  });

  describe("manual resize handle", () => {
    let styles: HTMLStyleElement[] = [];

    beforeEach(() => {
      // Same order as styles/index.css. vitest runs with cwd at the package root.
      styles = ["forms.css", "inputs.css"].map((file) => {
        const style = document.createElement("style");
        style.textContent = readFileSync(join(process.cwd(), "src/styles", file), "utf8");
        document.head.append(style);
        return style;
      });
    });

    afterEach(() => {
      styles.forEach((style) => style.remove());
    });

    it("has none on an autoResize field", () => {
      render(<Textarea autoResize value="" onChange={() => {}} />);
      expect(winningResize(screen.getByRole("textbox"))).toBe("none");
    });

    it("has none on an autoResize field inside a Field", () => {
      render(
        <Field label="Notes">
          <Textarea autoResize value="" onChange={() => {}} />
        </Field>,
      );
      expect(winningResize(screen.getByRole("textbox"))).toBe("none");
    });

    it("keeps the vertical handle on a plain textarea, inside or outside a Field", () => {
      const { unmount } = render(<Textarea value="" onChange={() => {}} />);
      expect(winningResize(screen.getByRole("textbox"))).toBe("vertical");
      unmount();

      render(
        <Field label="Notes">
          <Textarea value="" onChange={() => {}} />
        </Field>,
      );
      expect(winningResize(screen.getByRole("textbox"))).toBe("vertical");
    });
  });
});
