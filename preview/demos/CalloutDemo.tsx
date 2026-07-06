import { useState } from "react";
import { Callout } from "../../src/components/Callout";

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8v4M9 5.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CalloutDemo() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Tones (info is neutral gray, never blue)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Callout tone="neutral" title="Heads up" icon={<InfoIcon />}>
            This is a neutral, inline admonition sitting inside prose.
          </Callout>
          <Callout tone="info" title="Note" icon={<InfoIcon />}>
            Info reads gray, matching the monochrome contract.
          </Callout>
          <Callout tone="success" title="Verified" icon={<InfoIcon />}>
            Your domain has been verified successfully.
          </Callout>
          <Callout tone="warning" title="Check your input" icon={<InfoIcon />}>
            Some fields need attention before you can continue.
          </Callout>
          <Callout tone="danger" title="Action required" icon={<InfoIcon />}>
            Your payment method was declined.
          </Callout>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Title-less & dismissible</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Callout tone="neutral">A compact one-line note with no title.</Callout>
          {!dismissed && (
            <Callout tone="info" title="Dismissible" onDismiss={() => setDismissed(true)}>
              Click the ✕ to dismiss this callout.
            </Callout>
          )}
        </div>
      </div>
    </>
  );
}
