import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export interface WizardProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  /** Total number of steps. */
  steps: number;
  /** Current step, 0-indexed. */
  current: number;
  children: ReactNode;
  /** Custom footer. When omitted and `onStepChange` is set, a Back/Next footer
   *  is rendered for you (gated by {@link onValidateStep}). */
  footer?: ReactNode;
  /** Optional per-step titles; shown as a label row + `aria-label` on progress. */
  stepTitles?: string[];
  /** Advance/retreat callback for the built-in footer (controllable primitive). */
  onStepChange?: (next: number) => void;
  /** Gate hook run before advancing; return/resolve `false` to block. */
  onValidateStep?: (current: number) => boolean | Promise<boolean>;
  /** Accessible name for the whole flow. */
  "aria-label"?: string;
}

/**
 * Wizard — a monochrome step-progress bar over arbitrary step content. The
 * progress track is a `role="progressbar"` (`aria-valuenow/min/max`) with a
 * visually-hidden "Step X of Y". Filled segments use `--ml-text`, never an
 * accent color. Footer navigation stays consumer-driven, but a default
 * Back/Next footer (with an optional validation gate) is provided when you pass
 * `onStepChange`.
 */
export function Wizard({
  steps,
  current,
  className,
  children,
  footer,
  stepTitles,
  onStepChange,
  onValidateStep,
  "aria-label": ariaLabel,
  ...rest
}: WizardProps) {
  const clampedCurrent = Math.min(Math.max(current, 0), steps - 1);
  const stepNumber = clampedCurrent + 1;
  const currentTitle = stepTitles?.[clampedCurrent];

  const goBack = () => {
    if (clampedCurrent <= 0) return;
    onStepChange?.(clampedCurrent - 1);
  };

  const goNext = async () => {
    if (clampedCurrent >= steps - 1) return;
    if (onValidateStep) {
      const ok = await onValidateStep(clampedCurrent);
      if (!ok) return;
    }
    onStepChange?.(clampedCurrent + 1);
  };

  const showDefaultFooter = footer === undefined && onStepChange !== undefined;

  return (
    <div className={cn("ml-wizard", className)} {...rest}>
      <div
        className="ml-wizard-progress"
        role="progressbar"
        aria-valuenow={stepNumber}
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-label={
          ariaLabel ??
          (currentTitle ? `${currentTitle} — progress` : "Wizard progress")
        }
      >
        <span className="ml-visually-hidden">
          Step {stepNumber} of {steps}
          {currentTitle ? `: ${currentTitle}` : ""}
        </span>
        {Array.from({ length: steps }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={cn("ml-wizard-segment", i <= clampedCurrent && "filled")}
          />
        ))}
      </div>

      {stepTitles && stepTitles.length > 0 && (
        <div className="ml-wizard-steps" aria-hidden="true">
          {stepTitles.map((title, i) => (
            <span
              key={title + i}
              className={cn(
                "ml-wizard-step-title",
                i === clampedCurrent && "current",
                i < clampedCurrent && "done",
              )}
            >
              {title}
            </span>
          ))}
        </div>
      )}

      {children}

      {footer !== undefined && <div className="ml-wizard-footer">{footer}</div>}
      {showDefaultFooter && (
        <div className="ml-wizard-footer">
          <button
            type="button"
            className="ml-btn ml-btn-ghost"
            disabled={clampedCurrent === 0}
            onClick={goBack}
          >
            Back
          </button>
          <button
            type="button"
            className="ml-btn ml-btn-primary"
            disabled={clampedCurrent >= steps - 1}
            onClick={goNext}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
