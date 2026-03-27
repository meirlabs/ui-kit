import { Banner } from "../../src/components/Banner";

export function BannerDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Banner tone="info">This is an informational message.</Banner>
          <Banner tone="warning">Proceed with caution — this action has side effects.</Banner>
          <Banner tone="error">Something went wrong. Please try again.</Banner>
        </div>
      </div>
    </>
  );
}
