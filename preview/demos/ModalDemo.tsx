import { useRef, useState } from "react";
import { Modal, type ModalSize } from "../../src/components/Modal";

const bodyText: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--ml-text-muted)",
  margin: 0,
};

export function ModalDemo() {
  const [size, setSize] = useState<ModalSize | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [scrollOpen, setScrollOpen] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const sizes: ModalSize[] = ["sm", "md", "lg", "fullscreen"];

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Sizes — Escape / overlay-click / focus-trap all wired</div>
        <div className="demo-row">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              className="ml-btn ml-btn-secondary"
              onClick={() => setSize(s)}
            >
              Open {s}
            </button>
          ))}
        </div>
        <Modal
          open={size !== null}
          onClose={() => setSize(null)}
          size={size ?? "md"}
          title={`${size ?? ""} modal`}
          description="Focus is trapped inside; Tab cycles within the dialog and Escape closes it."
          footer={
            <>
              <button className="ml-btn ml-btn-ghost" type="button" onClick={() => setSize(null)}>
                Cancel
              </button>
              <button className="ml-btn ml-btn-primary" type="button" onClick={() => setSize(null)}>
                Confirm
              </button>
            </>
          }
        >
          <p style={bodyText}>
            The panel renders through a portal on <code>document.body</code>, locks background
            scroll, and returns focus to the trigger on close.
          </p>
        </Modal>
      </div>

      <div className="demo-section">
        <div className="demo-label">Initial focus target (the name input)</div>
        <button
          type="button"
          className="ml-btn ml-btn-secondary"
          onClick={() => setFormOpen(true)}
        >
          Edit profile
        </button>
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title="Edit profile"
          size="sm"
          initialFocusRef={nameRef}
          footer={
            <button className="ml-btn ml-btn-primary" type="button" onClick={() => setFormOpen(false)}>
              Save
            </button>
          }
        >
          <label style={{ display: "block", fontSize: 14, fontWeight: 500, marginBottom: 6 }}>
            Name
          </label>
          <input
            ref={nameRef}
            className="ml-input"
            defaultValue="Ada Lovelace"
            style={{ width: "100%" }}
          />
        </Modal>
      </div>

      <div className="demo-section">
        <div className="demo-label">Long content — body scrolls with a stable gutter</div>
        <button
          type="button"
          className="ml-btn ml-btn-secondary"
          onClick={() => setScrollOpen(true)}
        >
          Open changelog
        </button>
        <Modal open={scrollOpen} onClose={() => setScrollOpen(false)} title="Changelog" size="md">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} style={{ ...bodyText, marginBottom: 12 }}>
              {i + 1}. A representative release note describing what changed in this version.
            </p>
          ))}
        </Modal>
      </div>
    </>
  );
}
