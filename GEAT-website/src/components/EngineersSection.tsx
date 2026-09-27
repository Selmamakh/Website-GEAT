import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import KickerLabel from "@/components/KickerLabel";
import engineerImg from "@/assets/engineer-turbine.png";
import storyA from "@/assets/geat-team.jpeg";
import storyB from "@/assets/geat-engineer-portrait.png";

const featured = {
  kicker: "MEET OUR ENGINEERS",
  title: "Meet Sarah Chen, decarbonization technology lead and field engineer",
  excerpt:
    "Sarah leads breakthrough work on emissions-reduction turbine programs, balancing deep field work with the lab. This is her story.",
  image: engineerImg,
  href: "/news",
};

const stories = [
  {
    category: "DECARBONIZATION",
    title:
      "What Algeria's geothermal journey taught me about scaling clean energy",
    image: storyA,
    href: "/news",
  },
  {
    category: "PEOPLE & CULTURE",
    title:
      "Meet Ahmed Khalil, senior robotics engineer pushing autonomous systems forward",
    image: storyB,
    href: "/news",
  },
];

const EngineersSection = () => {
  const t = useT();
  return (
    <section className="section-y bg-secondary">
      <div className="section-container">
        <div className="reveal text-center section-head">
          <KickerLabel label="Meet Our Engineers" className="mb-3" />
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground">
            {t("Discover the future of energy technology")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured large card */}
          <article className="reveal group relative rounded-2xl overflow-hidden shadow-xl tilt-card">
            <img
              src={featured.image}
              alt=""
              width={1200}
              height={460}
              className="w-full h-[460px] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-geat-dark/70 via-geat-dark/25 to-transparent" />
            {/* Navy ground: every token below retargets via surface-dark.
                .text-scrim guarantees >=85% ground under the panel itself —
                the outer gradient above is only ~60% opaque at the kicker's
                line, which measured 4.04:1. */}
            <div className="surface-dark text-scrim absolute bottom-0 left-0 right-0 p-8 text-foreground">
              <KickerLabel
                label={featured.kicker}
                tone="muted"
                ornament="rule"
                className="mb-3"
              />
              <h3 className="font-heading font-bold text-2xl lg:text-3xl leading-tight mb-6">
                {t(featured.title)}
              </h3>
              <Link
                to={featured.href}
                className="btn-cta text-xs uppercase tracking-wider px-5 py-2.5"
              >
                {t("Read More")} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>

          {/* Smaller stories list - equal sized */}
          <div className="grid grid-rows-2 gap-6">
            {stories.map((s, i) => (
              <article
                key={i}
                className="reveal group relative flex flex-col bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow"
              >
                <div className="overflow-hidden h-40">
                  <img
                    src={s.image}
                    alt={t(s.title)}
                    width={800}
                    height={160}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <KickerLabel label={s.category} ornament="rule" className="mb-2 self-start" />
                  <h3 className="font-heading font-bold text-base text-card-foreground leading-snug mb-3 flex-1">
                    {t(s.title)}
                  </h3>
                  {/* 44px hit box; the overlay turns the whole card into the
                      same target without changing the label's size. */}
                  <Link
                    to={s.href}
                    className="inline-flex min-h-11 w-fit items-center after:absolute after:inset-0"
                  >
                    <span className="inline-flex items-center gap-1 text-foreground text-xs font-heading font-bold uppercase tracking-wider transition-all group-hover:gap-2">
                      {t("Read More")} <ArrowRight className="w-3 h-3 text-primary" />
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EngineersSection;
