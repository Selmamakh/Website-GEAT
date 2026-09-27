import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Search, MapPin, Briefcase, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Newsletter from "@/components/Newsletter";
import KickerLabel from "@/components/KickerLabel";
import heroBg from "@/assets/careers-hero-bg.jpg";
import msExportAsset from "@/assets/algerian-turbines-iraq.png";
import msManufacturingAsset from "@/assets/ps/workshop.jpg";
import msTechAsset from "@/assets/steam-turbine-hero.png";
import msEnergyAsset from "@/assets/geat-facility.png";
import ctaWorkshop from "@/assets/careers-cta-workshop.jpeg";
import { useT } from "@/i18n/LanguageContext";
import { useJobsQuery } from "@/hooks/useJobs";
import { useReferenceData } from "@/hooks/useReferenceData";

const msExport = msExportAsset;
const msManufacturing = msManufacturingAsset;
const msTech = msTechAsset;
const msEnergy = msEnergyAsset;



/* Colour comes from the surface tokens: on a `surface-dark` ground the same
   text-foreground / text-muted-foreground classes retarget themselves, so no
   "light" variant is needed here. */
const SectionTitle = ({
  title,
  highlight,
  subtitle,
  align = "center",
}: {
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
}) => {
  const t = useT();
  return (
  <div className={`section-head ${align === "center" ? "text-center" : ""}`}>
    <div className={`reveal w-12 h-1 bg-primary mb-6 ${align === "center" ? "mx-auto" : ""}`} />
    <h2 className="reveal reveal-delay-1 font-heading font-bold text-3xl lg:text-4xl mb-4 text-foreground">
      {t(title)} {highlight && <span className="text-highlight">{t(highlight)}</span>}
    </h2>
    {subtitle && (
      <p className={`reveal reveal-delay-2 max-w-2xl text-muted-foreground ${align === "center" ? "mx-auto" : ""}`}>
        {t(subtitle)}
      </p>
    )}
  </div>
  );
};

type Category = "all" | "careers";

const milestones = [
  {
    num: "01",
    img: msExport,
    alt: "Gas turbine manufactured by GEAT prepared for international shipment",
    category: "International Export",
    title: "Algerian Turbines Reach Iraq",
    desc: "GEAT supplied locally manufactured gas and steam turbines to Iraq in a deal valued at approximately $112 million, marking a significant milestone for Algeria's industrial exports.",
    featured: true,
  },
  {
    num: "02",
    img: msManufacturing,
    alt: "GEAT technicians working inside the turbine manufacturing workshop",
    category: "Local Manufacturing",
    title: "Advanced Turbine Manufacturing in Algeria",
    desc: "GEAT brings together advanced turbine technology, local engineering expertise, and industrial manufacturing capabilities to support power generation in Algeria.",
    featured: false,
  },
  {
    num: "03",
    img: msTech,
    alt: "Steam turbine assembly showing GEAT's high-power turbine expertise",
    category: "Technology & Expertise",
    title: "Gas & Steam Turbine Expertise",
    desc: "GEAT's capabilities extend across the manufacturing and servicing of high-power gas and steam turbine equipment, supporting the needs of the energy sector.",
    featured: false,
  },
  {
    num: "04",
    img: msEnergy,
    alt: "GEAT industrial facility supporting Algeria's power generation infrastructure",
    category: "Energy & Industry",
    title: "Supporting Algeria's Energy Future",
    desc: "Through local industrial capabilities and specialized power-generation expertise, GEAT contributes to the development and modernization of Algeria's energy infrastructure.",
    featured: false,
  },
];


/** How many live offers the newsroom shows before sending people to the board. */
const NEWS_JOB_COUNT = 6;

/** Keystrokes must not become one API request each. */
const SEARCH_DEBOUNCE_MS = 250;


