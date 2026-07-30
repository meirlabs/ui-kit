import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "../utils/cn";

export interface BlurImageProps
  extends Omit<ComponentPropsWithoutRef<"img">, "className" | "style"> {
  src: string;
  alt: string;
  /** Intrinsic width in px. Combine with `height` to reserve a fixed-size box. */
  width?: number;
  /** Intrinsic height in px. Combine with `width` to reserve a fixed-size box. */
  height?: number;
  /**
   * Container aspect ratio (e.g. `"16 / 9"` or `1.78`) for a fluid-width box.
   * Derived from `width`/`height` when both are given; set this instead for a
   * responsive image whose pixel size isn't known ahead of time.
   */
  aspectRatio?: string | number;
  /** Shown over the image if it fails to load, in place of a broken-image glyph. */
  fallback?: ReactNode;
  /** Applies to the sized container, not the `<img>` — everything else in this prop set (id, aria-*, loading, decoding, …) lands on the `<img>`. */
  className?: string;
  /** Applies to the sized container, not the `<img>`. */
  style?: CSSProperties;
}

/**
 * BlurImage — an image that fades from blurred + transparent to sharp +
 * opaque once it actually finishes loading (the real `load` event, never a
 * fixed timer — cached and slow images both behave correctly). The container
 * reserves the image's aspect ratio so the fade-in never shifts surrounding
 * layout. An error resolves to the same sharp/opaque end state instead of a
 * stuck blur; `prefers-reduced-motion` drops the animated blur for a quick
 * opacity-only crossfade.
 */
export const BlurImage = forwardRef<HTMLImageElement, BlurImageProps>(function BlurImage(
  { src, alt, width, height, aspectRatio, fallback, className, style, onLoad, onError, ...rest },
  ref,
) {
  const imgRef = useRef<HTMLImageElement>(null);
  useImperativeHandle(ref, () => imgRef.current as HTMLImageElement);

  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  // Reset on every src change, then immediately re-check: a cached image
  // never fires `load` after this runs, so check `complete`/`naturalWidth`
  // synchronously before paint — same effect, so the reset can't clobber a
  // same-tick cache hit (a separate mount effect ordered after this one would).
  useLayoutEffect(() => {
    const img = imgRef.current;
    setLoaded(Boolean(img && img.complete && img.naturalWidth > 0));
    setErrored(false);
  }, [src]);

  const resolvedAspectRatio = aspectRatio ?? (width && height ? `${width} / ${height}` : undefined);
  const containerStyle: CSSProperties | undefined = resolvedAspectRatio
    ? { aspectRatio: resolvedAspectRatio, width: width && height ? width : "100%" }
    : undefined;

  return (
    <span
      className={cn(
        "ml-blur-image",
        loaded && "ml-blur-image-loaded",
        errored && "ml-blur-image-error",
        className,
      )}
      style={{ ...containerStyle, ...style }}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="ml-blur-image-img"
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          setErrored(true);
          onError?.(event);
        }}
        {...rest}
      />
      {errored && fallback && <span className="ml-blur-image-fallback">{fallback}</span>}
    </span>
  );
});
