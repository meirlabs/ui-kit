import { useState } from "react";
import { Input } from "../../src/components/Input";

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="m3.5 6 6.5 4.5L16.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function InputDemo() {
  const [controlled, setControlled] = useState("hello");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sizes — sm / md / lg (32 / 40 / 48px)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input size="sm" placeholder="Small" defaultValue="Small" />
          <Input size="md" placeholder="Medium (default)" defaultValue="Medium" />
          <Input size="lg" placeholder="Large" defaultValue="Large" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Icons (leading / trailing 20px slots)</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input leftIcon={<SearchIcon />} placeholder="Search..." />
          <Input leftIcon={<MailIcon />} placeholder="you@company.com" type="email" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Prefix / suffix adornments</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input prefix="https://" placeholder="yoursite" suffix=".com" />
          <Input prefix="$" placeholder="0.00" inputMode="decimal" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Invalid + disabled + read-only</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Input invalid defaultValue="not-an-email" aria-label="invalid" />
          <Input disabled defaultValue="Disabled" />
          <Input readOnly defaultValue="Read only" />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Controlled</div>
        <Input
          value={controlled}
          onChange={(e) => setControlled(e.target.value)}
          aria-label="controlled"
        />
        <p style={{ fontSize: "12px", color: "var(--ml-text-muted)", marginTop: "6px" }}>
          value: {controlled || "(empty)"}
        </p>
      </div>
    </>
  );
}
