import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

const toneClass = {
  good: "ml-badge-good",
  warn: "ml-badge-warn",
  danger: "ml-badge-danger",
  neutral: "ml-badge-neutral",
} as const;

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  tone?: keyof typeof toneClass;
}

export function Badge({ tone = "neutral", className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn("ml-badge", toneClass[tone], className)} {...rest}>
      {children}
    </span>
  );
}
