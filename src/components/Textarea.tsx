import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /** Grow the field to fit its content (between `minRows` and `maxRows`). */
  autoResize?: boolean;
  /** Lower bound for {@link autoResize}. Defaults to `rows` or 3. */
  minRows?: number;
  /** Upper bound for {@link autoResize}; beyond it the field scrolls. */
  maxRows?: number;
  /** Danger border + focus ring; also reflected as `aria-invalid`. */
  invalid?: boolean;
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
 * Textarea — native `<textarea>` matching the input tokens, with an optional
 * `autoResize` that grows to content between `minRows`/`maxRows`. Height is set
 * imperatively (no CSS transition) so growth never animates abruptly. Controlled
 * and uncontrolled both work; ref is forwarded.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      autoResize = false,
      minRows,
      maxRows,
      invalid,
      rows,
      className,
      disabled,
      readOnly,
      onInput,
      value,
      defaultValue,
      "aria-invalid": ariaInvalid,
      ...rest
    },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const isInvalid =
      invalid || ariaInvalid === true || ariaInvalid === "true";
    const floor = minRows ?? rows ?? 3;

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      const cs = getComputedStyle(el);
      const lineHeight = parseFloat(cs.lineHeight) || 20;
      const vPad =
        parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) || 0;
      const vBorder =
        parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth) || 0;
      const min = lineHeight * floor + vPad + vBorder;
      const max = maxRows
        ? lineHeight * maxRows + vPad + vBorder
        : Number.POSITIVE_INFINITY;
      const next = Math.min(Math.max(el.scrollHeight, min), max);
      el.style.height = `${next}px`;
      el.style.overflowY = el.scrollHeight > max ? "auto" : "hidden";
    }, [autoResize, floor, maxRows]);

    // Re-measure on mount and whenever the value changes (controlled or not).
    useEffect(() => {
      resize();
    }, [resize, value, defaultValue]);

    return (
      <textarea
        ref={mergeRefs(innerRef, ref)}
        className={cn(
          "ml-textarea",
          isInvalid && "ml-textarea--invalid",
          disabled && "ml-textarea--disabled",
          className,
        )}
        rows={autoResize ? floor : rows}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={isInvalid || undefined}
        value={value}
        defaultValue={defaultValue}
        onInput={(e) => {
          resize();
          onInput?.(e);
        }}
        {...rest}
      />
    );
  },
);
