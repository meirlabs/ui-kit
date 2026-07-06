import { Button } from "../../src/components/Button";

// Inline icons keep the demo dependency-free (the library itself is icon-agnostic).
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h9M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden="true">
      <circle cx="4" cy="9" r="1.4" />
      <circle cx="9" cy="9" r="1.4" />
      <circle cx="14" cy="9" r="1.4" />
    </svg>
  );
}

export function ButtonDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Variants</div>
        <div className="demo-row">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="icon" aria-label="More">
            <DotsIcon />
          </Button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Sizes (font stays 14px)</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">With icons</div>
        <div className="demo-row">
          <Button variant="primary" leftIcon={<PlusIcon />}>New project</Button>
          <Button variant="secondary" rightIcon={<ArrowIcon />}>Continue</Button>
          <Button variant="ghost" leftIcon={<PlusIcon />}>Add</Button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Loading (width reserved in place)</div>
        <div className="demo-row">
          <Button variant="primary" loading>Saving…</Button>
          <Button variant="secondary" loading>Refreshing</Button>
          <Button variant="danger" loading>Deleting</Button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Icon buttons (square hit area)</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <Button variant="icon" size="sm" aria-label="Add"><PlusIcon /></Button>
          <Button variant="icon" size="md" aria-label="Add"><PlusIcon /></Button>
          <Button variant="icon" size="lg" aria-label="Add"><PlusIcon /></Button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Link CTA (renders &lt;a role="button"&gt;)</div>
        <div className="demo-row">
          <Button href="#pricing" variant="primary">View pricing</Button>
          <Button href="#docs" variant="ghost" rightIcon={<ArrowIcon />}>Read the docs</Button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Disabled</div>
        <div className="demo-row">
          <Button variant="primary" disabled>Primary</Button>
          <Button variant="secondary" disabled>Secondary</Button>
          <Button variant="ghost" disabled>Ghost</Button>
          <Button variant="danger" disabled>Danger</Button>
        </div>
      </div>
    </>
  );
}
