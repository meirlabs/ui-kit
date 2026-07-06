import { DangerZone } from "../../src/components/DangerZone";

export function DangerZoneDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Multi-row destructive pattern</div>
        <DangerZone title="Danger Zone">
          <DangerZone.Item
            title="Transfer ownership"
            description="Move this workspace to another account. You'll lose admin access."
            actionLabel="Transfer"
            onConfirm={() => alert("wire your confirm modal here")}
          />
          <DangerZone.Item
            title="Delete workspace"
            description="Permanently remove this workspace and all of its data. This cannot be undone."
            actionLabel="Delete workspace"
            onConfirm={() => alert("wire your confirm modal here")}
          />
        </DangerZone>
      </div>

      <div className="demo-section">
        <div className="demo-label">Single item, loading state</div>
        <DangerZone title="Account">
          <DangerZone.Item
            title="Delete account"
            description="This will erase your profile and cannot be reversed."
            actionLabel="Delete account"
            loading
          />
        </DangerZone>
      </div>
    </>
  );
}