const News = () => {
  const t = useT();
  const [activeTab, setActiveTab] = useState<Category>("all");
  const [search, setSearch] = useState("");

  const tabs: { id: Category; label: string }[] = [
    { id: "all", label: t("All Updates") },
    { id: "careers", label: t("Careers") },
  ];

  const showMilestones = activeTab === "all";
  const showCareers = activeTab === "all" || activeTab === "careers";

  // The board searches server-side, so the typed term has to settle first.
  const [query, setQuery] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [search]);

  /* Published offers come from the HRIS, exactly as on /careers/jobs — the
     newsroom shows a short extract of the same live list. */
  const {
    data: jobsData,
    isLoading: jobsLoading,
    isError: jobsError,
  } = useJobsQuery({ page: 1, pageSize: NEWS_JOB_COUNT, q: query || undefined }, showCareers);
  const jobs = jobsData?.items ?? [];

  // Vocabulary keys ("batna", "cdi") are never rendered raw.
  const { label } = useReferenceData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main">
      {/* HERO */}
      <PageHero
        breadcrumb={t("Newsroom")}
        title={t("GEAT Newsroom")}
        subtitle={t("Explore the latest news and milestones from GEAT as we advance power generation capabilities and contribute to Algeria's energy future.")}
        image={heroBg}
        imageAlt={t("GEAT engineers at an industrial site")}
        primaryCta={{ label: t("View Milestones"), href: "#milestones" }}
      />


      {/* FEATURED UPDATE */}
      <section className="section-y bg-background">
        <div className="section-container">
          <div className="reveal grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl border border-border bg-card">
            <div className="relative h-72 lg:h-auto overflow-hidden group">
              <img
                src={msExport}
                alt={t("Gas turbine manufactured by GEAT prepared for international shipment")}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-brand text-brand-foreground text-xs font-heading font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                {t("International Export")}
              </div>
            </div>
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <KickerLabel label="Featured Milestone" className="mb-3" />

              <h2 className="font-heading font-bold text-2xl lg:text-3xl text-foreground leading-tight mb-4">
                {t("Algerian Turbines Reach Iraq")}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("GEAT supplied locally manufactured gas and steam turbines to Iraq in a deal valued at approximately $112 million, marking a significant milestone for Algeria's industrial exports.")}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t("This achievement reflects GEAT's capability to produce advanced power-generation equipment in Algeria and deliver it to international markets, strengthening the country's role as a growing industrial and energy hub.")}
              </p>
              <a
                href="#milestones"
                className="group tap-target gap-2 text-foreground font-heading font-semibold w-fit border-b-2 border-primary pb-0.5 hover:gap-3 transition-all"
              >
                {t("View All Milestones")}
                <ArrowUpRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER TABS + SEARCH */}
      <section
        aria-label={t("Filter updates")}
        className="sticky top-16 lg:top-20 z-30 bg-background/95 backdrop-blur border-y border-border"
      >
        <div className="section-container py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={`tap-target px-5 py-2 rounded-full font-heading text-sm font-semibold transition-all active:scale-95 ${
                  activeTab === tab.id
                    ? "bg-brand text-brand-foreground shadow-md"
                    : "bg-secondary text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="news-search" className="sr-only">
              {t("Search opportunities...")}
            </label>
            <input
              id="news-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search opportunities...")}
              className="w-full min-h-11 pl-10 pr-4 py-2.5 rounded-full border border-border bg-background text-sm transition-all"
            />
          </div>
        </div>
      </section>

      {/* KEY MILESTONES */}
      {showMilestones && (
        <section id="milestones" className="section-y bg-secondary/40">
          <div className="section-container max-w-[1280px]">
            <div className="section-head">
              <KickerLabel label="Milestones" className="reveal mb-3" />
              <h2 className="reveal reveal-delay-1 font-heading font-extrabold text-3xl lg:text-4xl text-foreground mb-4">
                {t("Key Milestones")}
              </h2>
              <p className="reveal reveal-delay-2 text-muted-foreground leading-relaxed max-w-[720px] text-[15px] lg:text-base">
                {t("Discover key milestones that reflect GEAT's industrial capabilities, technological expertise, and growing role in Algeria's energy sector.")}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {milestones.map((m, i) => (
                <article
                  key={m.title}
                  tabIndex={0}
                  style={{ transitionDelay: `${i * 90}ms` }}
                  className={`reveal group flex flex-col h-full bg-card rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 focus-visible:-translate-y-1 ${
                    m.featured
                      ? "border border-brand-edge shadow-[0_2px_10px_hsl(var(--geat-dark)/0.07)] hover:shadow-[0_10px_24px_-12px_hsl(var(--geat-dark)/0.22)]"
                      : "border border-border hover:border-border hover:shadow-[0_10px_24px_-14px_hsl(var(--geat-dark)/0.18)]"
                  }`}
                >
                  {m.featured && <div className="h-1 w-full bg-primary" />}
                  <div className="relative h-[190px] overflow-hidden bg-muted">
                    <img
                      src={m.img}
                      alt={t(m.alt)}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
                    />
                    <span className="surface-dark absolute top-3 right-3 font-heading text-xs font-bold tracking-widest text-foreground bg-geat-dark/70 px-2 py-1 rounded">
                      {m.num}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <KickerLabel label={m.category} size="sm" className="mb-3" />
                    <h3 className="font-heading font-bold text-xl text-foreground leading-snug mb-3">
                      {t(m.title)}
                    </h3>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">{t(m.desc)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* CAREERS */}
      {showCareers && (
        <section id="careers" className="section-y bg-secondary">
          <div className="section-container">
            <SectionTitle
              align="left"
              title="Career"
              highlight="Opportunities"
              subtitle="Join a team dedicated to delivering innovative energy solutions and supporting critical infrastructure across Algeria."
            />
            {jobsLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[248px] animate-pulse rounded-xl border border-border bg-card"
                  />
                ))}
              </div>
            )}

            {!jobsLoading && jobsError && (
              <p className="text-center text-muted-foreground py-12">
                {t("Open positions are unavailable right now. Please try again in a moment.")}
              </p>
            )}

            {!jobsLoading && !jobsError && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, i) => {
                  const departmentLabel = label("departments", job.department);
                  const contractLabel = label("contracts", job.contract);
                  const locationLabels = job.locations
                    .map((key) => label("locations", key))
                    .filter(Boolean)
                    .join(" · ");
                  return (
                    <article
                      key={job.id}
                      style={{ transitionDelay: `${i * 60}ms` }}
                      className="reveal group bg-card rounded-xl p-6 border border-border hover:border-brand-edge shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        {departmentLabel && <KickerLabel label={departmentLabel} size="sm" />}
                      </div>
                      {/* Titles come from the HRIS already in the active language,
                          so they are rendered as-is, never through t(). */}
                      <h3 className="font-heading font-bold text-lg text-foreground leading-snug mb-4 group-hover:text-accent transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                        {locationLabels && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" /> {locationLabels}
                          </span>
                        )}
                        {contractLabel && (
                          <span className="inline-flex items-center gap-2">
                            <Clock className="w-4 h-4 text-accent" /> {contractLabel}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/careers/jobs/${job.slug}`}
                        className="mt-auto group/btn inline-flex min-h-11 items-center justify-center gap-2 bg-brand text-brand-foreground font-heading font-semibold px-5 py-2.5 rounded-full hover:brightness-110 active:bg-accent active:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground active:scale-95 transition-all"
                      >
                        {t("Apply Now")}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}

            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                {query
                  ? t("No positions match your search. Try a different keyword.")
                  : t("There are no open positions right now. Check back soon.")}
              </p>
            )}
          </div>
        </section>
      )}


      {/* BUILD YOUR FUTURE CTA */}
      <section className="surface-dark relative overflow-hidden bg-geat-dark section-y-lg">
        <div className="absolute inset-0">
          <img
            src={ctaWorkshop}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-geat-dark/80" />
        </div>
        <div className="section-container relative z-10 text-center">
          <h2 className="reveal font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {t("Ready to Build Your Future With GEAT?")}
          </h2>
          <p className="reveal reveal-delay-1 mx-auto mt-5 max-w-xl text-muted-foreground">
            {t("Explore our current opportunities and discover where your skills can make an impact.")}
          </p>
          <div className="reveal reveal-delay-2 mt-9 flex justify-center">
            <Link to="/careers/jobs" className="btn-cta">
              {t("View Open Positions")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Inside <main>, as on every other page that renders it. Outside it the
          newsletter form sat in no landmark at all (axe `region`, 4 nodes). */}
      <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default News;
