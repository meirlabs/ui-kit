import { useRef, useState } from "react";
import { SelectionToolbar } from "../../src/components/SelectionToolbar";

function BasicSelectionDemo() {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 520, display: "flex", flexDirection: "column", gap: 12 }}>
      <p ref={containerRef} style={{ color: "var(--ml-text)", lineHeight: 1.6, margin: 0 }}>
        Select any part of this paragraph — a floating toolbar appears above
        the highlighted text with actions you can run against it, similar to
        the rewrite tools in a document editor.
      </p>
      <div style={{ color: "var(--ml-text-muted)", fontSize: "var(--ml-text-sm)" }}>
        {lastAction ?? "No action run yet — select some text above."}
      </div>
      <SelectionToolbar
        containerRef={containerRef}
        aria-label="Text selection actions"
        actions={[
          {
            id: "explain",
            label: "Explain",
            onSelect: (text) => setLastAction(`Explain: "${text}"`),
          },
          {
            id: "shorten",
            label: "Shorten",
            onSelect: (text) => setLastAction(`Shorten: "${text}"`),
          },
          {
            id: "improve",
            label: "Improve",
            onSelect: (text) => setLastAction(`Improve: "${text}"`),
          },
        ]}
      />
    </div>
  );
}

function MinLengthDemo() {
  const containerRef = useRef<HTMLParagraphElement>(null);
  return (
    <div style={{ maxWidth: 520 }}>
      <p ref={containerRef} style={{ color: "var(--ml-text)", lineHeight: 1.6 }}>
        This paragraph requires at least 12 selected characters before the
        toolbar appears, so a stray single-word selection stays quiet.
      </p>
      <SelectionToolbar
        containerRef={containerRef}
        aria-label="Text selection actions"
        minLength={12}
        actions={[{ id: "explain", label: "Explain", onSelect: () => {} }]}
      />
    </div>
  );
}

export function SelectionToolbarDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Select text to reveal the toolbar</div>
        <BasicSelectionDemo />
      </div>

      <div className="demo-section">
        <div className="demo-label">minLength (ignores very short selections)</div>
        <MinLengthDemo />
      </div>
    </>
  );
}
