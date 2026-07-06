import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";

export type StepperStatus = "complete" | "current" | "upcoming";

export interface StepperStep {
  label: ReactNode;
  description?: ReactNode;
  /** Overrides the status derived from `activeStep`. */
  status?: StepperStatus;
}

export interface StepperProps extends ComponentPropsWithoutRef<"ol"> {
  steps: StepperStep[];
  /** 0-indexed active step; used to derive status when a step has none. */
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
}

function statusFor(
  step: StepperStep,
  index: number,
  activeStep: number,
): StepperStatus {
  if (step.status) return step.status;
  if (index < activeStep) return "complete";
  if (index === activeStep) return "current";
  return "upcoming";
}

/**
 * Stepper — a monochrome, ordered visual step indicator (distinct from the
 * Wizard's progress logic). Numbered circles — complete = filled charcoal +
 * check, current = ring, upcoming = muted — joined by connector lines. Renders
 * an `<ol>`; the current step is `aria-current="step"`.
 */
export function Stepper({
  steps,
  activeStep = 0,
  orientation = "horizontal",
  className,
  ...rest
}: StepperProps) {
  return (
    <ol
      className={cn("ml-stepper", `ml-stepper--${orientation}`, className)}
      {...rest}
    >
      {steps.map((step, i) => {
        const status = statusFor(step, i, activeStep);
        const isLast = i === steps.length - 1;
        return (
          <li
            key={i}
            className={cn("ml-stepper-item", `ml-stepper-item--${status}`)}
            aria-current={status === "current" ? "step" : undefined}
          >
            <div className="ml-stepper-marker">
              <span className="ml-stepper-circle">
                {status === "complete" ? (
                  <svg
                    className="ml-stepper-check"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M13.25 4.75 6.5 11.5 3.25 8.25"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span className="ml-stepper-number">{i + 1}</span>
                )}
              </span>
              {!isLast && <span className="ml-stepper-connector" aria-hidden="true" />}
            </div>
            <div className="ml-stepper-content">
              <span className="ml-stepper-label">{step.label}</span>
              {step.description && (
                <span className="ml-stepper-description">{step.description}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
