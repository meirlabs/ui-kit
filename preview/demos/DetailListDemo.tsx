import { DetailList } from "../../src/components/DetailList";
import { Card } from "../../src/components/Card";

export function DetailListDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Two columns, copy affordance, full-width row</div>
        <Card>
          <DetailList
            columns={2}
            items={[
              { label: "Status", value: "Active" },
              { label: "Created", value: "2025-12-01" },
              { label: "Domain", value: "Polymarket" },
              { label: "Strategy", value: "Momentum" },
              {
                label: "API Key",
                value: "sk_live_9f2c1a7b4e",
                copyValue: "sk_live_9f2c1a7b4e",
                fullWidth: true,
              },
            ]}
          />
        </Card>
      </div>

      <div className="demo-section">
        <div className="demo-label">Single column (drawer / narrow)</div>
        <Card style={{ maxWidth: 320 }}>
          <DetailList
            columns={1}
            items={[
              { label: "Balance", value: "$4,200.00" },
              { label: "Win Rate", value: "68%" },
              {
                label: "Wallet",
                value: "0x71C…4f2A",
                onCopy: (v) => alert(`copy: ${v}`),
                copyValue: "0x71C0000000000000000000000000000000004f2A",
              },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
