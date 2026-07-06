import { type ComponentProps, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Tooltip } from "./Tooltip";

export interface HintProps {
  /** The tooltip body. Keep it to one short, plain sentence. */
  tip: ReactNode;
  /** The visible text the tooltip explains (a header, label, or term). */
  children: ReactNode;
  /** Preferred tooltip placement. Defaults to the Tooltip default ("top"). */
  placement?: ComponentProps<typeof Tooltip>["placement"];
  /**
   * Whether the trigger is keyboard-focusable so the tooltip also opens on
   * focus. Defaults to `true`. Set `false` when the text already sits inside an
   * interactive element (e.g. a sortable {@link DataTable} header button), to
   * avoid nesting focusable elements.
   */
  focusable?: boolean;
  /** Class applied to the inline trigger span. */
  className?: string;
}

/**
 * Hint — attaches a {@link Tooltip} to a piece of visible text (a table header,
 * metric label, section title, or domain term) with **no added icon** and **no
 * cursor change**: the text looks and behaves exactly as before, and the
 * tooltip appearing on hover or keyboard focus is the only feedback. Reach for
 * this to annotate a term in place; reach for {@link Tooltip} directly when you
 * need to wrap a non-text element.
 */
export function Hint({
  tip,
  children,
  placement,
  focusable = true,
  className,
}: HintProps) {
  return (
    <Tooltip content={tip} placement={placement}>
      <span className={cn("ml-hint", className)} tabIndex={focusable ? 0 : undefined}>
        {children}
      </span>
    </Tooltip>
  );
}
