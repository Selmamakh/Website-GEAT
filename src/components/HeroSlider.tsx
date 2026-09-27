import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import {
  HERO_CONTENT_PADDING_SLIDER,
  HERO_FRAME,
  HERO_IMAGE,
  HERO_IMAGE_HEIGHT,
  HERO_IMAGE_WIDTH,
} from "@/components/heroStyles";
import hero1 from "@/assets/hero-bg-1.png";
import heroQuality from "@/assets/hero-workshop-hall.jpeg";
import hero3 from "@/assets/hero-3.jpg";

/** One full autoplay cycle. Must match the `slide-progress` keyframe (5s). */
const SLIDE_DURATION = 5000;

const slides: {
  image: string;
  focal?: string;
  headline: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
  label: string;
}[] = [
  {
    image: hero1,
    headline: "POWERING FORWARD ALGERIA",
    subtitle: "GEAT brings advanced power generation technology, local expertise and industrial capability together to support Algeria's energy future.",
    cta: "Discover GEAT",
    ctaHref: "/about",
    label: "About GEAT",
  },
  {
    image: heroQuality,
    focal: "50% 62%",
    headline: "ADVANCING POWER THROUGH TECHNOLOGY",
    subtitle: "Discover the technologies, expertise and solutions driving a more reliable and efficient energy future.",
    cta: "Explore Our Solutions",
    ctaHref: "/products-services",
    label: "Explore Our Solutions",
  },
  {
    image: hero3,
    headline: "ENABLING THE NEXT GENERATION OF ENERGY",
    subtitle: "Integrated grid and digital energy solutions designed to improve network reliability, operational visibility and efficiency across Algeria's evolving power infrastructure.",
    cta: "Explore Grid Solutions",
    ctaHref: "/products-services/grid-solutions",
    label: "Explore Grid Solutions",
  },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * What the user has asked the deck to do.
 *   "auto"    — nobody has pressed the toggle; advance unless a transient
 *               hold (pointer on the controls, keyboard focus in the hero)
 *               is in effect.
 *   "playing" — the user pressed Play. Explicit intent outranks the transient
 *               holds, so pressing Play while the cursor still rests on the
 *               control bar actually restarts the deck.
 *   "paused"  — the user pressed Pause (WCAG 2.2.2). Nothing but Play resumes.
 */
type Playback = "auto" | "playing" | "paused";

const HeroSlider = () => {
  const t = useT();
  const [current, setCurrent] = useState(0);
  const [playback, setPlayback] = useState<Playback>("auto");
  /** Mouse resting on the carousel controls — NOT on the whole hero. */
  const [hovering, setHovering] = useState(false);
  /** Keyboard focus anywhere inside the hero. */
  const [focusWithin, setFocusWithin] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
  const slideButtons = useRef<(HTMLButtonElement | null)[]>([]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /** Is the deck ACTUALLY advancing right now? Everything user-visible —
      the progress rail, the aria-live politeness, the toggle's icon and its
      label — is derived from this, never from the toggle's own flag. */
  const autoplaying =
    !reducedMotion &&
    (playback === "playing" || (playback === "auto" && !hovering && !focusWithin));

  /** Time left on the current slide, so a pause resumes where it stopped. */
  const remaining = useRef(SLIDE_DURATION);
  useEffect(() => {
    remaining.current = SLIDE_DURATION;
  }, [current]);

  /* One timer per slide instead of a 100ms tick driving React state. The
     visible progress is a pure CSS animation (`animate-slide-progress`). */
  useEffect(() => {
    if (!autoplaying) return;
    const budget = remaining.current;
    const startedAt = Date.now();
    const timer = window.setTimeout(next, budget);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, budget - (Date.now() - startedAt));
    };
  }, [autoplaying, current, next]);

  const goTo = useCallback((index: number) => setCurrent(index), []);

  const onSlideKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const target =
      event.key === "ArrowRight"
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length;
    goTo(target);
    slideButtons.current[target]?.focus();
  };

  const slide = slides[current];

  return (
    <section
      className={`${HERO_FRAME} ${HERO_CONTENT_PADDING_SLIDER}`}
      aria-roledescription="carousel"
      aria-label={t("GEAT highlights")}
      /* Focus-within stays on the section: a keyboard user reading the
         headline or tabbing to the CTA should not have the deck move under
         them. The MOUSE hold does not live here — the section is the full
         viewport width and 440-620px tall, so a cursor parked anywhere above
         the fold froze the carousel indefinitely. It sits on the control bar
         instead (see onPointerEnter below). */
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setFocusWithin(false);
        }
      }}
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden="true"
        >
          <img
            src={s.image}
            alt=""
            className={HERO_IMAGE}
            style={{ objectPosition: s.focal ?? "center" }}
            width={HERO_IMAGE_WIDTH}
            height={HERO_IMAGE_HEIGHT}
            {...(i === 0
              ? /* Lowercase DOM attribute, not React 19's camelCase
                   `fetchPriority` prop — React 18.3 does not recognise that
                   spelling and warns instead of hinting the LCP image. */
                { loading: "eager" as const, fetchpriority: "high" }
              : { loading: "lazy" as const, decoding: "async" as const })}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-geat-dark/95 via-geat-dark/80 to-geat-dark/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-geat-dark/80 via-transparent to-geat-dark/40" />

      <div
        className="section-container relative z-10 w-full text-foreground"
        role="group"
        aria-roledescription="slide"
        aria-label={`${t("Slide")} ${current + 1} / ${slides.length}`}
        aria-live={autoplaying ? "off" : "polite"}
      >
        <div className="relative max-w-3xl pl-4 sm:pl-6 lg:pl-8">
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-primary" />
          <h1 className="hero-headline text-foreground">
            {t(slide.headline)}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base lg:text-lg">
            {t(slide.subtitle)}
          </p>
          <div className="mt-6 flex flex-wrap gap-4 sm:mt-8">
            <Link
              to={slide.ctaHref}
              className="btn-cta group cta-pulse [animation-iteration-count:1]"
            >
              <span>{t(slide.cta)}</span>
              <span className="inline-flex items-center justify-center w-5 h-5 transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-0.5">
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </span>
            </Link>
          </div>
        </div>

      </div>


      {/* Single carousel control set: a labelled slide row (compact segments on
          mobile, labels from sm up), prev/next, and a pause/play toggle. */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="section-container">
          <div
            className="flex items-center gap-1 border-t border-border sm:gap-2"
            /* Touch is excluded rather than mouse being required: tapping a
               slide button used to emit an emulated enter with no matching
               leave and froze the deck for good. Excluding only "touch" keeps
               pen working and, if pointerType is ever unreported, degrades to
               holding — which the ungated leave below always releases. */
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch") setHovering(true);
            }}
            onPointerLeave={() => setHovering(false)}
          >
            <button
              type="button"
              onClick={prev}
              className="tap-target shrink-0 text-primary transition-colors hover:text-foreground"
              aria-label={t("Previous slide")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              role="group"
              aria-label={t("Choose slide")}
              onKeyDown={onSlideKeyDown}
              className="flex min-w-0 flex-1 items-stretch gap-1 sm:gap-2"
            >
              {slides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  ref={(node) => {
                    slideButtons.current[i] = node;
                  }}
                  onClick={() => goTo(i)}
                  aria-current={i === current ? "true" : undefined}
                  aria-label={`${t("Go to slide")} ${i + 1}`}
                  className="group flex min-h-11 min-w-0 flex-1 flex-col justify-center gap-2 py-3 text-left"
                >
                  <span
                    className={`hidden truncate font-heading text-xs font-semibold transition-colors sm:block lg:text-sm ${
                      i === current
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {t(s.label)}
                  </span>
                  <span className="block h-1 w-full overflow-hidden rounded-full bg-muted">
                    {i === current &&
                      (reducedMotion ? (
                        <span className="block h-full w-full bg-primary" />
                      ) : (
                        /* keyed on the slide index so the CSS animation
                           restarts; pausing freezes it in place. */
                        <span
                          key={current}
                          className="block h-full w-0 bg-primary animate-slide-progress [animation-fill-mode:forwards]"
                          style={{ animationPlayState: autoplaying ? "running" : "paused" }}
                        />
                      ))}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={next}
              className="tap-target shrink-0 text-primary transition-colors hover:text-foreground"
              aria-label={t("Next slide")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {!reducedMotion && (
              /* Icon and label track whether the deck is actually advancing,
                 not the toggle's own flag. Reading `paused` alone showed a
                 Pause icon while a hover hold had already stopped the deck,
                 and one press then left it stopped but labelled Play. */
              <button
                type="button"
                onClick={() => setPlayback(autoplaying ? "paused" : "playing")}
                className="tap-target shrink-0 text-primary transition-colors hover:text-foreground"
                aria-label={autoplaying ? t("Pause slideshow") : t("Play slideshow")}
              >
                {autoplaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
