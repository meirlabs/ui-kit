import { useState } from "react";
import { Wizard } from "../../src/components/Wizard";

const stepTitles = ["Account", "Profile", "Preferences", "Review"];

export function WizardDemo() {
  const [current, setCurrent] = useState(0);
  const [gated, setGated] = useState(1);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Built-in footer + step titles (monochrome progress)
        </div>
        <Wizard
          steps={stepTitles.length}
          current={current}
          stepTitles={stepTitles}
          onStepChange={setCurrent}
          aria-label="Account setup"
        >
          <div
            style={{
              padding: "var(--ml-space-2xl)",
              textAlign: "center",
              color: "var(--ml-text-muted)",
              fontSize: "14px",
            }}
          >
            Content for <strong>{stepTitles[current]}</strong> goes here.
          </div>
        </Wizard>
      </div>

      <div className="demo-section">
        <div className="demo-label">
          Validation gate — advancing past step 2 is blocked
        </div>
        <Wizard
          steps={stepTitles.length}
          current={gated}
          stepTitles={stepTitles}
          onStepChange={setGated}
          onValidateStep={(step) => {
            if (step === 1) {
              // eslint-disable-next-line no-alert
              return false; // pretend validation failed on the Profile step
            }
            return true;
          }}
        >
          <div
            style={{
              padding: "var(--ml-space-2xl)",
              textAlign: "center",
              color: "var(--ml-text-muted)",
              fontSize: "14px",
            }}
          >
            {gated === 1
              ? "Next is gated here — onValidateStep returns false."
              : `On step: ${stepTitles[gated]}`}
          </div>
        </Wizard>
      </div>
    </>
  );
}
