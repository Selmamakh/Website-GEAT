import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useT } from "@/i18n/LanguageContext";
import KickerLabel from "@/components/KickerLabel";
import humilityImg from "@/assets/value-humility.png";
import transparencyImg from "@/assets/value-transparency.png";
import focusImg from "@/assets/value-focus-worker.jpeg";

const slides = [
  {
    image: humilityImg,
    title: "Act with Humility",
    lead: "We embrace a culture of respect that values inclusive teams and diverse perspectives.",
    points: [
      "We actively listen to internal and external sources.",
      "We learn from our shortcomings as much as we celebrate our wins.",
    ],
    alt: "GEAT technician working precisely on a component",
  },
  {
    image: transparencyImg,
    title: "Lead with Transparency",
    lead: "We believe open communication builds trust, strengthens teams and leads to better decisions.",
    points: [
      "We share information openly to solve problems and move forward together.",
      "We help one another grow through honest, constructive feedback.",
    ],
    alt: "GEAT welder working on a precision industrial component",
  },
  {
    image: focusImg,
    title: "Deliver with Focus",
    lead: "We put safety first and prioritize our work to maximize impact where it matters most.",
    points: [
      "We measure performance through the lens of our customers.",
      "We are committed to continuous improvement, always in search of a better way.",
    ],
    alt: "GEAT technician measuring a metal profile on a cutting machine",
  },
];

const ValueCopy = ({
  slide,
  active = true,
  compact = false,
}: {
  slide: (typeof slides)[number];
  active?: boolean;
  compact?: boolean;
}) => {
  const t = useT();
  const reveal = (delay: number) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0px)" : "translateY(18px)",
    transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 700ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
  });

  return (
    <div>
      <div style={reveal(0)}>
        <KickerLabel label="Our Values" tone="muted" className="mb-4" />
        <h3
          className={`font-heading font-extrabold tracking-tight text-foreground ${
            compact ? "text-3xl" : "text-5xl xl:text-6xl"
          } leading-[1.05]`}
        >
          {t(slide.title)}
        </h3>
      </div>

      <p
        className={`mt-6 text-muted-foreground max-w-xl leading-relaxed ${
          compact ? "text-base" : "text-lg xl:text-xl"
        }`}
        style={reveal(120)}
      >
        {t(slide.lead)}
      </p>


      <ul className="mt-7 space-y-6">
        {slide.points.map((point, pi) => (
          <li
            key={point}
            className="flex items-stretch gap-5"
            style={reveal(260 + pi * 100)}
          >
            <span className="w-[3px] flex-shrink-0 bg-primary" />
            <span
              className={`text-foreground leading-relaxed max-w-lg ${
                compact ? "text-sm" : "text-lg"
              }`}
            >
              {t(point)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Bottom 01 —— 02 —— 03 tracker */
const NumberTrack = ({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) => {
  const t = useT();
  return (
    <div className="flex items-center gap-4">
      {slides.map((slide, i) => (
        <div key={slide.alt} className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`${t("Go to value")} ${i + 1}`}
            aria-current={activeIndex === i ? "true" : undefined}
            className={`tap-target font-heading text-lg tabular-nums transition-colors duration-300 ${
              activeIndex === i
                ? "font-extrabold text-foreground"
                : "font-bold text-muted-foreground hover:text-foreground"
            }`}
          >
            {String(i + 1).padStart(2, "0")}
          </button>
          {i < slides.length - 1 && (
            <span className="relative block h-[3px] w-20 rounded-full bg-border overflow-hidden">
              <span
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700"
                style={{ width: activeIndex > i ? "100%" : "0%" }}
              />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

/** Mobile: Siemens-style stacked flat cards. */
const ValuesStacked = () => {
  const t = useT();
  return (
    <section data-section="our-values" className="bg-background section-y-sm">
      <div className="section-container">
        <KickerLabel label="Our Values" tone="muted" className="mb-4" />
        <h2 className="section-head font-heading text-3xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          {t("The values that drive everything we do")}
        </h2>
      </div>

      <div className="space-y-1">
        {slides.map((slide, i) => {
          const dark = i % 2 === 1;
          return (
            <article
              key={slide.alt}
              className={dark ? "surface-dark bg-geat-dark" : "bg-card"}
            >
              {i === 0 && (
                <img
                  src={slide.image}
                  alt={t(slide.alt)}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-[4/3] object-cover"
                />
              )}
              <div className="px-5 py-8">
                <KickerLabel
                  label="Value"
                  suffix={` ${String(i + 1).padStart(2, "0")}`}
                  size="sm"
                  className="mb-3"
                />
                <h3 className="font-heading text-2xl font-extrabold tracking-tight leading-[1.15] text-foreground">
                  {t(slide.title)}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {t(slide.lead)}
                </p>
                <ul className="mt-6 space-y-4">
                  {slide.points.map((point) => (
                    <li key={point} className="flex items-stretch gap-4">
                      <span className="w-[3px] flex-shrink-0 bg-primary" />
                      <span className="text-sm leading-relaxed text-foreground">
                        {t(point)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};


const ValuesScrollDesktop = () => {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const raw = -rect.top / (rect.height - window.innerHeight);
        setProgress(Math.min(1, Math.max(0, raw)));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const activeIndex = Math.min(
    slides.length - 1,
    Math.floor(progress * slides.length * 0.999)
  );

  const goTo = (i: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const top = window.scrollY + section.getBoundingClientRect().top;
    const step = (section.offsetHeight - window.innerHeight) / slides.length;
    window.scrollTo({ top: top + step * i + 8, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      data-section="our-values"
      className="relative bg-background"
      style={{ minHeight: `${slides.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        <div className="grid w-full grid-cols-1 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)] items-center gap-12 xl:gap-16">
          {/* Image bleeding off the left edge, rounded on the right */}
          <div className="relative h-[76vh] overflow-hidden rounded-r-[2.5rem] shadow-2xl">
            {slides.map((slide, i) => {
              const isActive = activeIndex === i;
              return (
                <img
                  key={slide.alt}
                  src={slide.image}
                  alt={t(slide.alt)}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive
                      ? "scale(1.03) translateY(0)"
                      : `scale(1.12) translateY(${i < activeIndex ? "-2%" : "2%"})`,
                    transition:
                      "opacity 900ms cubic-bezier(0.22,1,0.36,1), transform 1400ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                />
              );
            })}
          </div>

          {/* Copy + tracker */}
          <div className="relative pr-8 lg:pr-16 xl:pr-24 h-[76vh] flex flex-col justify-between py-4">
            <div className="relative flex-1">
              {slides.map((slide, i) => (
                <article
                  key={slide.title}
                  aria-hidden={activeIndex !== i}
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    pointerEvents: activeIndex === i ? "auto" : "none",
                    transition: "opacity 500ms ease-out",
                  }}
                >
                  <ValueCopy slide={slide} active={activeIndex === i} />
                </article>
              ))}
            </div>

            <div className="flex items-center gap-8">
              <NumberTrack activeIndex={activeIndex} onSelect={goTo} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ValuesScroll = () => {
  const isMobile = useIsMobile();
  return isMobile ? <ValuesStacked /> : <ValuesScrollDesktop />;
};

export default ValuesScroll;
