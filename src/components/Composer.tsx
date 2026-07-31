import {
  forwardRef,
  useCallback,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Textarea } from "./Textarea";

/* ────────────────────────────────────────────────────────────────────────────
   Composer — the chat-composer pattern: an auto-growing textarea with an
   icon-only send button living INSIDE the field (bottom-right in ltr,
   bottom-left in rtl — the `dir` prop flips it). Growth is delegated to
   Textarea's `autoResize` (imperative height, never CSS-transitioned) and is
   never mouse-resizable. Enter sends; Shift+Enter (or IME composition)
   inserts a newline instead.
   ──────────────────────────────────────────────────────────────────────────── */

export interface ComposerProps
  extends Omit<
    ComponentPropsWithoutRef<"textarea">,
    "onChange" | "value" | "defaultValue" | "dir" | "rows"
  > {
  /** Current draft text (controlled — Composer never owns the value). */
  value: string;
  /** Fires on every keystroke/programmatic edit. */
  onChange: (value: string) => void;
  /** Fires on Enter (no Shift, not IME-composing) or a click on the send button. */
  onSend: (value: string) => void;
  /** Lower bound for the auto-grow, in rows. Default 1. */
  minRows?: number;
  /** Upper bound for the auto-grow, in rows — beyond it the field scrolls. Default 6. */
  maxRows?: number;
  /** Reading direction; flips the send button to the opposite corner. Default "ltr". */
  dir?: "ltr" | "rtl";
  /** Disables the field and the send button. */
  disabled?: boolean;
  /** Swaps the send button for a spinner and blocks Enter-to-send. */
  loading?: boolean;
  /** Accessible label for the send button. Default "Send". */
  sendLabel?: string;
  /** Override the default paper-plane send icon (icon-agnostic ReactNode). */
  sendIcon?: ReactNode;
  className?: string;
}

const DefaultSendIcon = (
  <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
    <path
      d="M14 2 6.5 9.5M14 2 9.5 14 6.5 9.5M14 2 2 6.5 6.5 9.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Composer — see file header. Controlled like every other kit input:
 * `value`/`onChange` own the draft, `onSend` fires the submit intent (the
 * caller clears the draft itself, mirroring Input/Textarea's contract).
 */
export const Composer = forwardRef<HTMLTextAreaElement, ComposerProps>(
  function Composer(
    {
      value,
      onChange,
      onSend,
      minRows = 1,
      maxRows = 6,
      dir = "ltr",
      disabled = false,
      loading = false,
      sendLabel = "Send",
      sendIcon = DefaultSendIcon,
      placeholder,
      className,
      onKeyDown,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) {
    const canSend = value.trim().length > 0 && !disabled && !loading;

    const send = useCallback(() => {
      if (!canSend) return;
      onSend(value);
    }, [canSend, onSend, value]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLTextAreaElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
          e.preventDefault();
          send();
        }
      },
      [onKeyDown, send],
    );

    return (
      <div className={cn("ml-composer", className)} dir={dir}>
        <Textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={ariaLabel ?? placeholder}
          disabled={disabled}
          autoResize
          minRows={minRows}
          maxRows={maxRows}
          className="ml-composer-field"
          {...rest}
        />
        <div className="ml-composer-send">
          <Button
            type="button"
            variant="icon"
            size="sm"
            aria-label={sendLabel}
            loading={loading}
            disabled={!canSend}
            onClick={send}
          >
            {sendIcon}
          </Button>
        </div>
      </div>
    );
  },
);
