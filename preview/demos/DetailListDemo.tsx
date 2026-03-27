import { DetailList } from "../../src/components/DetailList";

export function DetailListDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Key/value pairs</div>
        <DetailList
          items={[
            { label: "Status", value: "Active" },
            { label: "Created", value: "2025-12-01" },
            { label: "Domain", value: "Polymarket" },
            { label: "Strategy", value: "Momentum" },
            { label: "Balance", value: "$4,200.00" },
            { label: "Win Rate", value: "68%" },
          ]}
        />
      </div>
    </>
  );
}
