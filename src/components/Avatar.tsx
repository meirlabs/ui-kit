import {
  forwardRef,
  useEffect,
  useState,
  type ComponentPropsWithoutRef,
  type Ref,
} from "react";
import { cn } from "../utils/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

export interface AvatarProps extends ComponentPropsWithoutRef<"div"> {
  src?: string;
  alt?: string;
  /** Initials / short text shown when there's no image or the image fails. */
  fallback?: string;
  size?: AvatarSize;
  /** Presence dot in a functional status color. */
  status?: AvatarStatus;
  /**
   * Render a focusable `<button>` wrapper with the 2px focus ring — for
   * avatar-menu triggers.
   */
  interactive?: boolean;
  /** Circular by default (contract §3). Pass `round={false}` for an 8px-radius square. */
  round?: boolean;
}

const sizeClass: Record<AvatarSize, string> = {
  xs: "ml-avatar-xs",
  sm: "ml-avatar-sm",
  md: "",
  lg: "ml-avatar-lg",
};

/** Fall back to `alt` initials if no explicit fallback is given. */
function initialsFrom(fallback?: string, alt?: string): string {
  if (fallback) return fallback;
  if (!alt) return "";
  return alt
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export const Avatar = forwardRef<HTMLDivElement | HTMLButtonElement, AvatarProps>(
  function Avatar(
    {
      src,
      alt,
      fallback,
      size = "md",
      status,
      interactive = false,
      round = true,
      className,
      ...rest
    },
    ref,
  ) {
    const [errored, setErrored] = useState(false);
    const [loaded, setLoaded] = useState(false);

    // Reset load/error state whenever the source changes.
    useEffect(() => {
      setErrored(false);
      setLoaded(false);
    }, [src]);

    const showImage = Boolean(src) && !errored;
    const isLoading = showImage && !loaded;
    const initials = initialsFrom(fallback, alt);

    const classes = cn(
      "ml-avatar",
      sizeClass[size],
      !round && "ml-avatar-square",
      interactive && "ml-avatar-interactive",
      isLoading && "ml-avatar-loading",
      className,
    );

    const inner = (
      <>
        {showImage ? (
          <img
            src={src}
            alt={alt ?? ""}
            onLoad={() => setLoaded(true)}
            // never show a broken-image glyph — swap to initials/fallback
            onError={() => setErrored(true)}
          />
        ) : (
          <span className="ml-avatar-initials">{initials}</span>
        )}
        {status && (
          <span
            className={cn("ml-avatar-status", `ml-avatar-status-${status}`)}
            role="img"
            aria-label={status}
          />
        )}
      </>
    );

    if (interactive) {
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          className={classes}
          {...(rest as unknown as ComponentPropsWithoutRef<"button">)}
        >
          {inner}
        </button>
      );
    }

    return (
      <div ref={ref as Ref<HTMLDivElement>} className={classes} {...rest}>
        {inner}
      </div>
    );
  },
);
