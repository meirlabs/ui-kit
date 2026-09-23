"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";
import { SkeletonText } from "./Skeleton";

/* ─── Types ─── */

export interface LiveFaqItem {
  q: string;
  a: string;
}

export interface LiveFaqStrings {
  /** Ghost text in the question row, e.g. "Ask anything else". */
  placeholder: string;
  /** Accessible label on the submit control. */
  submitLabel: string;
  /** Accessible label while streaming, when it becomes a stop control. */
  stopLabel: string;
  /** Announced while the answer is still being written. */
  loadingLabel: string;
  /** Sits under a finished answer — say plainly that a model wrote it. */
  disclaimer: string;
}

export type LiveFaqPhase = "idle" | "streaming" | "done" | "error";

export interface LiveFaqProps {
  /** The canned Q&A, rendered as native <details> rows above the ask row. */
  items: readonly LiveFaqItem[];
  strings: LiveFaqStrings;
  /**
   * POST endpoint that answers a question as an SSE stream. It receives
   * `{ question, ...payload }` and must emit `data:`-prefixed JSON frames:
   * `{type:"delta",text}`, `{type:"error",message}`, `{type:"done"}`. A
   * non-2xx response is read as `{ error }` JSON instead and shown in place
   * of the answer — that is how rate limits and input caps reach the reader.
   */
  endpoint?: string;
  /** Merged into the request body. Put the locale and page context here. */
  payload?: Record<string, unknown>;
  /** Icon-agnostic; pass any ReactNode. Mirrored automatically under RTL. */
  sendIcon?: ReactNode;
  stopIcon?: ReactNode;
  /**
   * Class prefix for the FAQ rows, so a page with its own FAQ styling keeps
   * it: `"pr"` emits `pr-faq-item` / `pr-faq-q` / `pr-faq-a`. Defaults to
   * `"ml"`, which ui-kit styles itself. The ask row and answer are always
   * `ml-ask-*` — they are new on every page, so there is only ever one copy.
   */
  classPrefix?: string;
  /** Fires on submit, before the answer streams. Wire analytics here. */
  onAsk?: (question: string) => void;
  /** Hard cap on the question, mirrored by the server. */
  maxLength?: number;
  className?: string;
}

/* ─── Answer rendering ─── */

/** Bare URLs and markdown `[label](href)`. Models reach for markdown even when
    told not to, and rendering raw brackets to a reader is not an acceptable
    failure mode. Anything that is not http(s) or a rooted path renders as
    plain text, so no model output can become a `javascript:` link. */
