import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

export const openApplicationStatus = () =>
  window.dispatchEvent(new CustomEvent("geat:application-status"));

const links = [
  { label: "How to apply", to: "/careers/how-to-apply" },
  { label: "Life at GEAT", to: "/careers/life-at-geat" },
  { label: "FAQs & support", to: "/careers/faq" },
];

/**
 * Sticky secondary nav for the /careers tree.
 *
 * This bar used to render its own `h-16 lg:h-20` spacer div, because the fixed
 * header reserved no space in flow and this was the first in-flow element on
 * every careers page — its natural position was y=0, behind the header, and
 * `sticky top-16` shifted it down without reserving anything, so the
 * breadcrumb underneath laid out at y=121 behind this bar's opaque gradient.
 *
 * That reservation is now made once, globally, by `body { padding-top }` in
 * index.css. Two spacers were briefly rendering on careers routes — this one
 * and a matching one in Navbar — which is what produced the double gap under
 * the header. Both are gone; do not reintroduce one here.
 *
 * Keep the heights in lockstep: header `h-16 lg:h-20`, body padding
 * `4rem / 5rem`, sticky offset `top-16 lg:top-20`.
 */
const CareersSubNav = () => {
  const { pathname } = useLocation();
  const t = useT();

  return (
      <nav
        aria-label={t("Careers")}
        className="sticky top-16 z-40 border-b border-border bg-gradient-to-b from-muted to-background shadow-sm lg:top-20"
      >
        <div className="section-container no-scrollbar flex items-center gap-5 overflow-x-auto py-1 sm:gap-6 sm:py-1.5">
          <Link
            to="/careers"
            className="tap-target shrink-0 whitespace-nowrap font-heading text-sm font-bold text-foreground"
          >
            {t("Jobs and careers")}
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-5 text-sm">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={pathname === l.to ? "page" : undefined}
                className={`tap-target whitespace-nowrap text-foreground transition-colors hover:text-accent ${
                  pathname === l.to ? "font-semibold" : ""
                }`}
              >
                {/* The current page is marked by an amber rule, not by an
                    orange label: the state must not be carried by colour
                    alone (WCAG 1.4.1), and orange is never text on a light
                    ground. The underline lives on this span because
                    `.tap-target` is an inline-flex box and text-decoration
                    does not reliably propagate into flex items. */}
                <span
                  className={
                    pathname === l.to
                      ? "underline decoration-primary decoration-2 underline-offset-4"
                      : undefined
                  }
                >
                  {t(l.label)}
                </span>
              </Link>
            ))}
            <button
              type="button"
              onClick={openApplicationStatus}
              className="tap-target whitespace-nowrap text-foreground transition-colors hover:text-accent"
            >
              {t("Application status")}
            </button>
            <Link
              to="/careers/jobs"
              className="tap-target shrink-0 gap-1.5 rounded-md bg-brand px-4 py-2 font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
            >
              {t("All Jobs")} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </nav>
  );
};

export default CareersSubNav;
