import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  forwardRef,
} from "react";
import { cn } from "../utils/cn";

export interface PageHeaderProps
  extends Omit<ComponentPropsWithoutRef<"div">, "title"> {
  /** Page title (36px/600 — use sparingly, one per page). */
  title: ReactNode;
  /** Supporting line below the title. */
  subtitle?: ReactNode;
  /** Breadcrumb slot rendered above the title (e.g. WS5 `<Breadcrumbs />`). */
  breadcrumb?: ReactNode;
  /** Right-aligned actions (buttons, menus) on the title row. */
  actions?: ReactNode;
  /** Render a back link above the title as an anchor. */
  backHref?: string;
  /** Render a back button above the title; ignored when `backHref` is set. */
  onBack?: () => void;
  /** Accessible label for the back control. */
  backLabel?: string;
}

function BackChevron() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M10 12 6 8l4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * `PageHeader` — the title block at the top of a page.
 *
 * Layout (top to bottom): optional `breadcrumb`, then a row with the
 * back-control + `title` + `subtitle` on the left and `actions` on the right.
 * The title renders at 36px/600 (semibold — never 700).
 *
 * ```tsx
 * <PageHeader
 *   breadcrumb={<Breadcrumbs items={…} />}
 *   backHref="/settings"
 *   title="Billing"
 *   subtitle="Manage your plan and invoices."
 *   actions={<Button>Upgrade</Button>}
 * />
 * ```
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  function PageHeader(
    {
      title,
      subtitle,
      breadcrumb,
      actions,
      backHref,
      onBack,
      backLabel = "Back",
      className,
      children,
      ...rest
    },
    ref,
  ) {
    const showBack = backHref != null || onBack != null;

    return (
      <div ref={ref} className={cn("ml-page-header", className)} {...rest}>
        {breadcrumb != null && (
          <div className="ml-page-header-breadcrumb">{breadcrumb}</div>
        )}
        <div className="ml-page-header-row">
          <div className="ml-page-header-titles">
            {showBack &&
              (backHref != null ? (
                <a className="ml-page-back" href={backHref}>
                  <BackChevron />
                  {backLabel}
                </a>
              ) : (
                <button
                  type="button"
                  className="ml-page-back"
                  onClick={onBack}
                >
                  <BackChevron />
                  {backLabel}
                </button>
              ))}
            <h1 className="ml-page-title">{title}</h1>
            {subtitle != null && <p className="ml-page-subtitle">{subtitle}</p>}
          </div>
          {actions != null && (
            <div className="ml-page-header-actions">{actions}</div>
          )}
        </div>
        {children}
      </div>
    );
  },
);
