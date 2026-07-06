import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toaster, type ToastPlacement } from "../components/Toast";

/** Functional tone of a toast — monochrome neutral by default. */
export type ToastTone = "neutral" | "success" | "warning" | "danger";

/** Optional inline action rendered as a button inside the toast. */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

/** Options accepted by `toast()`. */
export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Auto-dismiss delay in ms. `0` (or negative) keeps it until dismissed. */
  duration?: number;
  action?: ToastAction;
  /** Provide a stable id to update an existing toast in place. */
  id?: string;
}

/** A resolved toast held in the provider queue. */
export interface ToastItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  tone: ToastTone;
  duration: number;
  action?: ToastAction;
  /** True once dismissal starts — drives the exit animation before removal. */
  dismissing: boolean;
}

export interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  toasts: ToastItem[];
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Time the exit animation is allowed before the node is unmounted. */
const EXIT_MS = 200;

interface TimerState {
  handle: ReturnType<typeof setTimeout> | null;
  /** Timestamp the current run started (for pause math). */
  startedAt: number;
  /** Remaining ms when paused. */
  remaining: number;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss delay (ms) when a toast omits `duration`. */
  duration?: number;
  /** Corner of the viewport the stack renders in. */
  placement?: ToastPlacement;
  /** How many toasts are visible at once; the rest queue. */
  maxVisible?: number;
}

/**
 * ToastProvider — holds the toast queue, schedules auto-dismiss timers
 * (paused on hover/focus), enforces `maxVisible` with FIFO queueing, and
 * renders the portal `Toaster` region. Mount once at the app root.
 */
export function ToastProvider({
  children,
  duration = 5000,
  placement = "bottom-right",
  maxVisible = 3,
}: ProviderPropsInternal) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const queueRef = useRef<ToastItem[]>([]);
  const timersRef = useRef<Map<string, TimerState>>(new Map());
  const idCounter = useRef(0);

  const clearTimer = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t?.handle) clearTimeout(t.handle);
    timersRef.current.delete(id);
  }, []);

  const removeToast = useCallback((id: string) => {
    clearTimer(id);
    setToasts((prev) => {
      const rest = prev.filter((t) => t.id !== id);
      const activeCount = rest.filter((t) => !t.dismissing).length;
      if (queueRef.current.length > 0 && activeCount < maxVisible) {
        const next = queueRef.current.shift()!;
        return [...rest, next];
      }
      return rest;
    });
  }, [clearTimer, maxVisible]);

  const dismiss = useCallback(
    (id: string) => {
      // If it's still queued (never rendered), drop it silently.
      const queuedIdx = queueRef.current.findIndex((t) => t.id === id);
      if (queuedIdx !== -1) {
        queueRef.current.splice(queuedIdx, 1);
        return;
      }
      clearTimer(id);
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)),
      );
      setTimeout(() => removeToast(id), EXIT_MS);
    },
    [clearTimer, removeToast],
  );

  const dismissAll = useCallback(() => {
    queueRef.current = [];
    setToasts((prev) => {
      prev.forEach((t) => {
        clearTimer(t.id);
        setTimeout(() => removeToast(t.id), EXIT_MS);
      });
      return prev.map((t) => ({ ...t, dismissing: true }));
    });
  }, [clearTimer, removeToast]);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? `ml-toast-${++idCounter.current}`;
      const item: ToastItem = {
        id,
        title: options.title,
        description: options.description,
        tone: options.tone ?? "neutral",
        duration: options.duration ?? duration,
        action: options.action,
        dismissing: false,
      };

      // Update an existing toast in place (by id) if present.
      const inQueue = queueRef.current.findIndex((t) => t.id === id);
      if (inQueue !== -1) {
        queueRef.current[inQueue] = item;
        return id;
      }

      setToasts((prev) => {
        if (prev.some((t) => t.id === id)) {
          return prev.map((t) => (t.id === id ? item : t));
        }
        const activeCount = prev.filter((t) => !t.dismissing).length;
        if (activeCount >= maxVisible) {
          queueRef.current.push(item);
          return prev;
        }
        return [...prev, item];
      });
      return id;
    },
    [duration, maxVisible],
  );

  // Start a timer for any active toast that doesn't have one yet.
  const startTimer = useCallback(
    (id: string, ms: number) => {
      if (ms <= 0) return;
      const existing = timersRef.current.get(id);
      if (existing) return; // already scheduled (or paused)
      const handle = setTimeout(() => dismiss(id), ms);
      timersRef.current.set(id, { handle, startedAt: Date.now(), remaining: ms });
    },
    [dismiss],
  );

  useEffect(() => {
    for (const t of toasts) {
      if (t.dismissing || t.duration <= 0) continue;
      startTimer(t.id, t.duration);
    }
  }, [toasts, startTimer]);

  const pause = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (!t || t.handle === null) return;
    clearTimeout(t.handle);
    const elapsed = Date.now() - t.startedAt;
    timersRef.current.set(id, {
      handle: null,
      startedAt: t.startedAt,
      remaining: Math.max(0, t.remaining - elapsed),
    });
  }, []);

  const resume = useCallback(
    (id: string) => {
      const t = timersRef.current.get(id);
      if (!t || t.handle !== null) return;
      const handle = setTimeout(() => dismiss(id), t.remaining);
      timersRef.current.set(id, {
        handle,
        startedAt: Date.now(),
        remaining: t.remaining,
      });
    },
    [dismiss],
  );

  // Clear every timer on unmount.
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => t.handle && clearTimeout(t.handle));
      timers.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ toast, dismiss, dismissAll, toasts }),
    [toast, dismiss, dismissAll, toasts],
  );

  return createElement(
    ToastContext.Provider,
    { value },
    children,
    createElement(Toaster, {
      toasts,
      placement,
      onDismiss: dismiss,
      onPause: pause,
      onResume: resume,
    }),
  );
}

// Internal alias so the public prop type name stays clean above.
type ProviderPropsInternal = ToastProviderProps;

/**
 * useToast — read the toast API from context. Must be called under a
 * `<ToastProvider>`.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
