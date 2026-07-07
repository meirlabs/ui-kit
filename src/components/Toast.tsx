import {
  Toaster as SonnerToaster,
  type ToastClassnames,
  type ToasterProps as SonnerToasterProps,
} from "sonner";
import { cn } from "../utils/cn";

/**
 * `toast` — Sonner's imperative API, re-exported so consumers do
 * `import { Toaster, toast } from "@meir-labs/ui-kit"` and never depend on
 * sonner directly. `toast("Saved")`, `toast.success(...)`, `toast.error(...)`,
 * `toast.warning(...)`, `toast.info(...)`, `toast.loading(...)`,
 * `toast.promise(...)`, `toast.dismiss(id?)`.
 */
export { toast } from "sonner";

/** Options accepted by `toast()` (Sonner's `ExternalToast`). */
export type { ExternalToast as ToastOptions } from "sonner";

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
