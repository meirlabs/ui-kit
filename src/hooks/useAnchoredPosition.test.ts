import { renderHook } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import {
  type AnchoredPlacement,
  useAnchoredPosition,
} from "./useAnchoredPosition";

// jsdom has no layout, so fake it: a 100×30 anchor at (300, 100) and a 160×40
// floating element, inside a 1024-wide viewport.
const ANCHOR = { left: 300, right: 400, top: 100, bottom: 130, width: 100, height: 30 };
const FLOAT_W = 160;
const FLOAT_H = 40;

function setup(placement: AnchoredPlacement, dir?: "rtl") {
  const host = document.createElement("div");
  if (dir) host.setAttribute("dir", dir);
  const anchor = document.createElement("button");
  const floating = document.createElement("div");
  host.append(anchor);
  document.body.append(host, floating);

  anchor.getBoundingClientRect = () =>
    ({ ...ANCHOR, x: ANCHOR.left, y: ANCHOR.top, toJSON: () => ({}) }) as DOMRect;
  Object.defineProperty(floating, "offsetWidth", { value: FLOAT_W });
  Object.defineProperty(floating, "offsetHeight", { value: FLOAT_H });
  Object.defineProperty(document.documentElement, "clientWidth", {
    value: 1024,
    configurable: true,
  });

  const { result } = renderHook(() =>
    useAnchoredPosition({ current: anchor }, { current: floating }, {
      open: true,
      placement,
      offset: 6,
    }),
  );
  return result.current;
}

describe("useAnchoredPosition", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("LTR: -start hugs the anchor's left edge, -end its right edge", () => {
    expect(setup("bottom-start").floatingStyle.left).toBe(ANCHOR.left);
    expect(setup("bottom-end").floatingStyle.left).toBe(ANCHOR.right - FLOAT_W);
  });

  it("RTL: -start hugs the anchor's right edge, -end its left edge", () => {
    expect(setup("bottom-start", "rtl").floatingStyle.left).toBe(
      ANCHOR.right - FLOAT_W,
    );
    expect(setup("bottom-end", "rtl").floatingStyle.left).toBe(ANCHOR.left);
  });

  it("keeps the logical placement name when mirrored", () => {
    expect(setup("bottom-start", "rtl").placement).toBe("bottom-start");
  });

  it("centers the bare side the same in both directions", () => {
    const centered = ANCHOR.left + ANCHOR.width / 2 - FLOAT_W / 2;
    expect(setup("bottom").floatingStyle.left).toBe(centered);
    expect(setup("bottom", "rtl").floatingStyle.left).toBe(centered);
  });

  it("keeps left/right sides physical under RTL", () => {
    expect(setup("right", "rtl").floatingStyle.left).toBe(ANCHOR.right + 6);
    expect(setup("left", "rtl").floatingStyle.left).toBe(
      ANCHOR.left - FLOAT_W - 6,
    );
  });
});
