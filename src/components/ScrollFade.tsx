import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export type ScrollFadeAxis = "x" | "y" | "both";

export interface ScrollFadeProps extends ComponentPropsWithoutRef<"div"> {
  /** Which scroll axis gets the edge fade. Default `"y"` (vertical). */
  axis?: ScrollFadeAxis;
  /** Fade length in px at each scrollable edge. Default 48. */
  size?: number;
}

/**
 * `ScrollFade` — a scroll container whose edges fade/mask out only where
 * there's more content to scroll to, driven by CSS scroll-driven animations
 * (`animation-timeline: scroll()`) instead of a scroll event listener. No
 * fade shows at an edge you're already at (e.g. no top fade at scrollTop 0).
 *
 * Progressive enhancement: in browsers without scroll-driven-animation
 * support the container still scrolls normally, unmasked.
 *
 * ```tsx
 * <ScrollFade axis="y" style={{ maxHeight: 320 }}>
 *   {longList}
 * </ScrollFade>
 * ```
 */
export const ScrollFade = forwardRef<HTMLDivElement, ScrollFadeProps>(
  function ScrollFade({ axis = "y", size = 48, className, style, children, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn(`ml-scroll-fade-${axis}`, className)}
        style={{ "--ml-scroll-fade-size": `${size}px`, ...style } as CSSProperties}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
