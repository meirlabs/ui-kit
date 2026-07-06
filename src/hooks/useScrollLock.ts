import { useEffect } from "react";

/**
 * Ref-counted body scroll lock for overlays.
 *
 * While any overlay holds a lock, `document.body` is set to `overflow: hidden`
 * and its right padding is padded by the scrollbar width so the page does not
 * reflow / shift when the scrollbar disappears. Because the counter is shared at
 * module scope, nested overlays (e.g. a Dropdown opened inside a Modal) never
 * unlock the body early — the body only unlocks once the *last* lock releases.
 *
 * SSR-safe: all DOM access is guarded and only runs inside the effect.
 */

let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

function applyLock() {
  if (typeof document === "undefined") return;
  lockCount += 1;
  if (lockCount > 1) return; // already locked by an outer overlay

  const body = document.body;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

  previousOverflow = body.style.overflow;
  previousPaddingRight = body.style.paddingRight;

  body.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const current = parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${current + scrollbarWidth}px`;
  }
}

function releaseLock() {
  if (typeof document === "undefined") return;
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return; // an outer overlay still needs the lock

  const body = document.body;
  body.style.overflow = previousOverflow;
  body.style.paddingRight = previousPaddingRight;
}

/**
 * Lock body scroll while `active` is true. Automatically releases on unmount or
 * when `active` flips to false.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    applyLock();
    return releaseLock;
  }, [active]);
}
