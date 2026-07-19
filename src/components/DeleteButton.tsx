import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export type DeleteButtonPhase = "idle" | "confirm" | "loading" | "done";
export type DeleteButtonSize = "sm" | "md" | "lg";

export interface DeleteButtonProps
  extends Omit<
    ComponentPropsWithoutRef<"button">,
    "children" | "onClick" | "onDelete"
  > {
  /** Idle-state label. Default "Delete". */
  label?: ReactNode;
  /** Armed label shown after the first click, asking for confirmation. Default "Confirm delete". */
  confirmLabel?: ReactNode;
  /** Pending-state label while `onDelete` is in flight. Default "Deleting…". */
  loadingLabel?: ReactNode;
  /** Terminal label shown briefly after `onDelete` resolves. Default "Deleted". */
  doneLabel?: ReactNode;
  /**
   * Fired on the second click (confirmation). May return a promise — the
   * button stays in `loading` until it settles, then shows `done`. A
   * rejection reverts to `idle` (the delete is presumed to have failed).
   */
  onDelete: () => void | Promise<void>;
  /** Row height: sm 32 · md 40 · lg 48 — matches `Button`. Default "md". */
  size?: DeleteButtonSize;
  /** Ms the armed `confirm` state stays live before auto-reverting to idle. Default 4000. */
  confirmTimeoutMs?: number;
  /** Ms the terminal `done` state is shown before resetting to idle. Default 1200. */
  doneTimeoutMs?: number;
  /** Read the current phase (idle/confirm/loading/done) as it changes. */
  onPhaseChange?: (phase: DeleteButtonPhase) => void;
}

const PHASE_ANNOUNCEMENT: Record<DeleteButtonPhase, string> = {
  idle: "",
  confirm: "Press again to confirm delete",
  loading: "Deleting",
  done: "Deleted",
};

/**
 * DeleteButton — a polished, no-modal destructive-action control. First
 * click arms it (morphs to a danger-filled confirm label with an auto-revert
 * countdown bar); the second click within the window fires `onDelete` and
 * morphs through `loading` (spinner) to `done` (checkmark) before resetting.
 * Escape or blur while armed cancels back to `idle`. Width morphs between
 * labels via measured px transitions — the one deliberate exception to the
 * kit's "metrics never shift between states" rule, since the morph *is* the
 * pattern (design/foundation/motion.md). Fully `prefers-reduced-motion`-safe
 * and keyboard accessible.
 */
export const DeleteButton = forwardRef<HTMLButtonElement, DeleteButtonProps>(
  function DeleteButton(
    {
      label = "Delete",
      confirmLabel = "Confirm delete",
      loadingLabel = "Deleting…",
      doneLabel = "Deleted",
      onDelete,
      size = "md",
      confirmTimeoutMs = 4000,
      doneTimeoutMs = 1200,
      onPhaseChange,
      className,
      disabled,
      onKeyDown,
      onBlur,
      ...rest
    },
    forwardedRef,
  ) {
    const [phase, setPhase] = useState<DeleteButtonPhase>("idle");
    const btnRef = useRef<HTMLButtonElement | null>(null);

    const setRefs = (node: HTMLButtonElement | null) => {
      btnRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    };

    useEffect(() => {
      onPhaseChange?.(phase);
    }, [phase, onPhaseChange]);

    // Auto-revert the armed state if the user never confirms.
    useEffect(() => {
      if (phase !== "confirm") return;
      const id = setTimeout(() => setPhase("idle"), confirmTimeoutMs);
      return () => clearTimeout(id);
    }, [phase, confirmTimeoutMs]);

    // Auto-reset after a successful delete finishes its checkmark beat.
    useEffect(() => {
      if (phase !== "done") return;
      const id = setTimeout(() => setPhase("idle"), doneTimeoutMs);
      return () => clearTimeout(id);
    }, [phase, doneTimeoutMs]);

    // Width morph: capture the current rendered width, let content update,
    // then measure the new natural width and transition to it. Cheap and
    // reliable across browsers vs. animating `width: auto` directly.
    useLayoutEffect(() => {
      const btn = btnRef.current;
      if (!btn) return;
      const startWidth = btn.getBoundingClientRect().width;
      btn.style.width = "auto";
      const endWidth = btn.getBoundingClientRect().width;
      btn.style.width = `${startWidth}px`;
      void btn.offsetWidth; // force reflow so the width above takes effect first
      const frame = requestAnimationFrame(() => {
        btn.style.width = `${endWidth}px`;
      });
      return () => cancelAnimationFrame(frame);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    function handleTransitionEnd(e: React.TransitionEvent<HTMLButtonElement>) {
      if (e.target !== e.currentTarget || e.propertyName !== "width") return;
      e.currentTarget.style.width = "";
    }

    function confirmDelete() {
      setPhase("loading");
      let result: void | Promise<void>;
      try {
        result = onDelete();
      } catch {
        setPhase("idle");
        return;
      }
      Promise.resolve(result)
        .then(() => setPhase("done"))
        .catch(() => setPhase("idle"));
    }

    function handleClick() {
      if (phase === "idle") setPhase("confirm");
      else if (phase === "confirm") confirmDelete();
    }

    function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;
      if (e.key === "Escape" && phase === "confirm") {
        setPhase("idle");
      }
    }

    function handleBlur(e: React.FocusEvent<HTMLButtonElement>) {
      onBlur?.(e);
      if (phase === "confirm") setPhase("idle");
    }

    const isBusy = phase === "loading";
    const isInert = disabled || isBusy || phase === "done";
    const content =
      phase === "confirm"
        ? confirmLabel
        : phase === "loading"
          ? loadingLabel
          : phase === "done"
            ? doneLabel
            : label;

    return (
      <>
        <button
          ref={setRefs}
          type="button"
          className={cn(
            "ml-btn",
            "ml-delete-btn",
            `ml-btn-size-${size}`,
            `ml-delete-btn-${phase}`,
            className,
          )}
          disabled={isInert}
          aria-busy={isBusy || undefined}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onTransitionEnd={handleTransitionEnd}
          {...rest}
        >
          <span className="ml-delete-btn-icon-slot" aria-hidden="true">
            {phase === "loading" ? (
              <span className="ml-delete-btn-spinner" />
            ) : phase === "done" ? (
              <CheckIcon />
            ) : phase === "confirm" ? (
              <CheckIcon />
            ) : (
              <TrashIcon />
            )}
          </span>
          <span className="ml-delete-btn-label">{content}</span>
          {phase === "confirm" && (
            <span
              className="ml-delete-btn-countdown"
              style={{ animationDuration: `${confirmTimeoutMs}ms` }}
            />
          )}
        </button>
        {/* Kept outside the button so it doesn't pollute the button's
            accessible name — a separate live region, not part of the label. */}
        <span className="ml-visually-hidden" role="status" aria-live="polite">
          {PHASE_ANNOUNCEMENT[phase]}
        </span>
      </>
    );
  },
);

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 3.5H11.5M5.25 3.5V2.25C5.25 1.83579 5.58579 1.5 6 1.5H8C8.41421 1.5 8.75 1.83579 8.75 2.25V3.5M6 6.25V9.75M8 6.25V9.75M3.25 3.5L3.75 11.25C3.79142 11.9404 4.36579 12.5 5.05833 12.5H8.94167C9.63421 12.5 10.2086 11.9404 10.25 11.25L10.75 3.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.25L5.5 10.25L11.5 3.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
