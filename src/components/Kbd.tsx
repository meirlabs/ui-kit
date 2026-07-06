import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { cn } from "../utils/cn";

export interface KbdProps extends Omit<ComponentPropsWithoutRef<"span">, "children"> {
  /** Keys to render, e.g. `["mod", "K"]`. Ignored if `children` is provided. */
  keys?: string[];
  /** Map logical key names (`mod`, `shift`, `enter`, arrows…) to platform
   *  glyphs (⌘ on macOS, Ctrl elsewhere). Default true. */
  mapGlyphs?: boolean;
  /** Freeform content — renders a single cap. Overrides `keys`. */
  children?: ReactNode;
}

const GLYPHS: Record<string, string> = {
  shift: "⇧",
  alt: "⌥",
  option: "⌥",
  enter: "↵",
  return: "↵",
  escape: "Esc",
  esc: "Esc",
  tab: "⇥",
  backspace: "⌫",
  delete: "⌦",
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
  space: "Space",
};

function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const platform = navigator.platform || navigator.userAgent || "";
    setIsMac(/mac|iphone|ipad|ipod/i.test(platform));
  }, []);
  return isMac;
}

function glyphFor(key: string, isMac: boolean, mapGlyphs: boolean): string {
  if (!mapGlyphs) return key;
  const lower = key.toLowerCase();
  if (lower === "mod" || lower === "cmd" || lower === "command" || lower === "meta") {
    return isMac ? "⌘" : "Ctrl";
  }
  if (lower === "ctrl" || lower === "control") return isMac ? "⌃" : "Ctrl";
  if (GLYPHS[lower]) return GLYPHS[lower];
  // Single letters render uppercase; multi-char words stay as given.
  return key.length === 1 ? key.toUpperCase() : key;
}

/**
 * Kbd — a small monochrome keyboard-shortcut badge. Renders one cap per key,
 * mapping logical names (`mod`, `shift`, `enter`, arrows) to platform glyphs.
 * No motion. Used by CommandPalette and docs.
 */
export const Kbd = forwardRef<HTMLSpanElement, KbdProps>(function Kbd(
  { keys, mapGlyphs = true, children, className, ...rest },
  ref,
) {
  const isMac = useIsMac();

  if (children != null) {
    return (
      <span ref={ref} className={cn("ml-kbd", className)} {...rest}>
        <kbd className="ml-kbd-key">{children}</kbd>
      </span>
    );
  }

  return (
    <span ref={ref} className={cn("ml-kbd", className)} {...rest}>
      {(keys ?? []).map((key, i) => (
        <kbd key={`${key}-${i}`} className="ml-kbd-key">
          {glyphFor(key, isMac, mapGlyphs)}
        </kbd>
      ))}
    </span>
  );
});
