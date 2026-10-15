import { DeleteButton } from "../../src/components/DeleteButton";

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function DeleteButtonDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Default — click once to arm, click again to confirm (auto-reverts
          after 4s if you don't)
        </div>
        <div className="demo-row">
          <DeleteButton onDelete={() => wait(1200)} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Sizes: sm 32 · md 40 · lg 48</div>
        <div className="demo-row" style={{ alignItems: "center" }}>
          <DeleteButton size="sm" onDelete={() => wait(1200)} />
          <DeleteButton size="md" onDelete={() => wait(1200)} />
          <DeleteButton size="lg" onDelete={() => wait(1200)} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Custom labels</div>
        <div className="demo-row">
          <DeleteButton
            label="Remove member"
            confirmLabel="Really remove?"
            loadingLabel="Removing…"
            doneLabel="Removed"
            onDelete={() => wait(1200)}
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">A failed delete reverts to idle</div>
        <div className="demo-row">
          <DeleteButton
            onDelete={() =>
              wait(1000).then(() => {
                throw new Error("simulated failure");
              })
            }
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Disabled</div>
        <div className="demo-row">
          <DeleteButton disabled onDelete={() => wait(1200)} />
        </div>
      </div>
    </>
  );
}
