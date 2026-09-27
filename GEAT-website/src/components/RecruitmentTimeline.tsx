import { useCallback, useEffect, useRef, useState } from "react";
import { Check, type LucideIcon } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

export type RecruitmentStep = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

/** Where in the viewport a step flips to active — just above the middle. */
const ACTIVATION = 0.55;

type StepState = "static" | "upcoming" | "active" | "done";

/**
 * The recruitment process as a scroll-driven vertical timeline.
 *
 * Nothing hijacks the scroll: a passive listener measures where each node sits
 * relative to an activation line and derives (a) the active step and (b) how
 * far the rail is filled. The rail geometry is measured rather than guessed,
 * so it always spans exactly the first node centre to the last one whatever
 * the card heights are.
 *
 * Until the first measurement lands — and whenever the visitor asks for
 * reduced motion — every step renders in the neutral `static` state, so the
 * content is never left dimmed by an effect that did not run.
 */
const RecruitmentTimeline = ({ steps }: { steps: RecruitmentStep[] }) => {
  const t = useT();
  const listRef = useRef<HTMLOListElement>(null);
  const nodeRefs = useRef<(HTMLElement | null)[]>([]);

  const [ready, setReady] = useState(false);
  // Read on first render, so the scroll listener is never attached even briefly
  // for a visitor who asked for reduced motion.
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [active, setActive] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [rail, setRail] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const measure = useCallback(() => {
    const list = listRef.current;
    const nodes = nodeRefs.current.filter(Boolean) as HTMLElement[];
    if (!list || nodes.length === 0) return;

    const listTop = list.getBoundingClientRect().top;
    const centres = nodes.map((n) => {
      const r = n.getBoundingClientRect();
      return r.top + r.height / 2;
    });
    const first = centres[0];
    const last = centres[centres.length - 1];

    setRail({ top: first - listTop, height: Math.max(0, last - first) });

    const line = window.innerHeight * ACTIVATION;
    const span = last - first;
    setProgress(span <= 0 ? 1 : Math.min(1, Math.max(0, (line - first) / span)));

    let idx = -1;
    centres.forEach((c, i) => {
      if (c <= line) idx = i;
    });
    setActive(idx);
    setReady(true);
  }, []);

  useEffect(() => {
    // Reduced motion still needs one pass, for the rail's geometry.
    measure();
    if (reduced) return;

    // The guard is its own flag, not the frame id: an id is truthy even after
    // the callback has run, which would wedge the throttle shut.
    let raf = 0;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(() => {
        ticking = false;
        measure();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [measure, reduced]);

  const stateOf = (i: number): StepState => {
    if (!ready || reduced) return "static";
    if (i === active) return "active";
    if (i < active) return "done";
    return "upcoming";
  };

  const fill = !ready || reduced ? 1 : progress;

  return (
    <div className="relative">
      {/* A single column reads as a journey; capping the measure keeps the
          line length comfortable now that cards are no longer in a 3-up grid. */}
      <ol ref={listRef} className="relative mx-auto max-w-3xl space-y-6">
        {/* Rail. Decorative: the ordered list already conveys the sequence. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[0.875rem] w-0.5 -translate-x-1/2 sm:left-[1.375rem]"
          style={{ top: rail.top, height: rail.height }}
        >
          <div className="absolute inset-0 rounded-full bg-border" />
          <div
            className="absolute inset-x-0 top-0 rounded-full bg-primary transition-[height] duration-500 ease-out"
            style={{ height: `${fill * 100}%` }}
          />
        </div>

        {steps.map((step, i) => {
          const state = stateOf(i);
          const isActive = state === "active";
          const isDone = state === "done";

          return (
            <li
              key={step.title}
              aria-current={isActive ? "step" : undefined}
              className={`flex gap-4 transition-[opacity,transform] duration-500 ease-out sm:gap-6 ${
                state === "upcoming"
                  ? "translate-y-1 opacity-70"
                  : isDone
                    ? "translate-y-0 opacity-85"
                    : "translate-y-0 opacity-100"
              }`}
            >
              {/* Rail node */}
              <div className="flex w-7 shrink-0 justify-start sm:w-11 sm:justify-center">
                <span
                  ref={(el) => {
                    nodeRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className={`mt-5 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-card transition-all duration-500 ease-out sm:h-9 sm:w-9 ${
                    isActive
                      ? "scale-110 border-brand-edge bg-primary text-primary-foreground ring-4 ring-primary/20"
                      : isDone
                        ? "border-primary bg-primary text-primary-foreground"
                        : state === "static"
                          ? "border-border text-muted-foreground"
                          : "border-border text-muted-foreground"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current sm:h-2 sm:w-2" />
                  )}
                </span>
              </div>

              {/* Card — same styling as every other GEAT card */}
              <article
                className={`flex-1 rounded-2xl border bg-card p-7 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-brand-edge hover:shadow-xl ${
                  isActive
                    ? "-translate-y-0.5 border-brand-edge shadow-xl ring-1 ring-primary/20"
                    : "border-border"
                }`}
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl text-primary transition-colors duration-500 ${
                    isActive ? "bg-primary/20" : "bg-primary/10"
                  }`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">
                  {t(step.title)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{t(step.desc)}</p>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default RecruitmentTimeline;
