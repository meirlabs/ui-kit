import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

const toneClass = {
  warning: "ml-banner-warning",
  error: "ml-banner-error",
  info: "ml-banner-info",
} as const;

export interface BannerProps extends ComponentPropsWithoutRef<"div"> {
  tone?: keyof typeof toneClass;
}

export function Banner({ tone = "info", className, children, ...rest }: BannerProps) {
  return (
    <div className={cn("ml-banner", toneClass[tone], className)} {...rest}>
      {children}
    </div>
  );
}
