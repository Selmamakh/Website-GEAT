import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import KickerLabel from "@/components/KickerLabel";
import careers1 from "@/assets/geat-team.jpeg";
import careers2 from "@/assets/geat-engineer-portrait.png";

const CareersSection = () => {
  const t = useT();
  const cards = [
    {
      image: careers1,
      alt: "Career opportunities at GEAT",
      title: "Career opportunities",
      cta: "Learn More",
      href: "/careers",
      delay: "reveal-delay-2",
    },
    {
      image: careers2,
      alt: "Application status at GEAT",
      title: "Application status",
      cta: "Check Status",
      href: "/careers",
      delay: "reveal-delay-3",
    },
  ];

  return (
    <section id="careers" className="section-y bg-background">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <KickerLabel
              label="Careers"
              size="lg"
              ornament="rule"
              className="reveal reveal-delay-1 mb-4"
            />
            <h2 className="reveal reveal-delay-2 mb-6 font-heading text-3xl font-bold leading-tight text-foreground lg:text-4xl">
              {t("Be a part of our story")}
            </h2>
            <p className="reveal reveal-delay-2 mb-6 max-w-md leading-relaxed text-muted-foreground">
              {t("Check out our Careers site to learn more about how you can be a part of the team.")}
            </p>
            <Link
              to="/careers"
              className="reveal reveal-delay-3 group inline-flex min-h-11 w-fit items-center gap-1.5 font-heading text-sm font-semibold uppercase tracking-wider text-foreground transition-all hover:gap-2.5"
            >
              {t("Explore")}
              <ArrowUpRight className="h-4 w-4 text-primary" />
            </Link>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 sm:gap-6">
            {cards.map((card) => (
              <article key={card.title} className={`reveal ${card.delay} group relative pb-16`}>
                <div className="overflow-hidden aspect-[3/4]">
                  <img
                    src={card.image}
                    alt={t(card.alt)}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={853}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-8 bg-card p-5 shadow-[0_10px_30px_-12px_hsl(var(--foreground)/0.25)] transition-transform duration-500 group-hover:-translate-y-1">
                  <h3 className="mb-3 font-heading text-lg font-bold leading-snug text-card-foreground">
                    {t(card.title)}
                  </h3>
                  {/* 44px hit box; the overlay makes the whole card the same
                      target without changing the label's size. */}
                  <Link
                    to={card.href}
                    className="inline-flex min-h-11 w-fit items-center after:absolute after:inset-0"
                  >
                    <span className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold uppercase tracking-wider text-foreground transition-all group-hover:gap-2.5">
                      {t(card.cta)}
                      <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
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

export default CareersSection;
