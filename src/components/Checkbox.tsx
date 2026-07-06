import {
  forwardRef,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type"> {
  /** Mixed state — sets `input.indeterminate` on the real checkbox via ref. */
  indeterminate?: boolean;
  /** Inline label to the right of the box. */
  label?: ReactNode;
  /** Muted description below the label. */
  description?: ReactNode;
  /** Class for the outer `<label>` wrapper. */
  className?: string;
}

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}

/**
 * Checkbox — a real `<input type="checkbox">` (kept for a11y) visually replaced
 * by a monochrome box with an SVG check/dash. Controlled (`checked` +
 * `onChange`) and uncontrolled (`defaultChecked`) both work; `indeterminate` is
 * applied imperatively. The box carries a ≥44px hit area on touch.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      indeterminate = false,
      label,
      description,
      className,
      disabled,
      id,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    return (
      <label
        className={cn("ml-checkbox", disabled && "ml-checkbox--disabled", className)}
      >
        <span className="ml-checkbox-control">
          <input
            ref={mergeRefs(innerRef, ref)}
            id={id}
            type="checkbox"
            className="ml-checkbox-input"
            disabled={disabled}
            {...rest}
          />
          <span className="ml-checkbox-box" aria-hidden="true">
            <svg
              className="ml-checkbox-check"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.25 4.75 6.5 11.5 3.25 8.25"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="ml-checkbox-dash" />
          </span>
        </span>
        {(label || description) && (
          <span className="ml-checkbox-text">
            {label && <span className="ml-checkbox-label">{label}</span>}
            {description && (
              <span className="ml-checkbox-description">{description}</span>
            )}
          </span>
        )}
      </label>
    );
  },
);
