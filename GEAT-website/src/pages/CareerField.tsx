import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import OpenJobsBoard from "@/components/OpenJobsBoard";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import KickerLabel from "@/components/KickerLabel";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import { careerFieldDepartments, careerFields, getCareerField } from "@/data/careers";
import { useJobCountByDepartments } from "@/hooks/useJobs";
import { useT } from "@/i18n/LanguageContext";

import heroEngineering from "@/assets/engineer-turbine.png";
import heroManufacturing from "@/assets/geat-turbine-hall.jpg";
import heroQuality from "@/assets/ps/welding.jpg";
import heroProject from "@/assets/gateway-team.jpeg";
import heroField from "@/assets/ps/workshop.jpg";
import heroSourcing from "@/assets/ps/skid-module.jpg";
import heroFinance from "@/assets/geat-team.jpeg";
import heroDigital from "@/assets/ps/digital-energy.png";

const fieldImages: Record<string, string> = {
  "engineering-technology": heroEngineering,
  "manufacturing-logistics": heroManufacturing,
  quality: heroQuality,
  "project-management": heroProject,
  "field-services": heroField,
  "sourcing-supply-chain": heroSourcing,
  "finance-administration": heroFinance,
  "digital-technology-it": heroDigital,
};

const CareerField = () => {
  const t = useT();
  const { slug = "" } = useParams();
  const field = getCareerField(slug);

  // Hooks run before the early return so their order stays stable across renders.
  const departmentKeys = careerFieldDepartments[slug] ?? [];
  const { count: relatedCount, isLoading: countLoading } = useJobCountByDepartments(departmentKeys);

  if (!field) return <Navigate to="/careers" replace />;

  const others = careerFields.filter((f) => f.slug !== field.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CareersSubNav />

      <main id="main">
      <PageHero
        breadcrumb={t(field.title)}
        breadcrumbTrail={[{ label: t("Careers"), href: "/careers" }]}
        title={t(field.title)}
        subtitle={t(field.intro)}
        image={fieldImages[field.slug] ?? heroEngineering}
        imageAlt={`${field.title} teams at GEAT`}
        primaryCta={{ label: t("View Open Positions"), href: "#field-jobs" }}
      />

      {/* Intro */}
      <section className="section-y">
        <div className="section-container grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
          <h2 className="reveal font-heading text-3xl font-bold leading-tight text-foreground lg:text-4xl">
            {t("What we do")}
          </h2>
          <div className="reveal reveal-delay-1 space-y-5 text-muted-foreground">
            {field.body.map((p) => (
              <p key={p}>{t(p)}</p>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll do / What we look for */}
      <section className="bg-muted/40 section-y">
        <div className="section-container grid gap-10 lg:grid-cols-2">
          {[
            { title: "What you'll do", items: field.whatYouDo },
            { title: "What we look for", items: field.lookingFor },
          ].map((block, i) => (
            <div
              key={block.title}
              className={`reveal reveal-delay-${i + 1} rounded-[8px] border border-border bg-card p-6 lg:p-8`}
            >
              <h3 className="font-heading text-xl font-bold text-foreground">{t(block.title)}</h3>
              <ul className="mt-5 space-y-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    {t(item)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Open positions in this field — same board & filters as Careers page */}
      <section id="field-jobs" className="scroll-mt-24 bg-muted/40 section-y">
        <div className="section-container">
          <div className="section-head flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <KickerLabel label="Career Opportunities" />
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground lg:text-4xl">
                {t("{title} openings").replace("{title}", t(field.title))}
              </h2>
              <p className="mt-4 text-muted-foreground">
                {countLoading
                  ? t("Loading opportunities…")
                  : t("Search and filter the {count} open {label} in {title} at General\n                Electric Algeria Turbines.")
                      .replace("{count}", String(relatedCount))
                      .replace("{label}", t(relatedCount === 1 ? "position" : "positions"))
                      .replace("{title}", t(field.title))}
              </p>
            </div>
            <Link
              to="/careers/jobs"
              className="group inline-flex items-center gap-2 text-sm font-bold text-foreground"
            >
              {t("See all opportunities")}
              <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {countLoading || relatedCount > 0 ? (
            <OpenJobsBoard departmentKeys={departmentKeys} />
          ) : (
            <div className="rounded-[8px] border border-border bg-card p-10 text-center">
              <p className="font-heading text-lg font-bold text-foreground">
                {t("No open positions in this field right now")}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("Send us a spontaneous application and we'll contact you when a role matches.")}
              </p>
              <Link
                to="/careers/submit-cv"
                className="mt-5 inline-flex rounded-full border-2 border-brand-edge px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                {t("Submit a Spontaneous Application")}
              </Link>
            </div>
          )}
        </div>
      </section>


      {/* Explore other fields */}
      <section className="bg-muted/40 section-y">
        <div className="section-container">
          <h2 className="section-head font-heading text-2xl font-bold text-foreground lg:text-3xl">
            {t("Explore other paths")}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((other) => (
              <Link
                key={other.slug}
                to={`/careers/fields/${other.slug}`}
                className="block rounded-[8px] border border-border bg-card p-6 transition-all duration-200 hover:border-brand-edge hover:shadow-[0_2px_8px_hsl(var(--geat-dark)/0.06)]"
              >
                <h3 className="inline-block border-b border-primary pb-1 font-heading text-[13px] font-bold leading-snug text-foreground">
                  {t(other.title)}
                </h3>
                <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">{t(other.desc)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </main>

      <Footer />
      <GeniChat />
    </div>
  );
};

export default CareerField;
