import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";

export interface DangerZoneProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Panel heading. */
  title?: ReactNode;
}

const DangerZoneRoot = forwardRef<HTMLDivElement, DangerZoneProps>(
  function DangerZone({ title, className, children, ...rest }, ref) {
    return (
      <div ref={ref} className={cn("ml-danger-zone", className)} {...rest}>
        {title != null && (
          <div className="ml-danger-zone-header">
            <h3 className="ml-danger-zone-title">{title}</h3>
          </div>
        )}
        <div className="ml-danger-zone-body">{children}</div>
      </div>
    );
  },
);

export interface DangerZoneItemProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title" | "onConfirm"> {
  /** Row title (dense 14px medium). */
  title: ReactNode;
  /** Supporting description (12px muted). */
  description?: ReactNode;
  /** Label for the trailing danger button. Default "Delete". */
  actionLabel?: string;
  /**
   * Confirmation hook fired when the danger button is pressed. Wire your own
   * Modal/confirm flow here — this component never imports Modal itself.
   */
  onConfirm?: () => void;
  /** Disable the trailing action. */
  disabled?: boolean;
  /** Loading state for the trailing action. */
  loading?: boolean;
  /** Replace the default danger button entirely with custom trailing content. */
  action?: ReactNode;
}

/**
 * `DangerZone.Item` — one destructive row (title + description + trailing
 * danger button). Rows stack flat with hairline dividers — no nested cards.
 */
const DangerZoneItem = forwardRef<HTMLDivElement, DangerZoneItemProps>(
  function DangerZoneItem(
    {
      title,
      description,
      actionLabel = "Delete",
      onConfirm,
      disabled,
      loading,
      action,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn("ml-danger-zone-item", className)}
        {...rest}
      >
        <div className="ml-danger-zone-item-text">
          <span className="ml-danger-zone-item-title">{title}</span>
          {description != null && (
            <span className="ml-danger-zone-item-desc">{description}</span>
          )}
          {children}
        </div>
        <div className="ml-danger-zone-item-action">
          {action ?? (
            <Button
              variant="danger"
              onClick={onConfirm}
              disabled={disabled || loading}
              aria-busy={loading || undefined}
            >
              {loading ? "Working…" : actionLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);

/**
 * `DangerZone` — a flat, destructive-actions panel with a visible danger
 * border (`--ml-color-danger`).
 *
 * ```tsx
 * <DangerZone title="Danger Zone">
 *   <DangerZone.Item
 *     title="Delete workspace"
 *     description="Permanently remove this workspace and all its data."
 *     actionLabel="Delete workspace"
 *     onConfirm={() => setConfirmOpen(true)}
 *   />
 * </DangerZone>
 * ```
 */
export const DangerZone = Object.assign(DangerZoneRoot, {
  Item: DangerZoneItem,
});
