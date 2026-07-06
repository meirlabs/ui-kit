import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type ReactNode,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";

/* ─── Context ─── */

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (ctx == null) {
    throw new Error("Accordion.Item must be used within <Accordion>");
  }
  return ctx;
}

/* ─── Root ─── */

type AccordionSingleProps = {
  type?: "single";
  /** Controlled open value (empty string = none open). */
  value?: string;
  /** Uncontrolled initial open value. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type AccordionMultipleProps = {
  type: "multiple";
  /** Controlled list of open values. */
  value?: string[];
  /** Uncontrolled initial open values. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) &
  Omit<
    ComponentPropsWithoutRef<"div">,
    "onChange" | "defaultValue" | "value" | "type"
  >;

function toArray(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : value ? [value] : [];
}

/**
 * `Accordion` — a compound disclosure list.
 *
 * - `type="single"` (default): at most one panel open; opening one closes the
 *   rest. Clicking the open item collapses it.
 * - `type="multiple"`: any number of panels open independently.
 *
 * Controlled via `value` + `onValueChange`, or uncontrolled via `defaultValue`.
 * Keyboard: Enter/Space toggles, ArrowUp/ArrowDown move between headers, Home /
 * End jump to first/last. Panels animate height + opacity and are hidden with
 * `visibility` (never `display:none`), guarded for reduced motion.
 *
 * ```tsx
 * <Accordion type="single" defaultValue="a">
 *   <Accordion.Item value="a" title="First">Panel A</Accordion.Item>
 *   <Accordion.Item value="b" title="Second">Panel B</Accordion.Item>
 * </Accordion>
 * ```
 */
const AccordionRoot = forwardRef<HTMLDivElement, AccordionProps>(
  function Accordion(props, ref) {
    const {
      type = "single",
      value,
      defaultValue,
      onValueChange,
      className,
      children,
      onKeyDown,
      ...rest
    } = props as AccordionProps & {
      type?: "single" | "multiple";
      value?: string | string[];
      defaultValue?: string | string[];
      onValueChange?: (value: string & string[]) => void;
    };

    const baseId = useId();
    const isControlled = value !== undefined;
    const [internal, setInternal] = useState<string[]>(() =>
      toArray(defaultValue),
    );
    const open = isControlled ? toArray(value) : internal;

    const emit = useCallback(
      (next: string[]) => {
        if (!isControlled) setInternal(next);
        if (type === "multiple") {
          (onValueChange as ((v: string[]) => void) | undefined)?.(next);
        } else {
          (onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? "");
        }
      },
      [isControlled, onValueChange, type],
    );

    const toggle = useCallback(
      (itemValue: string) => {
        const isOpen = open.includes(itemValue);
        if (type === "multiple") {
          emit(
            isOpen
              ? open.filter((v) => v !== itemValue)
              : [...open, itemValue],
          );
        } else {
          emit(isOpen ? [] : [itemValue]);
        }
      },
      [open, type, emit],
    );

    const rootRef = useRef<HTMLDivElement | null>(null);
    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event as KeyboardEvent<never>);
        const target = event.target as HTMLElement;
        if (!target.hasAttribute("data-ml-accordion-trigger")) return;
        const root = rootRef.current;
        if (!root) return;

        const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
        if (!keys.includes(event.key)) return;

        const triggers = Array.from(
          root.querySelectorAll<HTMLButtonElement>(
            "[data-ml-accordion-trigger]:not([disabled])",
          ),
        );
        if (triggers.length === 0) return;

        event.preventDefault();
        const current = triggers.indexOf(target as HTMLButtonElement);
        let next = current;
        switch (event.key) {
          case "ArrowDown":
            next = current < 0 ? 0 : (current + 1) % triggers.length;
            break;
          case "ArrowUp":
            next =
              current < 0
                ? triggers.length - 1
                : (current - 1 + triggers.length) % triggers.length;
            break;
          case "Home":
            next = 0;
            break;
          case "End":
            next = triggers.length - 1;
            break;
        }
        triggers[next]?.focus();
      },
      [onKeyDown],
    );

    const isOpen = useCallback(
      (itemValue: string) => open.includes(itemValue),
      [open],
    );

    const ctx = useMemo<AccordionContextValue>(
      () => ({ isOpen, toggle, baseId }),
      [isOpen, toggle, baseId],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={setRefs}
          className={cn("ml-accordion", className)}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);

/* ─── Item ─── */

export interface AccordionItemProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Unique value identifying this item's open state. */
  value: string;
  /** Header content rendered inside the trigger button. */
  title: ReactNode;
  /** Disable toggling this item. */
  disabled?: boolean;
}

function Chevron() {
  return (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4.5 7 9 11.5 13.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * `Accordion.Item` — a single header + collapsible panel. The header is a
 * `<button>` (`aria-expanded` / `aria-controls`); the panel is a
 * `role="region"` labelled by the header.
 */
const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(
    { value, title, disabled, className, children, ...rest },
    ref,
  ) {
    const { isOpen, toggle, baseId } = useAccordionContext();
    const open = isOpen(value);
    const triggerId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-panel-${value}`;

    return (
      <div
        ref={ref}
        className={cn("ml-accordion-item", className)}
        data-state={open ? "open" : "closed"}
        {...rest}
      >
        <h3 className="ml-accordion-heading">
          <button
            type="button"
            id={triggerId}
            className="ml-accordion-trigger"
            aria-expanded={open}
            aria-controls={panelId}
            disabled={disabled}
            data-ml-accordion-trigger=""
            onClick={() => toggle(value)}
          >
            <span className="ml-accordion-trigger-label">{title}</span>
            <span className="ml-accordion-chevron">
              <Chevron />
            </span>
          </button>
        </h3>
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="ml-accordion-panel"
        >
          <div className="ml-accordion-panel-inner">
            <div className="ml-accordion-panel-content">{children}</div>
          </div>
        </div>
      </div>
    );
  },
);

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
});
