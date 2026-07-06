import {
  cloneElement,
  isValidElement,
  useId,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export interface FieldProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /** Visible label text (14px / 500), rendered in a real `<label htmlFor>`. */
  label: ReactNode;
  /** The form control. If it is a single element, Field injects `id` +
   *  `aria-describedby` + `aria-invalid`/`aria-required` onto it. */
  children: ReactNode;
  /** Force the control id / label target. Falls back to a generated `useId`. */
  htmlFor?: string;
  /** Alias for {@link htmlFor} — the id to place on the control. */
  id?: string;
  /** Helper text below the control, wired via `aria-describedby`. */
  hint?: ReactNode;
  /** Error text — sets `aria-invalid`, gets `role="alert"`, danger styling. */
  error?: ReactNode;
  /** Adds a required indicator + `aria-required` on the control. */
  required?: boolean;
}

/**
 * Field — label + control + hint/error, with the a11y wiring done for you.
 *
 * Renders a `<label htmlFor>` and generates an id it injects onto the child
 * control (unless the child already has one). `hint` and `error` are given ids
 * and linked through `aria-describedby`; `error` also flips `aria-invalid` and
 * renders with `role="alert"`. Composes with {@link Input}, Select,
 * {@link Textarea} and {@link Checkbox} (which forward the injected props).
 */
export function Field({
  label,
  children,
  htmlFor,
  id,
  hint,
  error,
  required,
  className,
  ...rest
}: FieldProps) {
  const autoId = useId();
  const controlId = htmlFor ?? id ?? autoId;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;

  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") ||
    undefined;

  let control: ReactNode = children;
  if (isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    const childProps = child.props;
    const mergedDescribedBy =
      [childProps["aria-describedby"], describedBy].filter(Boolean).join(" ") ||
      undefined;

    const injected: Record<string, unknown> = {
      id: childProps.id ?? controlId,
      "aria-describedby": mergedDescribedBy,
    };
    if (error) injected["aria-invalid"] = true;
    else if (childProps["aria-invalid"] != null)
      injected["aria-invalid"] = childProps["aria-invalid"];
    if (required) {
      injected["aria-required"] = true;
      injected.required = childProps.required ?? true;
    }
    // No `invalid` prop is injected: Input/Textarea already derive their danger
    // styling from the injected `aria-invalid`, and host controls are covered by
    // the `[aria-invalid="true"]` rules in forms.css.

    control = cloneElement(child, injected);
  }

  return (
    <div
      className={cn("ml-field", error && "ml-field--invalid", className)}
      {...rest}
    >
      <label className="ml-field-label" htmlFor={controlId}>
        {label}
        {required && (
          <span className="ml-field-required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {control}
      {hint && (
        <p id={hintId} className="ml-field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="ml-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
