import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

const toneClass = {
  good: "ml-status-pill-good",
  warn: "ml-status-pill-warn",
  neutral: "ml-status-pill-neutral",
} as const;

export interface StatusPillProps extends ComponentPropsWithoutRef<"span"> {
  tone: keyof typeof toneClass;
}

export function StatusPill({ tone, className, children, ...rest }: StatusPillProps) {
  return (
    <span className={cn("ml-status-pill", toneClass[tone], className)} {...rest}>
      {children}
    </span>
  );
}
