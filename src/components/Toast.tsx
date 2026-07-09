import type { ReactNode } from "react";
import {
  Toaster as SonnerToaster,
  type ExternalToast,
  type ToastClassnames,
  type ToasterProps as SonnerToasterProps,
  toast as sonnerToast,
} from "sonner";
import { cn } from "../utils/cn";

/** Options accepted by `toast()` (Sonner's `ExternalToast`). */
export type { ExternalToast as ToastOptions } from "sonner";

/* ─── Dedupe (motion.md §"Don't show the same snack bar twice") ───
   A duplicate toast tells the user nothing new. While a message is still on
   screen, re-firing it must not add a copy:
   - front toast → shake it in place and reset its timer;
   - buried behind newer toasts → dismiss + re-fire so it returns to the front
     with a fresh timer, staying up long enough to read again.
   Dedupe keys on tone + title + description, only for string titles; passing
   your own `id` opts out (you're managing identity yourself). */

type TitledMethod = "default" | "message" | "success" | "error" | "warning" | "info";

/** Sonner's title type (`titleT`, not exported): a node or a node factory. */
type ToastTitle = (() => ReactNode) | ReactNode;

/** message-key → live toast id, pruned via onDismiss/onAutoClose. */
const activeByKey = new Map<string, string | number>();

function dedupeKey(
  method: TitledMethod,
  message: string,
  options?: ExternalToast,
): string {
  const description =
    typeof options?.description === "string" ? options.description : "";
  return [method, message, description].join("\u0000");
}

/** Chain map cleanup onto the caller's lifecycle callbacks. */
function withCleanup(key: string, options?: ExternalToast): ExternalToast {
  const cleanup = (id: string | number) => {
    if (activeByKey.get(key) === id) activeByKey.delete(key);
  };
  return {
    ...options,
    onDismiss: (t) => {
      cleanup(t.id);
      options?.onDismiss?.(t);
    },
    onAutoClose: (t) => {
      cleanup(t.id);
      options?.onAutoClose?.(t);
    },
  };
}

/** Transform-only shake on the front toast, re-triggerable (see toast.css /
    motion.md nudge rule). Sonner renders no per-toast id attribute, but the
    shaken toast is by definition the front one. */
function shakeFrontToast() {
  if (typeof document === "undefined") return;
  const el = document.querySelector('[data-sonner-toast][data-front="true"]');
  if (!el) return;
  el.classList.remove("ml-toast-shake");
  // Force a reflow so re-adding the class restarts the animation.
  void (el as HTMLElement).offsetWidth;
  el.classList.add("ml-toast-shake");
  el.addEventListener(
    "animationend",
    () => el.classList.remove("ml-toast-shake"),
    { once: true },
  );
}

function fire(
  method: TitledMethod,
  message: ToastTitle,
  options?: ExternalToast,
): string | number {
  const base = method === "default" ? sonnerToast : sonnerToast[method];
  // Non-string titles can't be keyed; an explicit id means the caller manages
  // identity (Sonner already updates in place). Both skip dedupe.
  if (typeof message !== "string" || options?.id != null) {
    return base(message, options);
  }

  const key = dedupeKey(method, message, options);
  const existingId = activeByKey.get(key);
  if (existingId != null) {
    // Sonner appends new toasts to its state, so the last active one is the
    // front of the rendered stack.
    const active = sonnerToast.getToasts();
    const isLive = active.some((t) => t.id === existingId);
    if (isLive && active[active.length - 1]?.id === existingId) {
      // Same message, front toast: reset its timer in place and shake it —
      // "this just happened again" without piling up copies.
      const id = base(message, { ...withCleanup(key, options), id: existingId });
      shakeFrontToast();
      return id;
    }
    if (isLive) {
      // Buried behind newer toasts: bring it to the front with a fresh timer.
      sonnerToast.dismiss(existingId);
    }
    // Stale entry (dismissed programmatically) falls through and re-fires.
    activeByKey.delete(key);
  }

  const id = base(message, withCleanup(key, options));
  activeByKey.set(key, id);
  return id;
}

