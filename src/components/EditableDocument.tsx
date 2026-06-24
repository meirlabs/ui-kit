import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../utils/cn";

/* EditableDocument — form-bound fill-in-the-blank placeholders.

   A document that reads like finished prose, with live inline blanks. Authors
   write blanks as `{{key|label}}` tokens; each becomes a contentEditable island
   with three calm states (empty underline+ghost label · filled bold+tint ·
   focused soft highlight). Values are controlled, so a side-form and the inline
   blanks stay in sync. A one-time "Click to edit" coachmark teaches the
   affordance on first hover, then never shows again.

   No editor dependency — plain contentEditable islands. The surrounding prose is
   not editable; only the blanks are. */

export type DocFieldDef = { name: string; label: string };

const FIELD_RE = /\{\{\s*([\w-]+)\s*(?:\|([^}]*))?\}\}/g;

/** Discover the fields (in order, de-duplicated) so a host can render a form. */
export function parseDocFields(source: string): DocFieldDef[] {
  const seen = new Set<string>();
  const out: DocFieldDef[] = [];
  for (const m of source.matchAll(FIELD_RE)) {
    const name = m[1];
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ name, label: (m[2] ?? "").trim() });
  }
  return out;
}

/* ── inline rendering ────────────────────────────────────────────────────── */

function renderBold(text: string, kp: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*/g;
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(<strong key={`${kp}-b${i++}`}>{m[1]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/* ── the blank ───────────────────────────────────────────────────────────── */

function DocField({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (name: string, value: string) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  // form → document: write the external value in when it changes, but never
  // while this blank is focused (that would yank the caret around).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement === el) return;
    if (el.textContent !== value) el.textContent = value;
  }, [value]);

  return (
    <span className="doc-field-wrap">
      <span
        ref={ref}
        className={cn("doc-field", value ? "is-filled" : "is-empty")}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={label || name}
        spellCheck={false}
        data-placeholder={label}
        data-name={name}
        // document → form
        onInput={(e) => onChange(name, e.currentTarget.textContent ?? "")}
        // single-line: commit on Enter rather than inserting a newline
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        // keep pasted content plain text
        onPaste={(e) => {
          e.preventDefault();
          const t = e.clipboardData.getData("text/plain").replace(/\s+/g, " ");
          // execCommand is deprecated but remains the simplest reliable
          // plain-text insert into a contentEditable across browsers.
          document.execCommand("insertText", false, t);
        }}
      />
    </span>
  );
}

/* ── one-time coachmark ──────────────────────────────────────────────────── */

function useDocCoachmark(rootRef: React.RefObject<HTMLElement | null>) {
  const [hint, setHint] = useState<{ x: number; y: number } | null>(null);
  const shown = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let timer: number | undefined;
    let target: HTMLElement | null = null;
    const clear = () => {
      if (timer) window.clearTimeout(timer);
      timer = undefined;
    };
    const over = (e: Event) => {
      if (shown.current) return;
      const f = (e.target as HTMLElement)?.closest?.(".doc-field") as HTMLElement | null;
      if (!f) return;
      target = f;
      clear();
      timer = window.setTimeout(() => {
        if (shown.current || !target) return;
        const r = target.getBoundingClientRect();
        setHint({ x: r.left + r.width / 2, y: r.top });
        shown.current = true;
      }, 350);
    };
    const out = (e: Event) => {
      const f = (e.target as HTMLElement)?.closest?.(".doc-field");
      if (f === target) {
        clear();
        target = null;
      }
    };
    // it's a nudge, not a recurring tooltip — first interaction kills it for good
    const dismiss = () => {
      clear();
      shown.current = true;
      setHint(null);
    };
    root.addEventListener("pointerover", over);
    root.addEventListener("pointerout", out);
    root.addEventListener("focusin", dismiss);
    root.addEventListener("input", dismiss, true);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      clear();
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointerout", out);
      root.removeEventListener("focusin", dismiss);
      root.removeEventListener("input", dismiss, true);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, [rootRef]);

  return hint;
}

/* ── document ────────────────────────────────────────────────────────────── */

export type EditableDocumentProps = {
  /** Prose with `{{key|label}}` blanks. Blank lines start a new paragraph; `**bold**` is supported. */
  source: string;
  /** Controlled field values, keyed by field name. */
  values: Record<string, string>;
  /** Called on every edit (inline). Memoize this so the doc isn't rebuilt each keystroke. */
  onChange: (name: string, value: string) => void;
  className?: string;
};

export function EditableDocument({
  source,
  values,
  onChange,
  className,
}: EditableDocumentProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hint = useDocCoachmark(rootRef);

  const blocks = useMemo(
    () =>
      source
        .replace(/\r\n/g, "\n")
        .split(/\n{2,}/)
        .map((b) => b.trim())
        .filter(Boolean),
    [source],
  );

  return (
    <>
      <div ref={rootRef} className={cn("doc", className)}>
        {blocks.map((block, bi) => {
          const nodes: ReactNode[] = [];
          let last = 0;
          let i = 0;
          let m: RegExpExecArray | null;
          FIELD_RE.lastIndex = 0;
          while ((m = FIELD_RE.exec(block))) {
            if (m.index > last)
              nodes.push(...renderBold(block.slice(last, m.index), `b${bi}-t${i}`));
            const name = m[1];
            nodes.push(
              <DocField
                key={`b${bi}-f${i}`}
                name={name}
                label={(m[2] ?? "").trim()}
                value={values[name] ?? ""}
                onChange={onChange}
              />,
            );
            last = m.index + m[0].length;
            i++;
          }
          if (last < block.length)
            nodes.push(...renderBold(block.slice(last), `b${bi}-end`));
          return (
            <p className="doc-p" key={`b${bi}`}>
              {nodes}
            </p>
          );
        })}
      </div>
      {hint && typeof document !== "undefined"
        ? createPortal(
            <div className="doc-edit-hint" style={{ left: hint.x, top: hint.y }}>
              Click to edit
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
