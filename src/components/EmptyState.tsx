import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Placeholder, type PlaceholderSubject } from "./Placeholder";

export type EmptyStateVariant = "no-data" | "no-results" | "error";

export interface EmptyStateProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Headline — what's missing. */
  title: ReactNode;
  /** Supporting line beneath the title. */
  description?: ReactNode;
  /** Custom leading node (icon). Wins over the default illustration. */
  icon?: ReactNode;
  /** Custom illustration node. Wins over both `icon` and the default art. */
  illustration?: ReactNode;
  /** Primary/secondary CTA(s). */
  action?: ReactNode;
  /**
   * Tunes copy tone and layout. `no-data` gets the dashed "nothing here yet"
   * container; `no-results` and `error` are plain centered blocks.
   */
  variant?: EmptyStateVariant;
}

/* Default art per variant — composes the read-only Placeholder illustration so
   the two "nothing here" concepts finally relate (EmptyState = layout,
   Placeholder = art). `error` intentionally has no default art. */
const VARIANT_SUBJECT: Record<EmptyStateVariant, PlaceholderSubject | null> = {
  "no-data": "documents",
  "no-results": "search",
  error: null,
};

/**
 * EmptyState — the layout wrapper for a "nothing here" moment. Centered, muted,
 * with optional art (its own `illustration`/`icon`, else a variant-appropriate
 * `Placeholder`), title, description and action slot. Only the `no-data` variant
 * draws the dashed container; `no-results` and `error` stay borderless. Used by
 * `DataTable`'s empty slot.
 */
export function EmptyState({
  title,
  description,
  icon,
  illustration,
  action,
  variant = "no-data",
  className,
  ...rest
}: EmptyStateProps) {
  const subject = VARIANT_SUBJECT[variant];
  const art =
    illustration ??
    icon ??
    (subject ? <Placeholder subject={subject} /> : null);

  return (
    <div
      className={cn("ml-empty-state", `ml-empty-state--${variant}`, className)}
      {...rest}
    >
      {art != null && <div className="ml-empty-state-art">{art}</div>}
      <p className="ml-empty-state-title">{title}</p>
      {description != null && (
        <p className="ml-empty-state-desc">{description}</p>
      )}
      {action != null && <div className="ml-empty-state-action">{action}</div>}
    </div>
  );
}
