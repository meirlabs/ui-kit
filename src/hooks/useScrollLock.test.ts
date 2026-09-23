import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useScrollLock } from "./useScrollLock";

// jsdom has no layout and no `scrollbar-gutter` support, so fake both: a 15px
// classic scrollbar (innerWidth 1024, clientWidth 1009) and, per test, the
// root's computed `scrollbar-gutter`.
const SCROLLBAR = 15;

function stubRootGutter(value: string) {
  const real = window.getComputedStyle.bind(window);
  vi.spyOn(window, "getComputedStyle").mockImplementation((el, pseudo) => {
    const style = real(el, pseudo);
    if (el !== document.documentElement) return style;
    return new Proxy(style, {
      get(target, prop) {
        if (prop === "scrollbarGutter") return value;
        if (prop === "getPropertyValue") {
          return (name: string) =>
            name === "scrollbar-gutter" ? value : target.getPropertyValue(name);
        }
        const v = Reflect.get(target, prop, target);
        return typeof v === "function" ? v.bind(target) : v;
      },
    });
  });
}

describe("useScrollLock", () => {
  beforeEach(() => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(document.documentElement, "clientWidth", {
      configurable: true,
      value: 1024 - SCROLLBAR,
    });
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (document.documentElement as { clientWidth?: number }).clientWidth;
  });

  it("pads body by the scrollbar width when the root reserves no gutter", () => {
    stubRootGutter("auto");
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe(`${SCROLLBAR}px`);

    unmount();
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.paddingRight).toBe("");
  });

  it("adds no body padding when the root reserves a stable gutter", () => {
    stubRootGutter("stable");
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.paddingRight).toBe("");

    unmount();
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.paddingRight).toBe("");
  });

  it("treats `stable both-edges` as a reserved gutter too", () => {
    stubRootGutter("stable both-edges");
    const { unmount } = renderHook(() => useScrollLock(true));

    expect(document.body.style.paddingRight).toBe("");
    unmount();
  });
});
