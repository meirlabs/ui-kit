import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type KeyboardEvent,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export interface CardProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Element/component to render as. Use `"button"` or `"a"` when the whole
   * card is clickable so it is natively focusable and keyboard-operable.
   */
  as?: ElementType;
  /** Hover shifts the border toward `--ml-text-muted` (color/border only). */
  interactive?: boolean;
  /** `"default"` = 24px padding, `"compact"` = 12px. */
  padding?: "compact" | "default";
}

/**
 * `Card` — a bordered surface for grouping related content.
 *
 * 12px radius, 24px padding, 1px `--ml-border`, `--ml-bg-card` — and **no
 * shadow at rest** (depth comes from the border + surface, per spec §4).
 * **Never nest a Card inside another Card** — group with spacing and borders
 * instead (spec §0.10).
 *
 * Pass `interactive` for a hover border shift, and set `as="button"` / `as="a"`
 * (or an `onClick`) to make the whole card an accessible, focus-ringed target.
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as,
    interactive,
    padding = "default",
    className,
    children,
    onClick,
    onKeyDown,
    role,
    tabIndex,
    ...rest
  },
  ref,
) {
  const Comp = (as ?? "div") as ElementType;
  const nativeInteractive = Comp === "button" || Comp === "a";
  const clickable = onClick != null || interactive === true;
  const needsA11y = clickable && !nativeInteractive;

  // Emulate button semantics when a non-interactive element is clickable.
  const handleKeyDown =
    needsA11y && onClick != null
      ? (event: KeyboardEvent) => {
          onKeyDown?.(event as KeyboardEvent<never>);
          if (event.defaultPrevented) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            (event.currentTarget as HTMLElement).click();
          }
        }
      : (onKeyDown as ((event: KeyboardEvent) => void) | undefined);

  return (
    <Comp
      ref={ref}
      className={cn(
        "ml-card",
        interactive && "ml-card-interactive",
        padding === "compact" && "ml-card-compact",
        className,
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={role ?? (needsA11y ? "button" : undefined)}
      tabIndex={needsA11y ? (tabIndex ?? 0) : tabIndex}
      {...rest}
    >
      {children}
    </Comp>
  );
});