/**
 * `toast` — Sonner's imperative API with the kit's dedupe layer, so consumers
 * do `import { Toaster, toast } from "@meir-labs/ui-kit"` and never depend on
 * sonner directly. `toast("Saved")`, `toast.success(...)`, `toast.error(...)`,
 * `toast.warning(...)`, `toast.info(...)`, `toast.loading(...)`,
 * `toast.promise(...)`, `toast.dismiss(id?)`.
 *
 * Firing a message that is already on screen never stacks a duplicate: the
 * existing toast shakes and its timer resets, or — if newer toasts buried it —
 * it jumps back to the front. Pass your own `id` to opt out.
 */
export const toast: typeof sonnerToast = Object.assign(
  (message: ToastTitle, options?: ExternalToast) =>
    fire("default", message, options),
  sonnerToast,
  {
    message: (message: ToastTitle, options?: ExternalToast) =>
      fire("message", message, options),
    success: (message: ToastTitle, options?: ExternalToast) =>
      fire("success", message, options),
    error: (message: ToastTitle, options?: ExternalToast) =>
      fire("error", message, options),
    warning: (message: ToastTitle, options?: ExternalToast) =>
      fire("warning", message, options),
    info: (message: ToastTitle, options?: ExternalToast) =>
      fire("info", message, options),
    dismiss: (id?: string | number) => {
      if (id == null) activeByKey.clear();
      else {
        for (const [key, activeId] of activeByKey) {
          if (activeId === id) activeByKey.delete(key);
        }
      }
      return sonnerToast.dismiss(id);
    },
  },
);

/** Corner of the viewport the toast stack renders in. */
export type ToastPlacement =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export interface ToasterProps extends Omit<SonnerToasterProps, "position"> {
  /** Corner of the viewport the stack renders in. Maps to Sonner's `position`. */
  placement?: ToastPlacement;
}

/**
 * The kit's class hooks, mapped onto Sonner's slots. `toast.error` renders as
 * the kit's `danger` tone; `info` stays neutral gray per the monochrome
 * contract. Styled by `src/styles/toast.css` via `--ml-*` tokens only, so
 * light/dark follow `data-meirlabs-theme` automatically.
 */
const KIT_CLASSNAMES: ToastClassnames = {
  toast: "ml-toast",
  content: "ml-toast-content",
  title: "ml-toast-title",
  description: "ml-toast-description",
  icon: "ml-toast-icon",
  loader: "ml-toast-loader",
  actionButton: "ml-toast-action",
  cancelButton: "ml-toast-cancel",
  closeButton: "ml-toast-close",
  default: "ml-toast-neutral",
  success: "ml-toast-success",
  info: "ml-toast-info",
  warning: "ml-toast-warning",
  error: "ml-toast-danger",
  loading: "ml-toast-loading",
};

function mergeToastClassNames(user?: ToastClassnames): ToastClassnames {
  if (!user) return KIT_CLASSNAMES;
  const merged: ToastClassnames = { ...KIT_CLASSNAMES };
  for (const key of Object.keys(user) as (keyof ToastClassnames)[]) {
    merged[key] = cn(KIT_CLASSNAMES[key], user[key]);
  }
  return merged;
}

/**
 * Toaster — the kit's toast outlet, a themed wrapper around Sonner's
 * `<Toaster>`. Mount once at the app root, then fire messages with `toast()`.
 * No provider or hook needed.
 *
 * - `placement` maps to Sonner's `position` (default `"bottom-right"`).
 * - `dir` defaults to `"auto"` so RTL (Hebrew) pages lay out correctly.
 * - `icons` passes through so apps can inject their own icon set (e.g.
 *   Hugeicons Pro) — the kit stays icon-agnostic and bundles none.
 * - Every other Sonner prop (`richColors`, `closeButton`, `expand`,
 *   `visibleToasts`, ...) passes through untouched.
 */
export function Toaster({
  placement = "bottom-right",
  dir = "auto",
  duration = 5000,
  gap = 12,
  className,
  toastOptions,
  ...rest
}: ToasterProps) {
  return (
    <SonnerToaster
      position={placement}
      dir={dir}
      duration={duration}
      gap={gap}
      className={cn("ml-toaster", className)}
      toastOptions={{
        ...toastOptions,
        classNames: mergeToastClassNames(toastOptions?.classNames),
      }}
      {...rest}
    />
  );
}
