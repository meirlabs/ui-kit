import {
  Fragment,
  forwardRef,
  useMemo,
  type ComponentPropsWithoutRef,
} from "react";
import { OTPInput, REGEXP_ONLY_DIGITS, type SlotProps } from "input-otp";
import { cn } from "../utils/cn";

export interface OtpInputProps
  extends Omit<
    ComponentPropsWithoutRef<"input">,
    | "size"
    | "value"
    | "defaultValue"
    | "onChange"
    | "maxLength"
    | "dir"
    | "children"
    | "pattern"
  > {
  /** Number of code characters (default 6). */
  length?: number;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Called with the new code string on every change. */
  onChange?: (value: string) => void;
  /** Called once the code reaches `length` characters. */
  onComplete?: (value: string) => void;
  /** Slot height: sm 32px · md 40px (default) · lg 48px. */
  size?: "sm" | "md" | "lg";
  /** Danger borders + active ring; also reflected as `aria-invalid`. */
  invalid?: boolean;
  /**
   * Partition the slots into groups with a dash between them (e.g. `[3, 3]`).
   * Must sum to `length`, otherwise it's ignored and one group is rendered.
   */
  groups?: number[];
  /**
   * Validation regex source for accepted characters. Defaults to digits only
   * (`REGEXP_ONLY_DIGITS`); pass `null` to accept any character (pair with
   * `inputMode="text"`).
   */
  pattern?: string | null;
  /** Caret/selection alignment inside the invisible input (input-otp passthrough). */
  textAlign?: "left" | "center" | "right";
  /**
   * How input-otp makes room for password-manager badges (1Password, LastPass…).
   * Default "increase-width" — leave it unless the badge overlap is handled elsewhere.
   */
  pushPasswordManagerStrategy?: "increase-width" | "none";
  /** Transform pasted text (e.g. strip spaces/dashes) before it's applied. */
  pasteTransformer?: (pasted: string) => string;
  /** Class for the outer wrapper. */
  className?: string;
  /** Class for input-otp's own slot container (rarely needed). */
  containerClassName?: string;
}

/** One rendered code box. Presentational — the real value lives in the hidden input. */
function OtpSlot({ char, isActive, hasFakeCaret, placeholderChar }: SlotProps) {
  return (
    <div className={cn("ml-otp-slot", isActive && "ml-otp-slot--active")}>
      {char ??
        (placeholderChar ? (
          <span className="ml-otp-placeholder">{placeholderChar}</span>
        ) : null)}
      {hasFakeCaret && (
        <div className="ml-otp-caret">
          <div className="ml-otp-caret-bar" />
        </div>
      )}
    </div>
  );
}

/**
 * OtpInput — one-time-code entry built on `input-otp`. A single invisible
 * `<input>` (which is what password managers, autofill, and screen readers
 * interact with) drives a row of presentational slot boxes. Controlled
 * (`value` + `onChange`) and uncontrolled (`defaultValue`) both work.
 * Forwards the ref to the underlying `<input>`.
 *
 * Codes always read left-to-right, so the container hardcodes `dir="ltr"`
 * even on RTL pages. Defaults: `inputMode="numeric"`,
 * `autoComplete="one-time-code"`, digits-only pattern.
 */
export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  function OtpInput(
    {
      length = 6,
      value,
      defaultValue,
      onChange,
      onComplete,
      size = "md",
      invalid,
      groups,
      pattern,
      textAlign,
      pushPasswordManagerStrategy,
      pasteTransformer,
      className,
      containerClassName,
      disabled,
      inputMode = "numeric",
      autoComplete = "one-time-code",
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) {
    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";

    const groupSizes = useMemo(() => {
      if (groups && groups.length > 0) {
        const total = groups.reduce((sum, n) => sum + n, 0);
        if (total === length) return groups;
        console.warn(
          `OtpInput: groups [${groups.join(", ")}] must sum to length ${length}; rendering a single group.`,
        );
      }
      return [length];
    }, [groups, length]);

    return (
      <div
        // OTP codes are always LTR, even on RTL (e.g. Hebrew) pages.
        dir="ltr"
        className={cn(
          "ml-otp",
          `ml-otp--${size}`,
          isInvalid && "ml-otp--invalid",
          disabled && "ml-otp--disabled",
          className,
        )}
      >
        <OTPInput
          ref={ref}
          maxLength={length}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onComplete={onComplete}
          disabled={disabled}
          inputMode={inputMode}
          autoComplete={autoComplete}
          pattern={
            pattern === null ? undefined : (pattern ?? REGEXP_ONLY_DIGITS)
          }
          textAlign={textAlign}
          pushPasswordManagerStrategy={pushPasswordManagerStrategy}
          pasteTransformer={pasteTransformer}
          aria-invalid={isInvalid || undefined}
          containerClassName={cn("ml-otp-container", containerClassName)}
          render={({ slots }) => {
            let cursor = 0;
            const grouped = groupSizes.map((n) =>
              slots.slice(cursor, (cursor += n)),
            );
            return (
              // The hidden <input> carries the value for AT; the slot boxes
              // only mirror it visually.
              <div className="ml-otp-track" aria-hidden="true">
                {grouped.map((groupSlots, groupIndex) => (
                  <Fragment key={groupIndex}>
                    {groupIndex > 0 && <div className="ml-otp-separator" />}
                    <div className="ml-otp-group">
                      {groupSlots.map((slot, slotIndex) => (
                        <OtpSlot key={slotIndex} {...slot} />
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
            );
          }}
          {...rest}
        />
      </div>
    );
  },
);
