import { Toaster, toast } from "../../src/components/Toast";
import type { ToastPlacement } from "../../src/components/Toast";
import { useState } from "react";

function Triggers() {
  return (
    <div className="demo-row" style={{ flexWrap: "wrap" }}>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() => toast("Copied to clipboard")}
      >
        Neutral
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast.success("Project saved", {
            description: "All changes have been written.",
          })
        }
      >
        Success
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast.warning("Approaching your limit", {
            description: "You have used 90% of your monthly quota.",
          })
        }
      >
        Warning
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast.error("Delete failed", {
            description: "The record could not be removed. Try again.",
          })
        }
      >
        Danger
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast("Message deleted", {
            action: { label: "Undo", onClick: () => toast("Restored") },
          })
        }
      >
        With action
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() => toast("Won't auto-dismiss", { description: "Duration 0.", duration: 0 })}
      >
        Persistent
      </button>
      <button className="ml-btn ml-btn-ghost" onClick={() => toast.dismiss()}>
        Dismiss all
      </button>
    </div>
  );
}

const PLACEMENTS: ToastPlacement[] = [
  "bottom-right",
  "bottom-center",
  "bottom-left",
  "top-right",
  "top-center",
  "top-left",
];

export function ToastDemo() {
  const [placement, setPlacement] = useState<ToastPlacement>("bottom-right");

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Placement</div>
        <div className="demo-row" style={{ flexWrap: "wrap" }}>
          {PLACEMENTS.map((p) => (
            <button
              key={p}
              className={`ml-btn ${placement === p ? "ml-btn-primary" : "ml-btn-ghost"}`}
              onClick={() => setPlacement(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">
          Triggers — hover a toast to pause its timer; stack of 3, extras queue
        </div>
        {/* Remount the outlet when placement changes so the region moves. */}
        <Toaster key={placement} placement={placement} visibleToasts={3} />
        <Triggers />
      </div>
    </>
  );
}
