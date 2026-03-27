import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export interface AvatarProps extends ComponentPropsWithoutRef<"div"> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  round?: boolean;
}

const sizeClass = {
  sm: "ml-avatar-sm",
  md: "",
  lg: "ml-avatar-lg",
} as const;

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  round,
  className,
  ...rest
}: AvatarProps) {
  return (
    <div
      className={cn(
        "ml-avatar",
        sizeClass[size],
        round && "ml-avatar-round",
        className,
      )}
      {...rest}
    >
      {src ? <img src={src} alt={alt ?? ""} /> : (fallback ?? null)}
    </div>
  );
}
