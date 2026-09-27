import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import { psImages } from "@/data/products";

const categories = [
  {
    name: "Products",
    cards: [
      { title: "Gas Turbines", image: psImages.gt9f04, slug: "gas-turbines", contain: true },
      { title: "Steam Turbines", image: psImages.stA650, slug: "steam-turbines", contain: true },
      { title: "Auxiliaries", image: psImages.skidModule, slug: "auxiliaries" },
    ],
  },
  {
    name: "Technologies & Solutions",
    cards: [
      { title: "Control Systems", image: psImages.controlCabinets, slug: "control-systems" },
      { title: "Grid Solutions", image: psImages.substationAerial, slug: "grid-solutions" },
      { title: "Digital Solutions", image: psImages.controlHall, slug: "digital-solutions" },
    ],
  },
  {
    name: "Services",
    cards: [
      { title: "Repair Services", image: psImages.welding, slug: "repair-services" },
      { title: "Power Plant Maintenance", image: psImages.workshop, slug: "power-plant-maintenance" },
      { title: "Aero-Derivative Turbine Services", image: psImages.lm2500, slug: "aero-derivative-turbine-services" },
    ],
  },
];

const WhatWeDo = () => {
  const t = useT();
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const cat = categories[active];

  const updateProgress = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setProgress(ratio);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateProgress();
  }, [active]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateProgress();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateProgress();
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.6;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // Auto-advance the carousel (pauses on hover/touch)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });

    const id = setInterval(() => {
      if (paused) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const card = el.querySelector<HTMLElement>("[data-card]");
        const step = card ? card.offsetWidth + 20 : el.clientWidth * 0.6;
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 1000);

    return () => {
      clearInterval(id);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, [active]);

  return (
    <section className="section-y bg-secondary">
      <div className="section-container">
        <div className="grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-16">
          {/* Left column */}
          <div className="flex flex-col">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-6">
              {t("Products and services")}
            </h2>
            <ul className="border-t border-border">
              {categories.map((c, i) => (
                <li key={c.name} className="border-b border-border">
                  <button
                    type="button"
                    aria-pressed={active === i}
                    onClick={() => setActive(i)}
                    className={`w-full flex items-center justify-between py-4 text-left transition-colors ${
                      active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {/* The selected row used to be the only thing painted
                        orange, so the state was carried by hue alone (WCAG
                        1.4.1) — and on a light ground that hue is now 2.27:1
                        anyway. The state now reads three ways without colour:
                        heavier weight, full-strength ink against muted, and
                        the amber chevron below. */}
                    <span className={`font-heading text-lg ${active === i ? "font-bold" : "font-semibold"}`}>
                      {t(c.name)}
                    </span>
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        active === i ? "text-primary translate-x-0.5" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <Link
                to="/products-services"
                className="group inline-flex min-h-11 items-center gap-2 px-6 py-3 rounded-full border-2 border-brand-edge text-foreground font-bold text-xs uppercase tracking-wider hover:bg-brand hover:text-brand-foreground transition-all"
              >
                {t("More products and services")}
                <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1 group-hover:text-brand-foreground" />
              </Link>
            </div>
          </div>

          {/* Right column: horizontal card carousel */}
          <div className="relative min-w-0">
            <div
              ref={scrollerRef}
              className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar"
            >
              {cat.cards.map((card) => (
                <Link
                  key={card.title}
                  data-card
                  to={`/products-services/${card.slug}`}
                  className="group relative block shrink-0 snap-start w-[78%] sm:w-[55%] lg:w-[360px] aspect-[3/4] overflow-hidden rounded-sm bg-muted text-left"
                >
                  <img
                    src={card.image}
                    /* Decorative: the <h3> below carries the same words, so
                       alt text here made screen readers say the card title
                       twice (axe image-redundant-alt, 3 nodes on /). */
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105 ${"contain" in card && card.contain ? "object-contain p-8 bg-secondary" : "object-cover"}`}
                  />
                  <div className="surface-dark absolute inset-0 bg-gradient-to-t from-geat-dark/85 via-geat-dark/20 to-transparent">
                    <h3 className="absolute left-6 right-6 bottom-6 font-heading font-bold text-2xl text-foreground">
                      {t(card.title)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Progress bar + arrows */}
            <div className="flex items-center gap-6">
              <div className="flex-1 h-[3px] bg-border overflow-hidden rounded-full">
                <div
                  className="h-full bg-primary transition-[width] duration-300"
                  style={{ width: `${Math.max(15, progress * 100)}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollBy(-1)}
                  aria-label={t("Previous")}
                  disabled={!canPrev}
                  className={`tap-target rounded-full ${
                    canPrev ? "group/nav" : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  <span className="w-10 h-10 rounded-full border border-brand-edge text-foreground flex items-center justify-center transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy(1)}
                  aria-label={t("Next")}
                  disabled={!canNext}
                  className={`tap-target rounded-full ${
                    canNext ? "group/nav" : "opacity-40 cursor-not-allowed"
                  }`}
                >
                  <span className="w-10 h-10 rounded-full border border-brand-edge text-foreground flex items-center justify-center transition-colors group-hover/nav:bg-primary group-hover/nav:text-primary-foreground">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
