import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../utils/cn";

/** SSR-safe layout effect — falls back to useEffect on the server. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface TabItem {
  value: string;
  label: ReactNode;
  /** Optional leading icon (icon-agnostic — pass any ReactNode). */
  icon?: ReactNode;
  disabled?: boolean;
}

export interface TabsProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  /** Required — names the tablist for assistive tech. */
  "aria-label": string;
}

interface TabsContextValue {
  baseId: string;
  value: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function tabId(baseId: string, value: string) {
  return `${baseId}-tab-${value}`;
}
function panelId(baseId: string, value: string) {
  return `${baseId}-panel-${value}`;
}

/**
 * Tabs — an APG-compliant tablist (WAI-ARIA Tabs pattern) for switching between
 * peer views. Automatic activation: ArrowLeft/Right (and Home/End) move focus
 * **and** selection, skipping disabled tabs. Uses a roving tabindex so only one
 * tab is in the tab sequence at a time.
 *
 * The active-indicator underline is a single element that slides by `transform`
 * (reduced-motion guarded); tab labels keep the **same weight in both states**
 * so the row never reflows (only color changes). For many tabs, the strip opts
 * into a horizontal scroll-mask with a hidden scrollbar.
 *
 * Pair with {@link TabsPanel} (`Tabs.Panel`) to render the associated
 * `role="tabpanel"` region wired with `aria-labelledby`/`aria-controls`.
 */
function TabsRoot({
  tabs,
  value,
  onChange,
  className,
  children,
  ...rest
}: TabsProps) {
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
    ready: boolean;
  }>({ left: 0, width: 0, ready: false });

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.value === value),
  );

  const measure = useCallback(() => {
    const btn = btnRefs.current[activeIndex];
    if (!btn) return;
    setIndicator({
      left: btn.offsetLeft,
      width: btn.offsetWidth,
      ready: true,
    });
  }, [activeIndex]);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure, tabs.length, value]);

  // Re-measure on resize so the underline stays glued to the active tab.
  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const focusTab = useCallback(
    (index: number) => {
      const btn = btnRefs.current[index];
      btn?.focus();
      const target = tabs[index];
      if (target && !target.disabled) onChange(target.value);
    },
    [onChange, tabs],
  );

  const nextEnabled = useCallback(
    (from: number, dir: 1 | -1) => {
      const n = tabs.length;
      for (let step = 1; step <= n; step++) {
        const i = (from + dir * step + n * step) % n;
        if (!tabs[i]?.disabled) return i;
      }
      return from;
    },
    [tabs],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let target: number | null = null;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          target = nextEnabled(index, 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          target = nextEnabled(index, -1);
          break;
        case "Home":
          target = nextEnabled(-1, 1);
          break;
        case "End":
          target = nextEnabled(0, -1);
          break;
        default:
          return;
      }
      if (target != null) {
        e.preventDefault();
        focusTab(target);
      }
    },
    [focusTab, nextEnabled],
  );

  return (
    <TabsContext.Provider value={{ baseId, value }}>
      <div
        ref={listRef}
        role="tablist"
        className={cn("ml-tabs ml-scroll-mask-x", className)}
        {...rest}
      >
        {tabs.map((tab, i) => {
          const selected = tab.value === value;
          return (
            <button
              key={tab.value}
              ref={(el) => {
                btnRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(baseId, tab.value)}
              aria-selected={selected}
              aria-controls={panelId(baseId, tab.value)}
              aria-disabled={tab.disabled || undefined}
              disabled={tab.disabled}
              tabIndex={selected ? 0 : -1}
              className={cn("ml-tabs-btn", selected && "active")}
              onClick={() => {
                if (!tab.disabled) onChange(tab.value);
              }}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {tab.icon != null && (
                <span className="ml-tabs-icon" aria-hidden="true">
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
        <span
          aria-hidden="true"
          className="ml-tabs-indicator"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width,
            opacity: indicator.ready ? 1 : 0,
          }}
        />
      </div>
      {children}
    </TabsContext.Provider>
  );
}

export interface TabsPanelProps extends ComponentPropsWithoutRef<"div"> {
  /** Matches the `value` of the tab this panel belongs to. */
  value: string;
}

/**
 * Tabs.Panel — the `role="tabpanel"` region for a given tab `value`. Renders
 * only while its tab is selected (mounts/unmounts rather than `display:none`),
 * is focusable (`tabIndex=0`) and labelled by its tab. Must be a descendant of
 * {@link Tabs}.
 */
export function TabsPanel({
  value,
  className,
  children,
  ...rest
}: TabsPanelProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs.Panel must be rendered inside <Tabs>");
  }
  if (ctx.value !== value) return null;
  return (
    <div
      role="tabpanel"
      id={panelId(ctx.baseId, value)}
      aria-labelledby={tabId(ctx.baseId, value)}
      tabIndex={0}
      className={cn("ml-tabs-panel", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, { Panel: TabsPanel });
