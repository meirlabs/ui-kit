import { useState } from "react";
import { BlurImage } from "../../src/components/BlurImage";
import { Button } from "../../src/components/Button";

export function BlurImageDemo() {
  const [key, setKey] = useState(0);

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">Fixed size (400×260)</div>
        <div className="demo-row" style={{ alignItems: "flex-start" }}>
          <BlurImage
            key={key}
            src={`https://picsum.photos/seed/blur-fixed-${key}/800/520`}
            alt="Random landscape photo"
            width={400}
            height={260}
          />
        </div>
        <div style={{ marginTop: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setKey((k) => k + 1)}>
            Reload (new image, replays the fade)
          </Button>
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Fluid aspect ratio (16 / 9, fills the column)</div>
        <div style={{ maxWidth: 480 }}>
          <BlurImage
            src="https://picsum.photos/seed/blur-fluid/960/540"
            alt="Random landscape photo, fluid width"
            aspectRatio="16 / 9"
          />
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Already cached on mount — no stuck blur</div>
        <div className="demo-row">
          <BlurImage
            src="https://picsum.photos/seed/blur-cached/400/260"
            alt="Cached photo, appears instantly"
            width={400}
            height={260}
          />
        </div>
        <div style={{ fontSize: 12, color: "var(--ml-text-muted)", marginTop: 4 }}>
          Reload the preview page — on the second visit this image is served from the browser
          cache and appears immediately, sharp, with no blur flash.
        </div>
      </div>

      <div className="demo-section">
        <div className="demo-label">Broken source with a fallback</div>
        <div className="demo-row">
          <BlurImage
            src="/this-image-does-not-exist.jpg"
            alt="Broken image"
            width={400}
            height={260}
            fallback={<span>Image unavailable</span>}
          />
        </div>
      </div>
    </>
  );
}
