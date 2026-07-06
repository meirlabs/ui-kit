import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

/* ── local controllable-state helper (no shared hook file) ── */
function useControllableState<T>(
  controlled: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? (controlled as T) : uncontrolled;
  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) setUncontrolled(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );
  return [value, setValue] as const;
}

interface RadioContextValue {
  name: string;
  value: string | undefined;
  hasValue: boolean;
  disabled: boolean;
  select: (value: string) => void;
}

const RadioContext = createContext<RadioContextValue | null>(null);

export interface RadioGroupProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange" | "defaultValue"> {
  /** Controlled selected value. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Shared `name` for the underlying radios; auto-generated if omitted. */
  name?: string;
  orientation?: "horizontal" | "vertical";
  /** Disable every radio in the group. */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * RadioGroup — `role="radiogroup"` wrapper. Uses native `<input type="radio">`
 * children sharing a `name`, so Arrow-key roving selection and single-tab-stop
 * behaviour come from the platform (APG radio pattern). Controlled and
 * uncontrolled both supported.
 */
export function RadioGroup({
  value,
  defaultValue,
  onChange,
  name,
  orientation = "vertical",
  disabled = false,
  className,
  children,
  ...rest
}: RadioGroupProps) {
  const autoName = useId();
  const [selected, setSelected] = useControllableState(
    value,
    defaultValue as string,
    onChange,
  );

  const ctx: RadioContextValue = {
    name: name ?? autoName,
    value: selected,
    hasValue: selected != null,
    disabled,
    select: setSelected,
  };

  return (
    <RadioContext.Provider value={ctx}>
      <div
        role="radiogroup"
        aria-orientation={orientation}
        className={cn("ml-radio-group", `ml-radio-group--${orientation}`, className)}
        {...rest}
      >
        {children}
      </div>
    </RadioContext.Provider>
  );
}

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "value" | "onChange"> {
  /** The value this radio contributes to its RadioGroup. */
  value: string;
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
}

/**
 * Radio — a real `<input type="radio">` visually replaced by a monochrome dot.
 * Must be rendered inside a {@link RadioGroup}.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, description, className, disabled, id, ...rest },
  ref,
) {
  const ctx = useContext(RadioContext);
  if (!ctx) {
    throw new Error("<Radio> must be used within a <RadioGroup>.");
  }
  const checked = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;
  // Roving tab stop: the checked radio is tabbable; if nothing is selected the
  // first radio should be reachable — native radios make every one tabbable
  // when the group has no selection, so leave tabIndex unset in that case.
  const tabIndex = ctx.hasValue ? (checked ? 0 : -1) : undefined;

  return (
    <label
      className={cn("ml-radio", isDisabled && "ml-radio--disabled", className)}
    >
      <span className="ml-radio-control">
        <input
          ref={ref}
          id={id}
          type="radio"
          className="ml-radio-input"
          name={ctx.name}
          value={value}
          checked={checked}
          disabled={isDisabled}
          tabIndex={tabIndex}
          onChange={() => ctx.select(value)}
          {...rest}
        />
        <span className="ml-radio-box" aria-hidden="true">
          <span className="ml-radio-dot" />
        </span>
      </span>
      {(label || description) && (
        <span className="ml-radio-text">
          {label && <span className="ml-radio-label">{label}</span>}
          {description && (
            <span className="ml-radio-description">{description}</span>
          )}
        </span>
      )}
    </label>
  );
});
