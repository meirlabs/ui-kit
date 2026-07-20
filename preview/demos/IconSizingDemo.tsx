import { Badge } from "../../src/components/Badge";

function CapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

const muted: React.CSSProperties = {
  color: "var(--ml-text-muted)",
  fontSize: "var(--ml-text-sm)",
  marginBottom: 12,
};

const SIZES = [14, 20, 28, 40];

export function IconSizingDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">.ml-icon-1cap — tracks font-size</div>
        <p style={muted}>
          Sized from the surrounding text's cap-height (1cap), so the same
          class produces a correctly-scaled icon at any font-size — no
          hand-tuned pixel value per size. Compare the icon height against the
          capital "S" beside it at each size.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SIZES.map((size) => (
            <div
              key={size}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: size,
                color: "var(--ml-text)",
              }}
            >
              <CapIcon className="ml-icon-1cap" />
              <span>Sample text at {size}px</span>
            </div>
          ))}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Adopted call sites</div>
        <p style={muted}>
          <code>.ml-badge-icon</code> (components.css) now sizes its leading
          icon from <code>--ml-icon-inline-size</code> instead of a fixed
          14px/12px — the smaller size in <code>Badge size="sm"</code> falls
          out of the badge's own smaller font-size, no separate override
          needed. The Command Palette search icon (command.css) adopts the
          same token.
        </p>
        <div className="demo-row" style={{ alignItems: "center", gap: 16 }}>
          <Badge tone="success" icon={<CapIcon />} size="md">
            Verified (md)
          </Badge>
          <Badge tone="neutral" icon={<CapIcon />} size="sm">
            Synced (sm)
          </Badge>
        </div>
      </div>
    </>
  );
}
