import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type DragEvent,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export interface FileUploadProps
  extends Omit<
    ComponentPropsWithoutRef<"div">,
    "onDrop" | "onChange" | "children"
  > {
  /** `accept` attribute forwarded to the hidden input (e.g. `image/*,.pdf`). */
  accept?: string;
  multiple?: boolean;
  /** Reject files larger than this many bytes. */
  maxSize?: number;
  /** Called with the accepted files whenever the selection changes. */
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  /** Primary label inside the dropzone. */
  label?: ReactNode;
  /** Secondary hint (wired via `aria-describedby`); defaults from accept/size. */
  hint?: ReactNode;
  /** Leading icon slot inside the dropzone. */
  icon?: ReactNode;
  /** Per-file upload progress (0–100), keyed by `file.name`. */
  progress?: Record<string, number>;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

/**
 * FileUpload — a themed dropzone wrapping a visually-hidden `<input type=file>`.
 * The zone is a real `<button>` (keyboard + focus ring for free) that also
 * accepts drag-and-drop; selected files render as a removable list with
 * optional per-file progress bars. Monochrome throughout — drag-over shifts the
 * border color only. Manages its own selection; `onFiles` reports every change.
 */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  function FileUpload(
    {
      accept,
      multiple = false,
      maxSize,
      onFiles,
      disabled = false,
      label = "Drop files here or click to browse",
      hint,
      icon,
      progress,
      className,
      ...rest
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [dragOver, setDragOver] = useState(false);
    const [rejected, setRejected] = useState<string[]>([]);
    const hintId = useId();

    const derivedHint =
      [
        accept ? accept.replace(/,/g, ", ") : null,
        maxSize ? `up to ${formatBytes(maxSize)}` : null,
      ]
        .filter(Boolean)
        .join(" · ") || undefined;
    const defaultHint = hint ?? derivedHint;

    const commit = useCallback(
      (incoming: File[]) => {
        const accepted: File[] = [];
        const denied: string[] = [];
        for (const file of incoming) {
          if (maxSize != null && file.size > maxSize) denied.push(file.name);
          else accepted.push(file);
        }
        const next = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
        setFiles(next);
        setRejected(denied);
        onFiles(next);
      },
      [files, maxSize, multiple, onFiles],
    );

    const open = () => {
      if (!disabled) inputRef.current?.click();
    };

    const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      commit(Array.from(e.dataTransfer.files));
    };

    const removeAt = (index: number) => {
      const next = files.filter((_, i) => i !== index);
      setFiles(next);
      onFiles(next);
    };

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    return (
      <div className={cn("ml-fileupload", className)} {...rest}>
        <button
          type="button"
          className={cn(
            "ml-fileupload-zone",
            dragOver && "ml-fileupload-zone--dragover",
          )}
          onClick={open}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={disabled}
          aria-describedby={defaultHint ? hintId : undefined}
        >
          {icon && (
            <span className="ml-fileupload-icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="ml-fileupload-label">{label}</span>
          {defaultHint && (
            <span id={hintId} className="ml-fileupload-hint">
              {defaultHint}
            </span>
          )}
        </button>

        <input
          ref={setRefs}
          type="file"
          className="ml-visually-hidden"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            commit(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />

        {rejected.length > 0 && (
          <p className="ml-fileupload-error" role="alert">
            {rejected.length === 1
              ? `"${rejected[0]}" exceeds the size limit.`
              : `${rejected.length} files exceed the size limit.`}
          </p>
        )}

        {files.length > 0 && (
          <ul className="ml-fileupload-list">
            {files.map((file, i) => {
              const pct = progress?.[file.name];
              return (
                <li key={file.name + i} className="ml-fileupload-file">
                  <div className="ml-fileupload-file-main">
                    <span className="ml-fileupload-file-name">{file.name}</span>
                    <span className="ml-fileupload-file-size">
                      {formatBytes(file.size)}
                    </span>
                    <button
                      type="button"
                      className="ml-fileupload-remove"
                      onClick={() => removeAt(i)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 4l8 8M12 4l-8 8"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {pct != null && (
                    <div
                      className="ml-fileupload-progress"
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span
                        className="ml-fileupload-progress-bar"
                        style={{ width: `${Math.min(Math.max(pct, 0), 100)}%` }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  },
);
