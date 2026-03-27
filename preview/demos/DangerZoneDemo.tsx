import { DangerZone } from "../../src/components/DangerZone";

export function DangerZoneDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">With title and action</div>
        <DangerZone title="Danger Zone">
          <p style={{ fontSize: "var(--ml-text-sm)", color: "var(--ml-text-muted)", marginBottom: "var(--ml-space-md)" }}>
            Deleting this agent is permanent and cannot be undone.
          </p>
          <button
            type="button"
            style={{
              padding: "6px 16px",
              fontSize: "var(--ml-text-sm)",
              fontWeight: 600,
              color: "var(--ml-color-danger)",
              background: "var(--ml-color-danger-muted)",
              border: "1px solid var(--ml-color-danger-muted)",
              borderRadius: "var(--ml-radius-md)",
              cursor: "pointer",
            }}
          >
            Delete Agent
          </button>
        </DangerZone>
      </div>
    </>
  );
}
