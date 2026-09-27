import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";

/**
 * The one eyebrow label for the whole site.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 * The same uppercase tracked label was hand-rolled ~26 times with SEVEN
 * different letter-spacings (0.18 / 0.2 / 0.24 / 0.25 / 0.28 / 0.3 / 0.35em),
 * three sizes (10px / 11px / text-xs) and a mix of font-semibold, font-bold
 * and font-heading — one visual element rendered seven slightly different
 * ways. ValuesScroll even carried a private `Kicker` copy of it.
 *
 * There is now ONE spacing (0.2em, the most common of the seven) and ONE
 * weight (font-heading font-semibold). Size, colour role and ornament are
 * props, because those are the only differences that were ever intentional:
 *
 *   size      sm  11px — inside a card
 *             md  text-xs — the default, section and card eyebrows
 *             lg  text-sm — a hero / opening statement
 *   tone      primary — a section kicker (default)
 *             muted   — a quieter meta label (footer column, form meta)
 *   ornament  none — the default
 *             rule — short leading brand rule
 *             arrow — the L-shaped "OUR STORY ┐↓" arrow
 *
 * There was a fourth ornament, `dot` — a 8px filled brand circle before the
 * label. It had zero call sites and it was the wrong shape for this site: the
 * brand's decorative vocabulary is linear (the eyebrow rule, the nav trigger
 * underline, the hero's left bar, the arrows). A filled circle reads as a
 * status light or a list bullet, i.e. as something that MEANS a thing, so
 * using one as pure decoration mis-signals. Keep round marks for state
 * (presence, current step) and lines for ornament.
 *
 * Callers pass the ENGLISH SOURCE STRING; the component translates it, so the
 * t() wrapper lives here once instead of at every call site.
 *
 * Do NOT pass a colour, a size or a tracking through `className`. If a call
 * site needs a shape this does not have, add it here so the whole site moves.
 * `className` is for placement only (margins, `reveal`).
 */

export type KickerSize = "sm" | "md" | "lg";
export type KickerTone = "primary" | "muted";
export type KickerOrnament = "none" | "rule" | "arrow";

/** The canonical eyebrow type. One spacing, one weight, three sizes. */
const SIZE_CLASS: Record<KickerSize, string> = {
  sm: "text-[11px]",
  md: "text-xs",
  lg: "text-sm",
};

/** Both are surface-aware: they retarget inside a `surface-dark` container.
 *
 * `primary` cannot simply be `text-primary`. On a LIGHT ground --primary is
 * the bright logo amber and an eyebrow painted with it measures 2.27:1 — and
 * there is no darker amber that both clears 4.5:1 and still reads as orange
 * (see the --primary note in index.css). So on light the WORDS go muted
 * (5.61:1) and the brand accent survives in the `rule` / `dot` ornament, which
 * is a decorative mark with no contrast floor.
 *
 * Inside `.surface-dark` the constraint disappears — the same amber is 6.64:1
 * on navy — so the kicker gets its real orange back. This has to be expressed
 * as a variant rather than a token swap because a single call site can render
 * on BOTH grounds: ValuesStacked alternates light and navy cards through one
 * `<KickerLabel label="Value" />`. */
const TONE_CLASS: Record<KickerTone, string> = {
  primary: "text-muted-foreground [.surface-dark_&]:text-primary",
  muted: "text-muted-foreground",
};

interface KickerProps {
  /** English source string. Translated here — do not pre-translate. */
  label: string;
  /**
   * Rendered straight after the translated label, untranslated. For the
   * counter in "VALUE 01" — the number is not a dictionary key.
   */
  suffix?: ReactNode;
  size?: KickerSize;
  tone?: KickerTone;
  ornament?: KickerOrnament;
  /** Placement only: margins, `reveal`. Never colour, size or tracking. */
  className?: string;
}

const KickerLabel = ({
  label,
  suffix,
  size = "md",
  tone = "primary",
  ornament = "none",
  className,
}: KickerProps) => {
  const t = useT();

  return (
    <p className={cn("inline-flex items-center gap-3", TONE_CLASS[tone], className)}>
      {/* Ornaments stay `bg-primary` whatever the tone: the mark is the brand
          accent, the text is what carries the emphasis. */}
      {ornament === "rule" && <span aria-hidden="true" className="h-px w-6 shrink-0 bg-primary" />}

      <span className={cn("font-heading font-semibold uppercase tracking-[0.2em]", SIZE_CLASS[size])}>
        {t(label)}
        {suffix}
      </span>

      {ornament === "arrow" && (
        /* Right-then-down rule. Inherits the tone via currentColor. */
        <svg
          width="38"
          height="22"
          viewBox="0 0 38 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="shrink-0"
        >
          <path
            d="M0 3 H30 V19"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="square"
            fill="none"
          />
          <path
            d="M26 15 L30 19 L34 15"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="square"
            strokeLinejoin="miter"
            fill="none"
          />
        </svg>
      )}
    </p>
  );
};

export default KickerLabel;
