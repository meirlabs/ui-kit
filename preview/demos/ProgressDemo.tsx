import { useEffect, useState } from "react";
import { Progress } from "../../src/components/Progress";

function AnimatedProgress() {
  const [value, setValue] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 8));
    }, 900);
    return () => clearInterval(id);
  }, []);

  return <Progress value={value} label="Uploading files" showValue />;
}

export function ProgressDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Determinate (auto-animating)</div>
        <div style={{ maxWidth: 420 }}>
          <AnimatedProgress />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Static values & sizes</div>
        <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 20 }}>
          <Progress value={30} size="sm" label="Small" showValue />
          <Progress value={65} size="md" label="Medium" showValue />
          <Progress value={90} size="lg" label="Large" showValue />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Tones (functional only)</div>
        <div style={{ maxWidth: 420, display: "flex", flexDirection: "column", gap: 20 }}>
          <Progress value={70} tone="neutral" label="Neutral" showValue />
          <Progress value={100} tone="success" label="Complete" showValue />
          <Progress value={45} tone="warning" label="Warning" showValue />
          <Progress value={20} tone="danger" label="Danger" showValue />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Indeterminate</div>
        <div style={{ maxWidth: 420 }}>
          <Progress label="Processing" />
        </div>
      </div>
    </>
  );
}
