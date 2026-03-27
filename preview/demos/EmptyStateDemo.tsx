import { EmptyState } from "../../src/components/EmptyState";

export function EmptyStateDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Default</div>
        <EmptyState>No items to display.</EmptyState>
      </div>
      <div className="demo-section">
        <div className="demo-label">With action</div>
        <EmptyState>
          <p style={{ margin: "0 0 12px" }}>No projects yet.</p>
          <button className="ml-btn ml-btn-primary" type="button">
            Create Project
          </button>
        </EmptyState>
      </div>
    </>
  );
}
