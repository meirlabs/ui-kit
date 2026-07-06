import { useState } from "react";
import { Banner } from "../../src/components/Banner";

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8v4M9 6h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function BannerDemo() {
  const [dismissed, setDismissed] = useState(false);

  const col: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones (info is neutral gray, role=status; error/danger role=alert)</div>
        <div style={col}>
          <Banner tone="info">This is an informational message.</Banner>
          <Banner tone="success">Changes saved successfully.</Banner>
          <Banner tone="warning">Proceed with caution — this action has side effects.</Banner>
          <Banner tone="danger">Your payment method has expired.</Banner>
          <Banner tone="error">Something went wrong. Please try again.</Banner>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Title + description + icon</div>
        <div style={col}>
          <Banner
            tone="info"
            icon={<InfoIcon />}
            title="Scheduled maintenance"
            description="We'll be performing upgrades on Sunday at 02:00 UTC. Expect brief downtime."
          />
          <Banner
            tone="warning"
            icon={<InfoIcon />}
            title="Storage almost full"
            description="You've used 92% of your quota. Free up space or upgrade your plan."
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Dismissible</div>
        <div style={col}>
          {dismissed ? (
            <div style={{ color: "var(--ml-text-muted)", fontSize: "var(--ml-text-sm)" }}>
              Banner dismissed.{" "}
              <button
                type="button"
                onClick={() => setDismissed(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ml-text)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Restore
              </button>
            </div>
          ) : (
            <Banner
              tone="success"
              title="Welcome aboard"
              description="Your workspace is ready. Invite your team to get started."
              onDismiss={() => setDismissed(true)}
            />
          )}
        </div>
      </div>
    </>
  );
}
