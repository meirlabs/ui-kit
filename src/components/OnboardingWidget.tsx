import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { Progress } from "./Progress";

/** A single onboarding step. State is data-driven — the widget is controlled. */
export interface OnboardingStep {
  /** Stable identifier, passed back to `onStepAction`. */
  id: string;
  /** Step headline. */
  title: ReactNode;
  /** Optional one-line explainer under the title. */
  description?: ReactNode;
  /** Whether the step is done. Drives the marker + progress count. */
  completed?: boolean;
  /**
   * Optional marker for the *incomplete* state (icon-agnostic ReactNode).
   * Completed steps always show the built-in check. Omit to fall back to the
   * step's ordinal number.
   */
  icon?: ReactNode;
  /** Optional per-step call-to-action. Clicking it fires `onStepAction`. */
  action?: OnboardingStepAction;
}

/** A per-step call-to-action. Renders as a small secondary `Button`. */
export interface OnboardingStepAction {
  /** Button label. */
  label: ReactNode;
  /** Render the CTA as a link (`<a href>`) instead of a button. */
  href?: string;
  /** Show the CTA even when the step is already complete. Defaults to false. */
  showWhenComplete?: boolean;
}

export interface OnboardingWidgetProps
  extends Omit<ComponentPropsWithoutRef<"section">, "title" | "onChange"> {
  /** Card heading. Defaults to "Get started". */
  title?: ReactNode;
  /** Optional muted subheading under the title. */
  description?: ReactNode;
  /** The checklist. Steps and their `completed` state come in via props. */
  steps: OnboardingStep[];
  /** Fires when a step's CTA is activated, with the step id and its index. */
  onStepAction?: (stepId: string, index: number) => void;
  /** When provided, renders a dismiss button (matches `Banner`'s convention). */
  onDismiss?: () => void;
  /** Hide the progress indicator (count + bar). Defaults to false. */
  hideProgress?: boolean;
  /**
   * Renders the progress summary. Defaults to `"{done} of {total} complete"`.
   */
  progressLabel?: (done: number, total: number) => ReactNode;
}

/** Self-contained check — keeps the library icon-dependency-free. */
function CheckIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2.5 7.5 6 11l5.5-6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Self-contained X — matches `Banner`'s dismiss glyph. */
function DismissIcon() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M3.5 3.5l7 7M10.5 3.5l-7 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * OnboardingWidget — a data-driven onboarding checklist card. Shows a progress
 * summary ("2 of 4 complete" + a bar) over a list of steps, each with a
 * completed/incomplete marker, an optional description, and an optional CTA.
 *
 * Controlled: `steps` and their `completed` flags come in via props; the widget
 * renders them and emits `onStepAction(id, index)` when a step's CTA fires. No
 * shadow at rest (card rule): border + surface only. Icons are `ReactNode`
 * props — the kit stays icon-agnostic. Works in light + dark.
 *
 * ```tsx
 * <OnboardingWidget
 *   title="Set up your workspace"
 *   steps={[
 *     { id: "profile", title: "Complete your profile", completed: true },
 *     { id: "invite", title: "Invite a teammate", action: { label: "Invite" } },
 *   ]}
 *   onStepAction={(id) => go(id)}
 *   onDismiss={() => hide()}
 * />
 * ```
 */
export const OnboardingWidget = forwardRef<HTMLElement, OnboardingWidgetProps>(
  function OnboardingWidget(
    {
      title = "Get started",
      description,
      steps,
      onStepAction,
      onDismiss,
      hideProgress = false,
      progressLabel,
      className,
      ...rest
    },
    ref,
  ) {
    const total = steps.length;
    const done = steps.reduce((n, s) => n + (s.completed ? 1 : 0), 0);
    const allComplete = total > 0 && done === total;
    const summary = progressLabel
      ? progressLabel(done, total)
      : `${done} of ${total} complete`;

    return (
      <section
        ref={ref}
        className={cn("ml-onboarding", className)}
        data-state={allComplete ? "complete" : "incomplete"}
        aria-label={typeof title === "string" ? title : "Onboarding"}
        {...rest}
      >
        <header className="ml-onboarding-head">
          <div className="ml-onboarding-heading">
            <h3 className="ml-onboarding-title">{title}</h3>
            {description != null && (
              <p className="ml-onboarding-desc">{description}</p>
            )}
          </div>
          {onDismiss && (
            <button
              type="button"
              className="ml-onboarding-dismiss"
              aria-label="Dismiss"
              onClick={onDismiss}
            >
              <DismissIcon />
            </button>
          )}
        </header>

        {!hideProgress && total > 0 && (
          <div className="ml-onboarding-progress">
            <div className="ml-onboarding-progress-summary">{summary}</div>
            <Progress
              value={done}
              max={total}
              size="sm"
              tone={allComplete ? "success" : "neutral"}
              aria-label="Onboarding progress"
            />
          </div>
        )}

        <ol className="ml-onboarding-steps">
          {steps.map((step, index) => {
            const completed = Boolean(step.completed);
            const showAction =
              step.action != null &&
              (!completed || step.action.showWhenComplete === true);

            return (
              <li
                key={step.id}
                className="ml-onboarding-step"
                data-state={completed ? "complete" : "incomplete"}
              >
                <span className="ml-onboarding-step-marker" aria-hidden="true">
                  {completed ? (
                    <CheckIcon />
                  ) : step.icon != null ? (
                    step.icon
                  ) : (
                    <span className="ml-onboarding-step-index">{index + 1}</span>
                  )}
                </span>

                <div className="ml-onboarding-step-body">
                  <div className="ml-onboarding-step-title">{step.title}</div>
                  {step.description != null && (
                    <div className="ml-onboarding-step-desc">
                      {step.description}
                    </div>
                  )}
                </div>

                {showAction && step.action != null && (
                  <div className="ml-onboarding-step-action">
                    <Button
                      variant="secondary"
                      size="sm"
                      href={step.action.href}
                      onClick={() => onStepAction?.(step.id, index)}
                    >
                      {step.action.label}
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    );
  },
);
