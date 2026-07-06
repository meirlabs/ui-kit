import { ToastProvider, useToast } from "../../src/hooks/useToast";
import type { ToastPlacement } from "../../src/components/Toast";
import { useState } from "react";

function Triggers() {
  const { toast, dismissAll } = useToast();
  return (
    <div className="demo-row" style={{ flexWrap: "wrap" }}>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() => toast({ title: "Copied to clipboard" })}
      >
        Neutral
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast({
            title: "Project saved",
            description: "All changes have been written.",
            tone: "success",
          })
        }
      >
        Success
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast({
            title: "Approaching your limit",
            description: "You have used 90% of your monthly quota.",
            tone: "warning",
          })
        }
      >
        Warning
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast({
            title: "Delete failed",
            description: "The record could not be removed. Try again.",
            tone: "danger",
          })
        }
      >
        Danger
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast({
            title: "Message deleted",
            tone: "neutral",
            action: { label: "Undo", onClick: () => toast({ title: "Restored" }) },
          })
        }
      >
        With action
      </button>
      <button
        className="ml-btn ml-btn-secondary"
        onClick={() =>
          toast({ title: "Won't auto-dismiss", description: "Duration 0.", duration: 0 })
        }
      >
        Persistent
      </button>
      <button className="ml-btn ml-btn-ghost" onClick={() => dismissAll()}>
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
        {/* Remount the provider when placement changes so the region moves. */}
        <ToastProvider key={placement} placement={placement} maxVisible={3}>
          <Triggers />
        </ToastProvider>
      </div>
    </>
  );
}
