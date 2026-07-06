import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "../utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "icon";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "children"> {
  /**
   * Visual treatment. `primary` is the charcoal "btn-dark" surface — the way a
   * monochrome system expresses a primary action (contract §5). `icon` is a
   * transparent, square icon-only button.
   */
  variant?: ButtonVariant;
  /** Row height: sm 32 · md 40 · lg 48. Font stays 14px across sizes. */
  size?: ButtonSize;
  /**
   * Disables the control in place and swaps the label for a spinner while
   * RESERVING the width (never collapses / never `display:none`, contract §7/§9).
   */
  loading?: boolean;
  /** Leading icon slot (ReactNode; 4px gap to the label). */
  leftIcon?: ReactNode;
  /** Trailing icon slot (ReactNode; 4px gap to the label). */
  rightIcon?: ReactNode;
  /** Render as an anchor (link CTA) with button styling. Implied when `href` is set. */
  as?: "button" | "a";
  /** When provided, renders `<a role="button" href>` so link CTAs get button styling. */
  href?: string;
  children?: ReactNode;
}

/**
 * Button — the shipped button primitive. Extend it with a variant/size, don't
 * per-call `className`-override the charcoal primary (contract §5/§11).
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      as,
      href,
      className,
      children,
      disabled,
      type,
      ...rest
    },
    ref,
  ) {
    const isLink = as === "a" || href != null;
    const isDisabled = Boolean(disabled) || loading;

    const classes = cn(
      "ml-btn",
      `ml-btn-${variant}`,
      `ml-btn-size-${size}`,
      loading && "ml-btn-loading",
      // <a> can't be natively :disabled — carry the disabled visuals via a class
      isLink && isDisabled && "ml-btn-disabled",
      className,
    );

    const content = (
      <>
        {leftIcon != null && (
          <span className="ml-btn-icon-slot" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children != null && children !== false && (
          <span className="ml-btn-label">{children}</span>
        )}
        {rightIcon != null && (
          <span className="ml-btn-icon-slot" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        {loading && <span className="ml-btn-spinner" aria-hidden="true" />}
      </>
    );

    if (isLink) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          role="button"
          href={isDisabled ? undefined : href}
          className={classes}
          aria-busy={loading || undefined}
          aria-disabled={isDisabled || undefined}
          tabIndex={isDisabled ? -1 : undefined}
          {...(rest as ComponentPropsWithoutRef<"a">)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type={type ?? "button"}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {content}
      </button>
    );
  },
);
