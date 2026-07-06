import { EmptyState } from "../../src/components/EmptyState";

export function EmptyStateDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">no-data (dashed container + Placeholder art)</div>
        <EmptyState
          variant="no-data"
          title="No projects yet"
          description="Create your first project to start tracking work."
          action={
            <button className="ml-btn ml-btn-primary" type="button">
              Create project
            </button>
          }
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">no-results (borderless, search art)</div>
        <EmptyState
          variant="no-results"
          title="No results found"
          description="No items match “quarterly-forecast”. Try a different search."
          action={
            <button className="ml-btn ml-btn-secondary" type="button">
              Clear filters
            </button>
          }
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">error (functional danger tone)</div>
        <EmptyState
          variant="error"
          title="Something went wrong"
          description="We couldn't load this data. Check your connection and retry."
          action={
            <button className="ml-btn ml-btn-secondary" type="button">
              Retry
            </button>
          }
        />
      </div>
    </>
  );
}
