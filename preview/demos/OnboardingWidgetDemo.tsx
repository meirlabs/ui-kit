import { useState } from "react";
import {
  OnboardingWidget,
  type OnboardingStep,
} from "../../src/components/OnboardingWidget";

const INITIAL: OnboardingStep[] = [
  {
    id: "profile",
    title: "Complete your profile",
    description: "Add a name and avatar so teammates recognize you.",
    completed: true,
  },
  {
    id: "workspace",
    title: "Name your workspace",
    description: "Pick a name and URL for your team.",
    completed: true,
  },
  {
    id: "connect",
    title: "Connect a data source",
    description: "Sync from Postgres, Stripe, or a CSV to see live numbers.",
    completed: false,
    action: { label: "Connect" },
  },
  {
    id: "invite",
    title: "Invite a teammate",
    description: "Onboarding is better together.",
    completed: false,
    action: { label: "Invite" },
  },
];

export function OnboardingWidgetDemo() {
  const [steps, setSteps] = useState(INITIAL);
  const [dismissed, setDismissed] = useState(false);

  function complete(id: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: true } : s)),
    );
  }

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Onboarding checklist — click a step's CTA to mark it done
        </div>
        <div style={{ maxWidth: 480 }}>
          {dismissed ? (
            <button className="ml-btn ml-btn-secondary ml-btn-size-sm" onClick={() => setDismissed(false)}>
              Restore widget
            </button>
          ) : (
            <OnboardingWidget
              title="Set up your workspace"
              description="A few steps to get the most out of the product."
              steps={steps}
              onStepAction={(id) => complete(id)}
              onDismiss={() => setDismissed(true)}
            />
          )}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">All steps complete (success tone)</div>
        <div style={{ maxWidth: 480 }}>
          <OnboardingWidget
            title="You're all set"
            steps={INITIAL.map((s) => ({ ...s, completed: true, action: undefined }))}
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Minimal — no progress bar, no descriptions</div>
        <div style={{ maxWidth: 480 }}>
          <OnboardingWidget
            title="Quick start"
            hideProgress
            steps={[
              { id: "a", title: "Verify your email", completed: true },
              { id: "b", title: "Create your first project", action: { label: "Create" } },
              { id: "c", title: "Read the docs", action: { label: "Open", href: "#docs" } },
            ]}
          />
        </div>
      </div>
    </>
  );
}
