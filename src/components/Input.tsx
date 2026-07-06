import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export interface InputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "size" | "prefix"> {
  /** Control height: sm 32px · md 40px (default) · lg 48px. */
  size?: "sm" | "md" | "lg";
  /** Leading 20px icon slot (decorative — receives `aria-hidden`). */
  leftIcon?: ReactNode;
  /** Trailing 20px icon slot. */
  rightIcon?: ReactNode;
  /** Danger border + focus ring; also reflected as `aria-invalid`. */
  invalid?: boolean;
  /** Inline leading adornment (e.g. `https://`, `$`). */
  prefix?: ReactNode;
  /** Inline trailing adornment (e.g. `.com`, units). */
  suffix?: ReactNode;
  /** Class for the inner `<input>`. */
  className?: string;
  /** Class for the outer wrapper (border/background live here). */
  wrapperClassName?: string;
}

/**
 * Input — a native `<input>` in a bordered shell that owns the focus ring and
 * hosts icon / prefix / suffix slots. Controlled (`value` + `onChange`) and
 * uncontrolled (`defaultValue`) both work natively. Forwards the ref to the
 * underlying `<input>`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    size = "md",
    leftIcon,
    rightIcon,
    invalid,
    prefix,
    suffix,
    className,
    wrapperClassName,
    disabled,
    readOnly,
    "aria-invalid": ariaInvalid,
    ...rest
  },
  ref,
) {
  const isInvalid =
    invalid || ariaInvalid === true || ariaInvalid === "true";

  return (
    <div
      className={cn(
        "ml-input",
        `ml-input--${size}`,
        isInvalid && "ml-input--invalid",
        disabled && "ml-input--disabled",
        readOnly && "ml-input--readonly",
        wrapperClassName,
      )}
    >
      {leftIcon && (
        <span className="ml-input-icon ml-input-icon--left" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {prefix && <span className="ml-input-affix ml-input-affix--prefix">{prefix}</span>}
      <input
        ref={ref}
        className={cn("ml-input-field", className)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={isInvalid || undefined}
        {...rest}
      />
      {suffix && <span className="ml-input-affix ml-input-affix--suffix">{suffix}</span>}
      {rightIcon && (
        <span className="ml-input-icon ml-input-icon--right" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </div>
  );
});
