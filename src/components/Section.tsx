import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export interface SectionProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  /** Quiet section header (15px muted — no uppercase, no bold). */
  title?: ReactNode;
}

/**
 * `Section` — a titled content block with a 32px gap to the next section.
 *
 * The header uses the quiet label register (15px, `--ml-text-muted`, weight
 * 400, no uppercase) so it groups without competing with page/card titles
 * (spec §6). One heading per section.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { title, className, children, ...rest },
  ref,
) {
  return (
    <section ref={ref} className={cn("ml-section", className)} {...rest}>
      {title != null && <h2 className="ml-section-title">{title}</h2>}
      {children}
    </section>
  );
});
