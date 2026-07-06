import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * Placements supported by {@link useAnchoredPosition}. `-start`/`-end` align the
 * floating element to the anchor's leading/trailing edge on the cross axis; the
 * bare side centers it.
 */
export type AnchoredPlacement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end"
  | "left-start"
  | "left-end"
  | "right-start"
  | "right-end";

export interface UseAnchoredPositionOptions {
  /** Only computes while `true`; when `false` the hook idles (no listeners). */
  open: boolean;
  /** Desired placement. Defaults to `"bottom"`. */
  placement?: AnchoredPlacement;
  /** Gap between anchor and floating element, in px. Defaults to `6`. */
  offset?: number;
  /** Flip to the opposite side when the preferred side would overflow. */
  flip?: boolean;
  /** Force the floating element to match the anchor's width (Select/Combobox). */
  matchWidth?: boolean;
  /** Viewport edge padding kept clear when clamping/flipping, in px. */
  padding?: number;
}

export interface UseAnchoredPositionResult {
  /** Inline style for the floating element — `position: fixed` + coordinates. */
  floatingStyle: CSSProperties;
  /** Placement actually used after flipping. */
  placement: AnchoredPlacement;
  /** Imperatively recompute (e.g. after content changes size). */
  update: () => void;
}

const isBrowser = typeof window !== "undefined";
const useIsoLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "end" | "center";

interface Coords {
  top: number;
  left: number;
}

function parse(placement: AnchoredPlacement): { side: Side; align: Align } {
  const [side, align] = placement.split("-") as [Side, Align | undefined];
  return { side, align: align ?? "center" };
}

const OPPOSITE: Record<Side, Side> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function computeCoords(
  side: Side,
  align: Align,
  anchor: DOMRect,
  fw: number,
  fh: number,
  offset: number,
): Coords {
  let top = 0;
  let left = 0;

  // Main axis
  if (side === "top") top = anchor.top - fh - offset;
  else if (side === "bottom") top = anchor.bottom + offset;
  else if (side === "left") left = anchor.left - fw - offset;
  else left = anchor.right + offset;

  // Cross axis
  if (side === "top" || side === "bottom") {
    if (align === "start") left = anchor.left;
    else if (align === "end") left = anchor.right - fw;
    else left = anchor.left + anchor.width / 2 - fw / 2;
  } else {
    if (align === "start") top = anchor.top;
    else if (align === "end") top = anchor.bottom - fh;
    else top = anchor.top + anchor.height / 2 - fh / 2;
  }

  return { top, left };
}

function overflowsMainAxis(
  side: Side,
  coords: Coords,
  fw: number,
  fh: number,
  vw: number,
  vh: number,
  pad: number,
): boolean {
  if (side === "top") return coords.top < pad;
  if (side === "bottom") return coords.top + fh > vh - pad;
  if (side === "left") return coords.left < pad;
  return coords.left + fw > vw - pad;
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

export function useAnchoredPosition(
  anchorRef: RefObject<HTMLElement | null>,
  floatingRef: RefObject<HTMLElement | null>,
  {
    open,
    placement = "bottom",
    offset = 6,
    flip = true,
    matchWidth = false,
    padding = 8,
  }: UseAnchoredPositionOptions,
): UseAnchoredPositionResult {
  const [state, setState] = useState<{
    style: CSSProperties;
    placement: AnchoredPlacement;
  }>({
    // Rendered off-screen and hidden until first measurement lands, so the
    // element never flashes at (0,0).
    style: { position: "fixed", top: 0, left: 0, visibility: "hidden" },
    placement,
  });

  const frame = useRef<number | null>(null);

  const compute = useCallback(() => {
    const anchor = anchorRef.current;
    const floating = floatingRef.current;
    if (!anchor || !floating) return;

    const anchorRect = anchor.getBoundingClientRect();
    const fw = matchWidth ? anchorRect.width : floating.offsetWidth;
    const fh = floating.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    let { side, align } = parse(placement);
    let coords = computeCoords(side, align, anchorRect, fw, fh, offset);

    if (flip && overflowsMainAxis(side, coords, fw, fh, vw, vh, padding)) {
      const flippedSide = OPPOSITE[side];
      const flipped = computeCoords(flippedSide, align, anchorRect, fw, fh, offset);
      if (!overflowsMainAxis(flippedSide, flipped, fw, fh, vw, vh, padding)) {
        side = flippedSide;
        coords = flipped;
      }
    }

    // Clamp the cross axis so the element stays on-screen (prevents horizontal
    // scroll near viewport edges).
    if (side === "top" || side === "bottom") {
      coords.left = clamp(coords.left, padding, Math.max(padding, vw - fw - padding));
    } else {
      coords.top = clamp(coords.top, padding, Math.max(padding, vh - fh - padding));
    }

    const resolved: AnchoredPlacement =
      align === "center" ? side : (`${side}-${align}` as AnchoredPlacement);

    const style: CSSProperties = {
      position: "fixed",
      top: Math.round(coords.top),
      left: Math.round(coords.left),
      visibility: "visible",
    };
    if (matchWidth) style.width = Math.round(anchorRect.width);

    setState((prev) => {
      const p = prev.style;
      if (
        p.top === style.top &&
        p.left === style.left &&
        p.width === style.width &&
        p.visibility === style.visibility &&
        prev.placement === resolved
      ) {
        return prev;
      }
      return { style, placement: resolved };
    });
  }, [anchorRef, floatingRef, placement, offset, flip, matchWidth, padding]);

  const update = useCallback(() => {
    if (!isBrowser) return;
    if (frame.current != null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      compute();
    });
  }, [compute]);

  useIsoLayoutEffect(() => {
    if (!open || !isBrowser) return;

    compute();

    const onScrollResize = () => update();
    window.addEventListener("scroll", onScrollResize, true);
    window.addEventListener("resize", onScrollResize);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => update());
      if (floatingRef.current) ro.observe(floatingRef.current);
      if (anchorRef.current) ro.observe(anchorRef.current);
    }

    return () => {
      window.removeEventListener("scroll", onScrollResize, true);
      window.removeEventListener("resize", onScrollResize);
      ro?.disconnect();
      if (frame.current != null) {
        cancelAnimationFrame(frame.current);
        frame.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, compute, update]);

  // Reset to hidden when closed so the next open re-measures cleanly.
  useIsoLayoutEffect(() => {
    if (!open) {
      setState((prev) =>
        prev.style.visibility === "hidden"
          ? prev
          : {
              style: { position: "fixed", top: 0, left: 0, visibility: "hidden" },
              placement,
            },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return { floatingStyle: state.style, placement: state.placement, update };
}
