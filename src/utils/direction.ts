export type Direction = "ltr" | "rtl";

/**
 * Reading direction in effect at `element` (defaults to `document.body`, which
 * is where portaled overlays render). The nearest explicit `dir="ltr|rtl"`
 * attribute wins; otherwise the computed `direction` is used, so a direction
 * set from CSS or `dir="auto"` is still honored. Returns `"ltr"` on the server.
 */
export function getDirection(element?: Element | null): Direction {
  if (typeof document === "undefined") return "ltr";
  const el = element ?? document.body ?? document.documentElement;
  if (!el) return "ltr";

  const attr = el.closest("[dir]")?.getAttribute("dir")?.toLowerCase();
  if (attr === "rtl" || attr === "ltr") return attr;

  if (typeof getComputedStyle !== "function") return "ltr";
  return getComputedStyle(el).direction === "rtl" ? "rtl" : "ltr";
}
