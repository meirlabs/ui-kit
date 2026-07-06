import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

const toneClass = {
  neutral: "ml-tag-neutral",
  success: "ml-tag-success",
  warning: "ml-tag-warning",
  danger: "ml-tag-danger",
} as const;

export type TagTone = keyof typeof toneClass;

export interface TagProps extends ComponentPropsWithoutRef<"span"> {
  /** Tone. Defaults to `neutral` (gray) — not a universal color tint. */
  tone?: TagTone;
  /** Visual size. Defaults to `md`. */
  size?: "sm" | "md";
  /** When provided, renders a trailing × icon-button that calls this on click. */
  onRemove?: () => void;
  /**
   * Accessible label for the remove button. Defaults to `Remove {children}`
   * when children is a string, otherwise `Remove`.
   */
  removeLabel?: string;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = "neutral", size = "md", onRemove, removeLabel, className, children, ...rest },
  ref,
) {
  const label =
    removeLabel ?? (typeof children === "string" ? `Remove ${children}` : "Remove");

  return (
    <span
      ref={ref}
      className={cn(
        "ml-tag",
        toneClass[tone],
        size === "sm" ? "ml-tag-sm" : "ml-tag-md",
        className,
      )}
      {...rest}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          className="ml-tag-remove"
          aria-label={label}
          onClick={onRemove}
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </span>
  );
});
