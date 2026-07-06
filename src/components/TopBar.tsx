import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export interface TopBarProps extends ComponentPropsWithoutRef<"header"> {
  /** Leading slot (logo, breadcrumb, menu button). */
  left?: ReactNode;
  /** Centered slot (search, page switcher). */
  center?: ReactNode;
  /** Trailing slot (actions, avatar), pinned to the right edge. */
  right?: ReactNode;
}

/**
 * `TopBar` — a 56px application header with `border-bottom` and
 * `--ml-bg-surface`.
 *
 * Provide any of the `left` / `center` / `right` slots for the standard flex
 * layout, or pass `children` for a fully custom bar. When no slot is supplied,
 * `children` render directly inside the flex row (backwards compatible).
 *
 * ```tsx
 * <TopBar
 *   left={<Logo />}
 *   center={<GlobalSearch />}
 *   right={<Avatar />}
 * />
 * ```
 */
export const TopBar = forwardRef<HTMLElement, TopBarProps>(function TopBar(
  { left, center, right, className, children, ...rest },
  ref,
) {
  const hasSlots = left != null || center != null || right != null;

  return (
    <header ref={ref} className={cn("ml-top-bar", className)} {...rest}>
      {hasSlots ? (
        <>
          {left != null && <div className="ml-top-bar-left">{left}</div>}
          {center != null && (
            <div className="ml-top-bar-center">{center}</div>
          )}
          {right != null && <div className="ml-top-bar-right">{right}</div>}
        </>
      ) : (
        children
      )}
    </header>
  );
});
