import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
} from "react";
import { cn } from "../utils/cn";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotion(): boolean {
  return false;
}

export interface StreamingTextProps
  extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** The full text to reveal. */
  text: string;
  /** Characters revealed per second. Defaults to `40`. */
  speed?: number;
  /** Show a blinking cursor while the text is still revealing. Defaults to `true`. */
  cursor?: boolean;
  /** Called once when the full text has been revealed. */
  onComplete?: () => void;
}

/**
 * StreamingText — reveals `text` a character at a time (typewriter effect),
 * e.g. for an AI response or any content arriving progressively. Restarts
 * whenever `text` changes.
 *
 * A screen reader gets the full text immediately via a visually-hidden
 * `role="status"` node instead of a stream of partial announcements, so the
 * animation is purely decorative for assistive tech. `prefers-reduced-motion`
 * renders the full text instantly with no cursor.
 */
export function StreamingText({
  text,
  speed = 40,
  cursor = true,
  onComplete,
  className,
  ...rest
}: StreamingTextProps) {
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getServerReducedMotion,
  );

  const [revealed, setRevealed] = useState(() => (reducedMotion ? text.length : 0));
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(text.length);
      onCompleteRef.current?.();
      return;
    }

    setRevealed(0);
    if (text.length === 0) {
      onCompleteRef.current?.();
      return;
    }

    const charsPerMs = speed / 1000;
    let frame: number;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const count = Math.min(text.length, Math.floor((timestamp - start) * charsPerMs));
      setRevealed(count);
      if (count < text.length) {
        frame = requestAnimationFrame(tick);
      } else {
        onCompleteRef.current?.();
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, speed, reducedMotion]);

  const done = revealed >= text.length;

  return (
    <span className={cn("ml-streamingtext", className)} {...rest}>
      <span aria-hidden="true">
        {text.slice(0, revealed)}
        {cursor && !done && !reducedMotion && <span className="ml-streamingtext-cursor" />}
      </span>
      <span className="ml-visually-hidden" role="status">
        {text}
      </span>
    </span>
  );
}
