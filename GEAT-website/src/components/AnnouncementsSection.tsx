import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import KickerLabel from "@/components/KickerLabel";

const features = [
  {
    category: "Careers",
    date: "April 7, 2026",
    title: "New Opportunities at GEAT",
    excerpt:
      "Explore openings and join a team shaping the future of energy.",
    cta: "Explore Careers",
    href: "/careers",
  },
  {
    category: "News",
    date: "April 2, 2026",
    title: "Launching Our GRID Initiative",
    excerpt:
      "Advancing energy infrastructure and improving efficiency across operations.",
    cta: "Read More",
    href: "/news",
  },
  {
    category: "Career Growth",
    date: "March 31, 2026",
    title: "Diverse Job Opportunities",
    excerpt:
      "From engineering to operations, discover career paths at GEAT.",
    cta: "Learn More",
    href: "/careers/jobs",
  },
];

const AnnouncementsSection = () => {
  const t = useT();

  return (
    <section className="relative section-y bg-secondary">
      <div className="section-container">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={i}
              style={{ transitionDelay: `${i * 120}ms` }}
              className="reveal group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-in card-aura card-ripple hover:border-brand-edge hover:shadow-lg focus-within:border-brand-edge sm:p-7"
            >
              <span className="absolute left-0 top-0 h-1 w-0 bg-primary transition-all duration-500 group-hover:w-full group-focus-within:w-full" />
              {/* Light ground (bg-card): the eyebrow words must not be amber
                  — tone="muted" resolves to text-muted-foreground (5.61:1).
                  The card's amber rule above and the CTA arrow below carry
                  the brand accent instead. */}
              <KickerLabel label={f.category} tone="muted" className="mb-2 self-start" />
              <p className="mb-4 text-xs text-muted-foreground">{t(f.date)}</p>
              <h2 className="mb-3 font-heading text-xl font-bold leading-snug text-card-foreground">
                {t(f.title)}
              </h2>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
                {t(f.excerpt)}
              </p>
              {/* 44px hit box on the card's primary action; the visual
                  underline stays hugging the label, and the overlay makes the
                  whole card the same target. */}
              <Link
                to={f.href}
                className="inline-flex min-h-11 w-fit items-center after:absolute after:inset-0"
              >
                <span className="inline-flex items-center gap-1 border-b-2 border-primary pb-0.5 font-heading text-sm font-semibold text-foreground transition-all group-hover:gap-2">
                  {t(f.cta)}
                  <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
