import { MetricValue } from "../../src/components/MetricValue";

const money = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    signDisplay: "exceptZero",
  }).format(v);

const percent = (v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

export function MetricValueDemo() {
  return (
    <>
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
