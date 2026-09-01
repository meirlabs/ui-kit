import { useState } from "react";
import { Button } from "../../src/components/Button";
import { StreamingText } from "../../src/components/StreamingText";

function ReplayableStreamingText(props: { text: string; speed?: number; cursor?: boolean }) {
  const [key, setKey] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
      <StreamingText key={key} {...props} />
      <Button variant="secondary" size="sm" onClick={() => setKey((k) => k + 1)}>
        Replay
      </Button>
    </div>
  );
}

export function StreamingTextDemo() {
  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Default (40 chars/sec, blinking cursor)</div>
        <div style={{ maxWidth: 480 }}>
          <ReplayableStreamingText text="Here's a summary of the last deploy: three services updated, no errors reported." />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Fast, no cursor</div>
        <div style={{ maxWidth: 480 }}>
          <ReplayableStreamingText
            text="Fast streaming without a cursor, useful for short inline status text."
            speed={140}
            cursor={false}
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">prefers-reduced-motion (renders instantly, no cursor)</div>
        <div style={{ maxWidth: 480 }} data-note="emulate via OS setting">
          <StreamingText text="With reduced motion enabled, this text appears all at once." />
        </div>
      </div>
    </>
  );
}
