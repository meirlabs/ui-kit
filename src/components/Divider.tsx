import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../utils/cn";

export function Divider({ className, ...rest }: ComponentPropsWithoutRef<"hr">) {
  return <hr className={cn("ml-divider", className)} {...rest} />;
}
