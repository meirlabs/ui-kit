import { useState } from "react";
import { Modal } from "../../src/components/Modal";

export function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Modal</div>
        <button className="ml-btn ml-btn-primary" type="button" onClick={() => setOpen(true)}>
          Open Modal
        </button>
        <Modal open={open} onClose={() => setOpen(false)} title="Confirm Action">
          <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)", margin: 0 }}>
            Are you sure you want to proceed? This action cannot be undone.
          </p>
          <div className="ml-modal-footer" style={{ marginTop: 16, padding: 0, border: "none" }}>
            <button className="ml-btn ml-btn-ghost" type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button className="ml-btn ml-btn-primary" type="button" onClick={() => setOpen(false)}>
              Confirm
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}
