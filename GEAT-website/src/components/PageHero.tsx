import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumb, { type BreadcrumbLink } from "@/components/Breadcrumb";
import { useT } from "@/i18n/LanguageContext";
import {
  HERO_CONTENT_PADDING,
  HERO_FRAME,
  HERO_IMAGE,
  HERO_IMAGE_HEIGHT,
  HERO_IMAGE_WIDTH,
} from "@/components/heroStyles";

export interface HeroCta {
  label: string;
  href: string;
}

interface PageHeroProps {
  /** Small uppercase label above the title */
  title: string;
  /** Optional trailing words of the title rendered in the orange gradient */
  highlight?: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  /** Breadcrumb current page label. Omit on the homepage. */
  breadcrumb?: string;
  /** Optional intermediate breadcrumb links between Home and the current page */
  breadcrumbTrail?: BreadcrumbLink[];
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  children?: React.ReactNode;
  /** Vertical alignment of the hero content block. */
  align?: "bottom" | "center";
}

const isInternal = (href: string) => href.startsWith("/");

const HeroButton = ({
  cta,
  variant,
}: {
  cta: HeroCta;
  variant: "primary" | "outline";
}) => {
  const t = useT();
  const className = `btn-cta group ${variant === "outline" ? "btn-cta-outline-light" : ""}`;
  const content = (
    <>
      <span>{t(cta.label)}</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </>
  );

  return isInternal(cta.href) ? (
    <Link to={cta.href} className={className}>
      {content}
    </Link>
  ) : (
    <a href={cta.href} className={className}>
      {content}
    </a>
  );
};

/**
 * The single hero design used across every GEAT page.
 * Only title, subtitle, image, breadcrumb and CTAs change per page.
 */
const PageHero = ({
  title,
  highlight,
  subtitle,
  image,
  imageAlt,
  breadcrumb,
  breadcrumbTrail,
  primaryCta,
  secondaryCta,
  children,
  align = "bottom",
}: PageHeroProps) => {
  const t = useT();
  return (
  <section
    className={`${HERO_FRAME} ${HERO_CONTENT_PADDING} ${align === "center" ? "items-center" : ""}`}
  >
    <img
      src={image}
      alt={t(imageAlt)}
      className={`${HERO_IMAGE} animate-ken-burns`}
      loading="eager"
      /* Lowercase DOM attribute, not React 19's camelCase `fetchPriority`
         prop — on React 18.3 that spelling is unrecognised and logs a
         console warning on every route instead of hinting the LCP image. */
      {...{ fetchpriority: "high" }}
      width={HERO_IMAGE_WIDTH}
      height={HERO_IMAGE_HEIGHT}
    />
    {/* Horizontal scrim.
        The thin end of this gradient used to be /45 at EVERY width, and that
        is a width-dependent bug: the copy block below is `max-w-3xl`, so on a
        wide viewport it stops well before the pale end of the sweep and sits
        over 80–95% ground, but at 390px it spans the whole frame and its last
        third lands on the /45 stop. Measured over the hero photographs at
        390px the subtitle read 2.55:1 (/products-services/gas-turbines),
        3.30 (/careers/how-to-apply), 3.73 (/careers/faq), 3.93 (/news) and
        4.09 (/contact) — the token is right (--muted-foreground is 6.38:1 on
        flat navy), the ground was not there.

        So below `sm` the sweep now holds the same 85% floor `.text-scrim`
        guarantees, which is the opacity at which --muted-foreground clears
        4.5:1 even against a pure-white photograph (5.11:1, see the .text-scrim
        note in index.css). From `sm` up the copy is capped inside a much wider
        container, never reaches the thin end, and the photograph opens back
        up exactly as before — those viewports already measured clean. */}
    <div className="absolute inset-0 bg-gradient-to-r from-geat-dark/95 via-geat-dark/90 to-geat-dark/85 sm:via-geat-dark/80 sm:to-geat-dark/45" />
    <div className="absolute inset-0 bg-gradient-to-t from-geat-dark/80 via-transparent to-geat-dark/40" />

    <div className="section-container relative z-10 w-full text-foreground">
      {breadcrumb && <Breadcrumb current={breadcrumb} trail={breadcrumbTrail} />}
      <div className="relative max-w-3xl pl-6 lg:pl-8">
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />
        <h1 className="reveal reveal-delay-1 hero-headline whitespace-pre-line text-foreground">
          {t(title)}
          {highlight && <> <span className="text-highlight">{t(highlight)}</span></>}
        </h1>
        {subtitle && (
          <p className="reveal reveal-delay-2 mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            {t(subtitle)}
          </p>
        )}
        {(primaryCta || secondaryCta) && (
          <div className="reveal reveal-delay-3 mt-8 flex flex-wrap gap-4">
            {primaryCta && <HeroButton cta={primaryCta} variant="primary" />}
            {secondaryCta && <HeroButton cta={secondaryCta} variant="outline" />}
          </div>
        )}
        {children}
      </div>
    </div>
  </section>
  );
};

export default PageHero;
