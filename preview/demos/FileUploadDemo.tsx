import { useState } from "react";
import { FileUpload } from "../../src/components/FileUpload";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15V4m0 0L8 8m4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function FileUploadDemo() {
  const [count, setCount] = useState(0);

  // Fake per-file progress keyed by name to show the progress bar UI.
  const [progress] = useState<Record<string, number>>({});

  return (
    <>
      <div className="demo-section">
        <div className="demo-label">
          Drag & drop or click — multiple, images/PDF, ≤ 2 MB
        </div>
        <FileUpload
          icon={<UploadIcon />}
          accept="image/*,.pdf"
          multiple
          maxSize={2 * 1024 * 1024}
          onFiles={(files) => setCount(files.length)}
          progress={progress}
        />
        <p style={{ fontSize: "12px", color: "var(--ml-text-muted)", marginTop: "8px" }}>
          {count} file{count === 1 ? "" : "s"} selected
        </p>
      </div>

      <div className="demo-section">
        <div className="demo-label">Single file, custom label</div>
        <FileUpload
          icon={<UploadIcon />}
          label="Upload your avatar"
          hint="PNG or JPG, square works best"
          accept="image/png,image/jpeg"
          onFiles={() => {}}
        />
      </div>

      <div className="demo-section">
        <div className="demo-label">Disabled</div>
        <FileUpload disabled onFiles={() => {}} />
      </div>
    </>
  );
}
