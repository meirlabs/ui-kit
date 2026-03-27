import { useState } from "react";
import { Wizard } from "../../src/components/Wizard";

const stepLabels = ["Account", "Profile", "Preferences", "Review"];

export function WizardDemo() {
  const [current, setCurrent] = useState(0);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">4-step wizard</div>
        <Wizard
          steps={4}
          current={current}
          footer={
            <>
              <button
                className="ml-btn ml-btn-ghost"
                type="button"
                disabled={current === 0}
                onClick={() => setCurrent((c) => c - 1)}
              >
                Back
              </button>
              <span style={{ fontSize: "var(--ml-text-xs)", color: "var(--ml-text-muted)" }}>
                Step {current + 1} of 4 &mdash; {stepLabels[current]}
              </span>
              <button
                className="ml-btn ml-btn-primary"
                type="button"
                disabled={current === 3}
                onClick={() => setCurrent((c) => c + 1)}
              >
                {current === 3 ? "Finish" : "Next"}
              </button>
            </>
          }
        >
          <div
            style={{
              padding: "var(--ml-space-2xl)",
              textAlign: "center",
              color: "var(--ml-text-muted)",
              fontSize: "var(--ml-text-sm)",
            }}
          >
            Content for <strong>{stepLabels[current]}</strong> step goes here.
          </div>
        </Wizard>
      </div>
    </>
  );
}
