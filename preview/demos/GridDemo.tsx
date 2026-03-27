import { Grid } from "../../src/components/Grid";
import { Card } from "../../src/components/Card";

export function GridDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Responsive grid with cards</div>
        <Grid>
          <Card>
            <strong style={{ fontSize: "var(--ml-text-xs)", color: "var(--ml-text-faint)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Balance</strong>
            <p style={{ fontSize: "var(--ml-text-xl)", fontWeight: 700, marginTop: "var(--ml-space-xs)" }}>$4,200</p>
          </Card>
          <Card>
            <strong style={{ fontSize: "var(--ml-text-xs)", color: "var(--ml-text-faint)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Profit</strong>
            <p style={{ fontSize: "var(--ml-text-xl)", fontWeight: 700, marginTop: "var(--ml-space-xs)", color: "var(--ml-color-success)" }}>+$320</p>
          </Card>
          <Card>
            <strong style={{ fontSize: "var(--ml-text-xs)", color: "var(--ml-text-faint)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Win Rate</strong>
            <p style={{ fontSize: "var(--ml-text-xl)", fontWeight: 700, marginTop: "var(--ml-space-xs)" }}>68%</p>
          </Card>
          <Card>
            <strong style={{ fontSize: "var(--ml-text-xs)", color: "var(--ml-text-faint)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Trades</strong>
            <p style={{ fontSize: "var(--ml-text-xl)", fontWeight: 700, marginTop: "var(--ml-space-xs)" }}>142</p>
          </Card>
        </Grid>
      </div>
    </>
  );
}
