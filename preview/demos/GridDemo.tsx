import { Grid } from "../../src/components/Grid";
import { Card } from "../../src/components/Card";

const labelStyle = {
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  color: "var(--ml-text-muted)",
};

function Metric({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <Card>
      <span style={labelStyle}>{label}</span>
      <p
        style={{
          fontSize: 22,
          fontWeight: 600,
          marginTop: "var(--ml-space-xs)",
          color: tone,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </p>
    </Card>
  );
}

export function GridDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Auto-fit (minColWidth 200)</div>
        <Grid minColWidth={200} gap="lg">
          <Metric label="Balance" value="$4,200" />
          <Metric label="Profit" value="+$320" tone="var(--ml-color-success)" />
          <Metric label="Win Rate" value="68%" />
          <Metric label="Trades" value="142" />
        </Grid>
      </div>

      <div className="demo-section">
        <div className="demo-label">Fixed 3 columns · gap sm</div>
        <Grid columns={3} gap="sm">
          <Metric label="Open" value="12" />
          <Metric label="Closed" value="88" />
          <Metric label="Pending" value="3" />
        </Grid>
      </div>
    </>
  );
}
