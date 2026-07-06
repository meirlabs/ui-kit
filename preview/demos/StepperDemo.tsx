import { useState } from "react";
import { Stepper } from "../../src/components/Stepper";

const steps = [
  { label: "Cart", description: "Review your items" },
  { label: "Shipping", description: "Address & method" },
  { label: "Payment", description: "Card details" },
  { label: "Confirm", description: "Place the order" },
];

export function StepperDemo() {
  const [active, setActive] = useState(1);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Horizontal</div>
        <Stepper steps={steps} activeStep={active} />
        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <button
            type="button"
            className="ml-btn ml-btn-ghost"
            disabled={active === 0}
            onClick={() => setActive((s) => s - 1)}
          >
            Back
          </button>
          <button
            type="button"
            className="ml-btn ml-btn-primary"
            disabled={active === steps.length - 1}
            onClick={() => setActive((s) => s + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Vertical</div>
        <Stepper steps={steps} activeStep={active} orientation="vertical" />
      </div>

      <div className="demo-section">
        <div className="demo-label">Explicit per-step status</div>
        <Stepper
          activeStep={0}
          steps={[
            { label: "Draft", status: "complete" },
            { label: "In review", status: "current" },
            { label: "Approved", status: "upcoming" },
            { label: "Published", status: "upcoming" },
          ]}
        />
      </div>
    </>
  );
}
