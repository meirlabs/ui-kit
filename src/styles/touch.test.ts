import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Touch rules live in media queries, which jsdom's getComputedStyle does not
// evaluate — so these tests read the real stylesheets through the CSSOM and
// assert on their structure instead.

// vitest runs with cwd at the package root.
const stylesDir = join(process.cwd(), "src/styles");

function parse(file: string): CSSRule[] {
  const style = document.createElement("style");
  style.textContent = readFileSync(join(stylesDir, file), "utf8");
  document.head.append(style);
  const rules = Array.from(style.sheet!.cssRules);
  style.remove();
  return rules;
}

const isStyleRule = (rule: CSSRule): rule is CSSStyleRule =>
  typeof (rule as CSSStyleRule).selectorText === "string";
const isMediaRule = (rule: CSSRule): rule is CSSMediaRule =>
  (rule as CSSMediaRule).media != null && (rule as CSSMediaRule).cssRules != null;

/** Style rules inside `@media` blocks whose condition mentions `feature`. */
function rulesUnder(file: string, feature: string): CSSStyleRule[] {
  return parse(file)
    .filter(isMediaRule)
    .filter((media) => media.media.mediaText.includes(feature))
    .flatMap((media) => Array.from(media.cssRules).filter(isStyleRule));
}

function declared(rules: CSSStyleRule[], selector: string, property: string) {
  return rules
    .filter((rule) =>
      rule.selectorText.split(",").some((part) => part.trim() === selector),
    )
    .map((rule) => rule.style.getPropertyValue(property))
    .filter(Boolean)
    .pop();
}

describe("hover styles", () => {
  // compat.css is the deprecated .tt-* layer; index.css is only @imports.
  const files = readdirSync(stylesDir).filter(
    (file) => file.endsWith(".css") && !["compat.css", "index.css"].includes(file),
  );

  it("are all gated behind (hover: hover), so a tap never leaves a stuck hover fill", () => {
    const ungated: string[] = [];
    for (const file of files) {
      for (const rule of parse(file)) {
        const candidates = isMediaRule(rule)
          ? rule.media.mediaText.includes("hover: hover")
            ? []
            : Array.from(rule.cssRules)
          : [rule];
        for (const candidate of candidates) {
          if (!isStyleRule(candidate)) continue;
          // Scrollbar thumbs are not touch targets.
          if (candidate.selectorText.includes("-webkit-scrollbar")) continue;
          if (candidate.selectorText.includes(":hover")) {
            ungated.push(`${file}: ${candidate.selectorText}`);
          }
        }
      }
    }
    expect(ungated).toEqual([]);
  });
});

describe("coarse pointers", () => {
  it("text fields use 16px so iOS does not zoom the page on focus", () => {
    const inputs = rulesUnder("inputs.css", "pointer: coarse");
    expect(declared(inputs, ".ml-input-field", "font-size")).toBe("16px");
    expect(declared(inputs, ".ml-textarea", "font-size")).toBe("16px");

    const forms = rulesUnder("forms.css", "pointer: coarse");
    expect(declared(forms, ".ml-field > textarea", "font-size")).toBe("16px");
    expect(declared(forms, ".ml-field > select", "font-size")).toBe("16px");
  });

  it("text fields keep 14px outside that query", () => {
    const base = parse("inputs.css").filter(isStyleRule);
    expect(declared(base, ".ml-input-field", "font-size")).toBe("14px");
    expect(declared(base, ".ml-textarea", "font-size")).toBe("14px");
  });

  it("pagination-footer arrows keep their 28px box but take a 44px hit area", () => {
    const base = parse("pagination.css").filter(isStyleRule);
    expect(declared(base, ".ml-pgf-arrow", "width")).toBe("28px");
    expect(declared(base, ".ml-pgf-arrow", "height")).toBe("28px");

    const coarse = rulesUnder("pagination.css", "pointer: coarse");
    // 28px + 2 × 8px = 44px, without touching the layout box.
    expect(declared(coarse, ".ml-pgf-arrow::before", "inset")).toBe("-8px");
    expect(declared(coarse, ".ml-pgf-arrow::before", "position")).toBe("absolute");
  });
});