const LINK_RE =
  /\[([^\]]+)\]\((\/[^\s)]*|https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;

function linkify(text: string, keyBase: number): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;

  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const href = m[2] ?? m[3];
    out.push(
      <a href={href} key={`${keyBase}-${m.index}`}>
        {m[1] ?? href.replace(/^https?:\/\//, "")}
      </a>,
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Paragraphs only, as React nodes — never `dangerouslySetInnerHTML`, so no
    string the model produces can become markup. Stray emphasis markers are
    stripped rather than shown. */
function Answer({ text, prefix }: { text: string; prefix: string }) {
  return (
    <>
      {text
        .split(/\n{2,}/)
        .map((p) => p.trim().replace(/\*\*/g, ""))
        .filter(Boolean)
        .map((para, i) => (
          <p className={cn(`${prefix}-faq-a`, "ml-ask-para")} key={i}>
            {linkify(para, i)}
          </p>
        ))}
    </>
  );
}

/* ─── Component ─── */

/**
 * LiveFaq — an FAQ list whose last row is a question box. Ask anything and a
 * grounded answer streams in below it, inside the same card, laid out like an
 * open row.
 *
 * The canned rows stay native `<details>`, deliberately NOT ui-kit's
 * `Accordion`: an FAQ is indexed content, and `<details>` needs no JS, no
 * hydration, and is what `FAQPage` structured data should mirror. Accordion is
 * the right primitive for app UI, not for a marketing FAQ.
 *
 * One-shot by design: each question replaces the previous answer and no
 * history is sent, which keeps the request a fixed size, keeps a server-side
 * cached prompt prefix stable, and keeps a public endpoint from quietly
 * becoming a free chatbot.
 *
 * The component owns the UI and the stream; it knows nothing about models or
 * grounding. That lives behind `endpoint` — see the starter's
 * `app/api/faq-ask/route.ts` for the reference implementation.
 */
export function LiveFaq({
  items,
  strings,
  endpoint = "/api/faq-ask",
  payload,
  sendIcon,
  stopIcon,
  classPrefix: p = "ml",
  onAsk,
  maxLength = 300,
  className,
}: LiveFaqProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<LiveFaqPhase>("idle");
  const abort = useRef<AbortController | null>(null);
  const field = useRef<HTMLTextAreaElement | null>(null);

  // Grow the field to fit. Reset to `auto` first or it can never shrink back —
  // scrollHeight never reports less than the height already set.
  useLayoutEffect(() => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [question]);

  const busy = phase === "streaming";
  const canSend = question.trim().length > 0;

  function stop() {
    abort.current?.abort();
    abort.current = null;
    setPhase(answer ? "done" : "idle");
  }

  async function ask(e: SyntheticEvent) {
    e.preventDefault();
    if (busy) return stop();
    if (!canSend) return;

    const asked = question.trim();
    const controller = new AbortController();
    abort.current = controller;
    setAnswer("");
    setPhase("streaming");
    onAsk?.(asked);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: asked, ...payload }),
        signal: controller.signal,
      });

      // A guard tripped before streaming began (429, 400, 503): the body is
      // JSON carrying a reader-facing message, not a stream.
      if (!res.ok || !res.body) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setAnswer(body.error ?? "");
        setPhase("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // Frames are separated by a blank line and a chunk can split one in
        // half, so only whole frames are consumed; the remainder waits.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const frame of frames) {
          const line = frame.trim();
          if (!line.startsWith("data:")) continue;
          const event = JSON.parse(line.slice(5)) as {
            type: string;
            text?: string;
            message?: string;
          };
          if (event.type === "delta" && event.text) {
            acc += event.text;
            setAnswer(acc);
          } else if (event.type === "error") {
            setAnswer(event.message ?? "");
            setPhase("error");
            return;
          }
        }
      }

      setPhase("done");
    } catch (error) {
      // An aborted fetch is the reader pressing stop, not a failure.
      if ((error as Error)?.name === "AbortError") return;
      setPhase("error");
    } finally {
      abort.current = null;
    }
  }

  // The panel exists from the moment the question is sent, so the loader holds
  // the space the text will fill instead of the card growing a second later.
  const showPanel = busy || Boolean(answer);

  return (
    <div className={cn(`${p}-faq`, className)}>
      {items.map((item) => (
        <details className={`${p}-faq-item`} key={item.q}>
          <summary className={`${p}-faq-q`}>{item.q}</summary>
          <p className={`${p}-faq-a`}>{item.a}</p>
        </details>
      ))}

      {/* One card, laid out like an open row above it: question on top,
          answer below at the same indent. The asked question stays visible in
          the field, which is what makes the pair read as another FAQ row and
          not a chat box with a reply stuck under it. */}
      <div
        className={cn(`${p}-faq-item`, "ml-ask-shell")}
        data-open={showPanel ? "true" : undefined}
      >
        <form className="ml-ask" onSubmit={ask}>
          {/* A textarea, not an input: the rows above wrap when they need to,
              and a question clipping at the field edge would be the one row
              that behaves differently. Enter sends; Shift+Enter breaks. */}
          <textarea
            ref={field}
            className="ml-ask-input"
            value={question}
            rows={1}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void ask(e);
              }
            }}
            placeholder={strings.placeholder}
            maxLength={maxLength}
            aria-label={strings.placeholder}
            enterKeyHint="send"
          />
          <button
            className="ml-ask-send"
            type="submit"
            // Inert with nothing typed, but still laid out — hiding it would
            // shift the row the moment you type.
            disabled={!canSend && !busy}
            data-active={canSend || busy ? "true" : undefined}
            aria-label={busy ? strings.stopLabel : strings.submitLabel}
          >
            {busy ? stopIcon : sendIcon}
          </button>
        </form>

        {showPanel ? (
          <div className="ml-ask-answer" aria-live="polite" data-state={phase}>
            {answer ? (
              <>
                <Answer text={answer} prefix={p} />
                {phase === "done" ? (
                  <p className="ml-ask-note">{strings.disclaimer}</p>
                ) : null}
              </>
            ) : (
              <div role="status" aria-label={strings.loadingLabel}>
                <SkeletonText lines={3} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
