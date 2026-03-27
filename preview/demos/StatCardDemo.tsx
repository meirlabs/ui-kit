import { StatCard } from "../../src/components/StatCard";

export function StatCardDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Stat cards</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <StatCard value="$12,480" label="Total Revenue" />
          <StatCard value="1,234" label="Active Users" />
          <StatCard
            value={<span style={{ color: "var(--ml-color-success)" }}>+18.2%</span>}
            label="Growth Rate"
          />
        </div>
      </div>
    </>
  );
}
