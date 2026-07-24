import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// Regression test for the light-theme structural-token bug: --ml-space-*,
// --ml-radius-*, --ml-font-sans/-mono (and the --ml-text-* type scale found
// during the same audit) were defined only inside the
// `[data-meirlabs-theme="dark"]` block, so any consumer running the LIGHT
// theme got zero padding, zero border-radius, and no font-family — every
// `var(--ml-space-*)` / `var(--ml-radius-*)` resolved to nothing.
//
// This loads the real tokens.css source (not a hand-copied fixture) into a
// jsdom <style> tag and reads it back via getComputedStyle, so it exercises
// the actual CSS cascade the way a browser would, under both themes.

// vitest runs with cwd at the package root.
const tokensCssPath = join(process.cwd(), "src/styles/tokens.css");
const tokensCss = readFileSync(tokensCssPath, "utf8");

const STRUCTURAL_TOKENS = [
  "--ml-space-xs",
  "--ml-space-sm",
  "--ml-space-md",
  "--ml-space-lg",
  "--ml-space-xl",
  "--ml-space-2xl",
  "--ml-radius-sm",
  "--ml-radius-md",
  "--ml-radius-lg",
  "--ml-radius-xl",
  "--ml-radius-pill",
  "--ml-font-sans",
  "--ml-font-mono",
] as const;

// Additional finding from the same audit: the type scale is just as
// theme-independent and was also dark-only (not even duplicated in light).
const TYPE_SCALE_TOKENS = [
  "--ml-text-xs",
  "--ml-text-sm",
  "--ml-text-base",
  "--ml-text-lg",
  "--ml-text-xl",
  "--ml-text-2xl",
  "--ml-text-3xl",
] as const;

let styleEl: HTMLStyleElement;

beforeEach(() => {
  styleEl = document.createElement("style");
  styleEl.textContent = tokensCss;
  document.head.appendChild(styleEl);
});

afterEach(() => {
  styleEl.remove();
  document.documentElement.removeAttribute("data-meirlabs-theme");
});

describe("tokens.css — structural (theme-independent) tokens", () => {
  it.each(["light", "dark"] as const)(
    "resolves every --ml-space-* / --ml-radius-* / --ml-font-* token under theme=%s",
    (theme) => {
      document.documentElement.setAttribute("data-meirlabs-theme", theme);
      const computed = getComputedStyle(document.documentElement);

      for (const token of STRUCTURAL_TOKENS) {
        const value = computed.getPropertyValue(token).trim();
        expect(value, `${token} should resolve under theme="${theme}"`).not.toBe("");
      }
    },
  );

  it.each(["light", "dark"] as const)(
    "resolves the --ml-text-* type scale under theme=%s",
    (theme) => {
      document.documentElement.setAttribute("data-meirlabs-theme", theme);
      const computed = getComputedStyle(document.documentElement);

      for (const token of TYPE_SCALE_TOKENS) {
        const value = computed.getPropertyValue(token).trim();
        expect(value, `${token} should resolve under theme="${theme}"`).not.toBe("");
      }
    },
  );

  it("resolves identical values for light and dark (these tokens never change per theme)", () => {
    document.documentElement.setAttribute("data-meirlabs-theme", "light");
    const light = getComputedStyle(document.documentElement);
    const lightValues = Object.fromEntries(
      [...STRUCTURAL_TOKENS, ...TYPE_SCALE_TOKENS].map((t) => [t, light.getPropertyValue(t).trim()]),
    );

    document.documentElement.setAttribute("data-meirlabs-theme", "dark");
    const dark = getComputedStyle(document.documentElement);

    for (const token of [...STRUCTURAL_TOKENS, ...TYPE_SCALE_TOKENS]) {
      expect(dark.getPropertyValue(token).trim(), token).toBe(lightValues[token]);
    }
  });
});
