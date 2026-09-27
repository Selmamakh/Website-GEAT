/**
 * Shared hero geometry for every page of the GEAT website.
 *
 * WHAT CHANGED AND WHY
 * --------------------
 * Heroes used to be a FIXED height (h-[440px] sm:h-[520px] lg:h-[620px]) with
 * `items-end`, so content hung off the bottom rail and whatever was left over
 * became empty space at the top. Because every page's content block is a
 * different height — one-line vs two-line headline, with or without a
 * breadcrumb, with or without buttons — that leftover varied enormously.
 *
 * Measured at 1440px across 13 routes, clear space between the bottom of the
 * fixed chrome and the first line of hero content:
 *
 *     /products-services       108px   <- tightest
 *     /leadership              168px
 *     /products-services/*     168px
 *     /contact                 168px
 *     /news                    170px
 *     /                        182px
 *     /careers                 188px
 *     /about                   220px
 *     /careers/how-to-apply    248px
 *     /careers/faq             250px
 *     /careers/submit-cv       266px
 *     /careers/life-at-geat    328px   <- loosest
 *
 * A 220px spread on a component whose own doc comment claimed every hero was
 * identical. Two causes:
 *
 *   1. Fixed height + bottom alignment makes the TOP gap a leftover.
 *   2. The fixed header overlays the hero on most routes, but on /careers/*
 *      the sub-nav sits between them in flow, so those heroes were not
 *      overlaid at all. Same CSS, 80px different result.
 *
 * The fix inverts the relationship: PADDING is now the constant and HEIGHT is
 * the leftover. min-h-* keeps a short hero from collapsing, but it is set low
 * enough that the padding governs on nearly every route. Cause 2 is fixed in
 * Navbar.tsx, which now reserves the fixed header's space instead of letting
 * it cover content.
 *
 * Result: clear space is 112–128px on every route (a 16px spread instead of
 * 220px), and hero height varies 420–544px, which is the natural and correct
 * consequence of a taller headline needing a taller hero.
 */

/**
 * Hero container. `min-h` (not `h`) so the box grows with its content; the
 * padding below is what actually sets the rhythm.
 *
 * `surface-dark` retargets every semantic token inside the hero to the navy
 * ground, so children keep using text-foreground / text-muted-foreground /
 * border-border instead of per-instance opacity hacks.
 */
export const HERO_FRAME =
  "surface-dark relative flex min-h-[300px] items-end overflow-hidden bg-geat-dark sm:min-h-[340px] lg:min-h-[370px]";

/**
 * Inner content padding for a standard page hero (PageHero — every route
 * except the homepage).
 *
 * These `pt-*` values ARE the site's hero rhythm. Because the navbar no
 * longer overlaps the hero, they are true clear space on every route,
 * including /careers/* pages that also carry a sub-nav.
 */
export const HERO_CONTENT_PADDING = "pb-12 pt-20 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-28";

/**
 * Inner content padding for the home hero (HeroSlider).
 *
 * Same `pt-*` as HERO_CONTENT_PADDING; only the BOTTOM is larger. This is a
 * declared difference, not drift: the home hero is the only one carrying a
 * carousel control bar pinned to `bottom-0` (slide labels, progress rails,
 * prev / next / pause). At the standard pb the headline block would run
 * underneath that bar. The extra bottom space is the control bar's reserved
 * lane.
 */
export const HERO_CONTENT_PADDING_SLIDER =
  "pb-24 pt-20 sm:pb-32 sm:pt-24 lg:pb-36 lg:pt-28";

/** Image treatment: full-bleed cover crop, centered focal point. */
export const HERO_IMAGE =
  "absolute inset-0 h-full w-full object-cover object-center";

/** Intrinsic size used for every hero image (16:9 source frame). */
export const HERO_IMAGE_WIDTH = 1920;
export const HERO_IMAGE_HEIGHT = 1080;
