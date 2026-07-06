import { useState } from "react";
import { MetricValue } from "../../src/components/MetricValue";

const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "exceptZero",
  }).format(v);

const percent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

// Absolute-value formatter for deltas — the arrow already conveys direction.
const pct = (v: number) => `${Math.abs(v).toFixed(1)}%`;

// Cycles through widening magnitudes to prove tabular-nums keeps the ones
// column fixed as 9 → 10 → 100 → 1,000 ...
const STEPS = [9, 10, 100, 1000, 12500];

export function MetricValueDemo() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tabular alignment (9 → 10 → 100)</div>
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "4px",
            padding: "12px 16px",
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-lg)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {STEPS.map((n) => (
            <MetricValue key={n} value={n} formatter={money} />
          ))}
        </div>
        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            type="button"
            className="ml-btn ml-btn-secondary"
            onClick={() => setStep((s) => (s + 1) % STEPS.length)}
          >
            Advance value
          </button>
          <MetricValue value={current} formatter={money} />
        </div>
        <p style={{ marginTop: "8px", fontSize: "13px", color: "var(--ml-text-muted)" }}>
          Each digit occupies the same width, so growing magnitudes never nudge
          neighbors or the currency sign.
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">With delta (arrow carries the sign)</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <MetricValue value={12500} formatter={money} delta={8.2} deltaFormatter={pct} />
          <MetricValue value={9800} formatter={money} delta={-3.4} deltaFormatter={pct} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Currency formatter</div>
        <div className="demo-row">
          <MetricValue value={12500} formatter={money} />
          <MetricValue value={-3200} formatter={money} />
          <MetricValue value={0} formatter={money} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Percent formatter</div>
        <div className="demo-row">
          <MetricValue value={8.5} formatter={percent} />
          <MetricValue value={-2.3} formatter={percent} />
          <MetricValue value={0} formatter={percent} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Default (no formatter)</div>
        <div className="demo-row">
          <MetricValue value={42} />
          <MetricValue value={-17} />
          <MetricValue value={0} />
        </div>
      </div>
    </>
  );
}
