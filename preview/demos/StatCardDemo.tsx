import { StatCard } from "../../src/components/StatCard";

export function StatCardDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Stat cards with deltas (functional color only)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <StatCard value="$12,480" label="Total Revenue" delta={18} deltaFormatter={(v) => `${v}%`} />
          <StatCard value="1,234" label="Active Users" delta={-4} deltaFormatter={(v) => `${Math.abs(v)}%`} />
          <StatCard value="98.2%" label="Uptime" delta={0} trend="neutral" deltaFormatter={() => "flat"} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Tabular alignment (values line up as digits change)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <StatCard value="9" label="Open Tickets" />
          <StatCard value="10,842" label="Requests / min" />
          <StatCard value="1,000,000" label="Total Events" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Loading (skeleton reserves value height)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <StatCard value="—" label="Total Revenue" loading />
          <StatCard value="—" label="Active Users" loading />
          <StatCard value="—" label="Growth Rate" loading />
        </div>
      </div>
    </>
  );
}
