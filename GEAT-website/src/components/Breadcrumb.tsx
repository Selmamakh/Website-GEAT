import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";

export interface BreadcrumbLink {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  current: string;
  /** Optional intermediate links between Home and the current page */
  trail?: BreadcrumbLink[];
  className?: string;
}

/**
 * Colours come from the surface-aware tokens, so the same trail is legible on
 * a white section and inside a `surface-dark` hero without any caller
 * overriding the colour.
 *
 * TARGETS. Every crumb link is a `.tap-target`, so the hit box is at least
 * 44x44 (WCAG 2.5.5 / 2.2 target-size). Before this the links measured 39x20
 * on a fine pointer and axe flagged both nodes on /careers/jobs.
 *
 *   - `justify-start` overrides the utility's centring so the first label
 *     stays flush with the section container's left edge and the trail still
 *     lines up with the <h1> beneath it.
 *   - Separation: the 16px chevron sits between two links with an 8px gap on
 *     each side, so adjacent 44px targets are always 32px apart and can never
 *     overlap — comfortably over the 24px axe wants.
 *
 * The base classes go through `cn()` so a caller's `className` actually wins.
 * With plain interpolation `mb-8` beat a caller's `mb-0`: equal specificity,
 * and Tailwind emits `.mb-0` before `.mb-8`, so the default silently stuck.
 */
const CRUMB_LINK =
  "tap-target justify-start rounded-md transition-colors hover:text-accent";

const Breadcrumb = ({ current, trail = [], className }: BreadcrumbProps) => {
  const t = useT();
  return (
    <nav
      aria-label={t("Breadcrumb")}
      className={cn(
        "mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
        className,
      )}
    >
      <Link to="/" className={CRUMB_LINK}>
        {t("Home")}
      </Link>
      {trail.map((item) => (
        <span key={item.href} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          <Link to={item.href} className={CRUMB_LINK}>
            {t(item.label)}
          </Link>
        </span>
      ))}
      <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span aria-current="page" className="font-medium text-foreground">
        {t(current)}
      </span>
    </nav>
  );
};

export default Breadcrumb;
