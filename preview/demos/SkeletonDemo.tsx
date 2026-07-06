import { useState } from "react";
import { Skeleton, SkeletonText } from "../../src/components/Skeleton";

/** Toggle between skeleton and loaded content to prove no layout shift. */
function CardSwap() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <button className="ml-btn ml-btn-secondary" onClick={() => setLoading((v) => !v)}>
        {loading ? "Show content" : "Show skeleton"}
      </button>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          padding: 24,
          border: "1px solid var(--ml-border)",
          borderRadius: "var(--ml-radius-lg)",
          background: "var(--ml-bg-card)",
        }}
      >
        {loading ? (
          <Skeleton variant="circle" width={48} height={48} />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 9999,
              background: "var(--ml-bg-surface)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "var(--ml-text-muted)",
            }}
          >
            MR
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Skeleton variant="text" width="40%" height={16} />
              <Skeleton variant="text" width="70%" height={14} />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ml-text)", height: 16, lineHeight: "16px" }}>
                Meir Rosenschein
              </div>
              <div style={{ fontSize: 14, color: "var(--ml-text-muted)", height: 14, lineHeight: "14px" }}>
                meir@example.com
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SkeletonDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Variants</div>
        <div className="demo-row" style={{ alignItems: "center", gap: 24 }}>
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="rect" width={120} height={40} />
          <Skeleton variant="text" width={160} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Text block (SkeletonText)</div>
        <div style={{ maxWidth: 420 }}>
          <SkeletonText lines={4} />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Table rows</div>
        <div
          style={{
            border: "1px solid var(--ml-border)",
            borderRadius: "var(--ml-radius-lg)",
            overflow: "hidden",
          }}
        >
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: 16,
                padding: "12px 16px",
                borderTop: i === 0 ? "none" : "1px solid var(--ml-border-subtle)",
                alignItems: "center",
              }}
            >
              <Skeleton variant="text" width="80%" height={14} />
              <Skeleton variant="text" width="50%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </div>
          ))}
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">No layout shift (toggle)</div>
        <CardSwap />
      </div>
    </>
  );
}
