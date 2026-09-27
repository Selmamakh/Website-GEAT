import { Link, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  CalendarClock,
  Check,
  Layers,
  MapPin,
  Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import careersHero from "@/assets/careers-hero-bg.jpg";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import { ApiError } from "@/api/client";
import { useJobQuery } from "@/hooks/useJobs";
import { useReferenceData } from "@/hooks/useReferenceData";
import { safeExternalUrl, sanitizeRichText } from "@/lib/sanitizeHtml";
import { GEAT_OFFERS, formatDate } from "@/data/careers";
import { useT } from "@/i18n/LanguageContext";

/**
 * One body section. The API sends both a plain-text field and an optional
 * rich-text twin; the rich-text one wins when present, and is sanitised before
 * it reaches dangerouslySetInnerHTML.
 *
 * Plain text arrives newline-separated. Several lines read as a list (which is
 * how these sections are authored), a single line as a paragraph.
 */
const BodySection = ({
  title,
  text,
  html,
}: {
  title: string;
  text: string | null;
  html: string | null;
}) => {
  const t = useT();
  if (!text?.trim() && !html?.trim()) return null;

  if (html?.trim()) {
    return (
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">{t(title)}</h2>
        <div
          className="prose prose-sm max-w-none leading-relaxed text-muted-foreground prose-headings:font-heading prose-headings:text-foreground prose-strong:text-foreground prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(html) }}
        />
      </section>
    );
  }

  const lines = (text ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <section className="mb-10">
      <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">{t(title)}</h2>
      {lines.length > 1 ? (
        <ul className="space-y-3">
          {lines.map((line) => (
            <li key={line} className="flex gap-3 text-muted-foreground">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="leading-relaxed text-muted-foreground">{lines[0]}</p>
      )}
    </section>
  );
};

/** Editorial fallback, used only when the offer carries no benefits text. */
const OffersSection = () => {
  const t = useT();
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">{t("What GEAT Offers")}</h2>
      <ul className="space-y-3">
        {GEAT_OFFERS.map((item) => (
          <li key={item} className="flex gap-3 text-muted-foreground">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <span>{t(item)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <CareersSubNav />
    <main id="main">{children}</main>
    <Footer />
    <GeniChat />
    <ApplicationStatusModal />
  </div>
);

const JobDetails = () => {
  const t = useT();
  const { slug } = useParams();
  const { label } = useReferenceData();
  const { data: job, isLoading, error, refetch } = useJobQuery(slug);

  if (isLoading) {
    return (
      <Shell>
        <div className="section-container section-y-lg">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-2/3 rounded bg-muted" />
            <div className="h-4 w-1/2 rounded bg-muted" />
            <div className="h-64 rounded bg-muted" />
          </div>
        </div>
      </Shell>
    );
  }

  // A job can be unpublished between the board listing it and the candidate
  // opening it, so 404 is an ordinary outcome here, not an error state.
  if (error instanceof ApiError && error.kind === "notFound") {
    return (
      <Shell>
        <div className="section-container section-y-lg text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">{t("Position not found")}</h1>
          <p className="mt-4 text-muted-foreground">{t("This opening may no longer be available.")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/careers/jobs" className="btn-cta">
              {t("See all opportunities")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/careers/submit-cv"
              className="tap-target rounded-full border-2 border-brand-edge px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              {t("Submit a spontaneous application")}
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (error || !job) {
    return (
      <Shell>
        <div className="section-container section-y-lg text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-primary" />
          <h1 className="mt-4 font-heading text-3xl font-bold text-foreground">
            {t("This position cannot be loaded right now")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {t("We could not reach the recruitment service. Please try again in a moment.")}
          </p>
          <button type="button" onClick={() => refetch()} className="btn-cta mt-8">
            {t("Try again")} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </Shell>
    );
  }

  const locationLabels = job.locations
    .map((key) => label("locations", key))
    .filter(Boolean)
    .join(" · ");

  const meta = [
    { icon: Building2, label: "Department", value: label("departments", job.department) },
    { icon: MapPin, label: "Location", value: locationLabels },
    { icon: Briefcase, label: "Employment type", value: label("contracts", job.contract) },
    { icon: Layers, label: "Experience level", value: label("professional-levels", job.level) },
    { icon: Building2, label: "Business area", value: label("business-areas", job.businessArea) },
    { icon: Users, label: "Openings", value: job.openings > 0 ? String(job.openings) : "" },
    {
      icon: CalendarClock,
      label: "Application deadline",
      value: job.deadline ? formatDate(job.deadline) : "",
    },
  ].filter((item) => item.value);

  const applyHref = `/careers/jobs/${job.slug}/apply`;

  return (
    <Shell>
      <PageHero
        breadcrumb={job.title}
        breadcrumbTrail={[{ label: t("Careers"), href: "/careers" }]}
        title={job.title}
        subtitle={job.summary ?? ""}
        image={careersHero}
        imageAlt="GEAT engineers on site"
        primaryCta={{ label: t("Apply Now"), href: applyHref }}
        secondaryCta={{ label: t("All Jobs"), href: "/careers/jobs" }}
      />

      <div className="section-container section-y grid gap-12 lg:grid-cols-[1fr_340px]">
        <article>
          <p className="mb-8 text-sm text-muted-foreground">
            {t("Reference")}: <span className="font-semibold text-foreground">{job.reference}</span>
          </p>

          <BodySection title="About the Role" text={job.presentation} html={job.presentationHtml} />
          <BodySection title="Responsibilities" text={job.missions} html={job.missionsHtml} />
          <BodySection title="Requirements" text={job.profile} html={job.profileHtml} />
          {job.benefits?.trim() || job.benefitsHtml?.trim() ? (
            <BodySection title="What GEAT Offers" text={job.benefits} html={job.benefitsHtml} />
          ) : (
            <OffersSection />
          )}

          {/* A non-http(s) redirect is dropped rather than rendered — see
              safeExternalUrl. The internal route is the fallback, so a bad
              value degrades to the normal apply flow instead of a dead link. */}
          {safeExternalUrl(job.externalRedirectUrl) ? (
            <a
              href={safeExternalUrl(job.externalRedirectUrl) as string}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta"
            >
              {t("Apply Now")} <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <Link to={applyHref} className="btn-cta">
              {t("Apply Now")} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </article>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="mb-5 font-heading text-lg font-semibold text-foreground">{t("Position details")}</h2>
          <dl className="space-y-5">
            {meta.map((m) => (
              <div key={m.label} className="flex gap-3">
                <m.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{t(m.label)}</dt>
                  <dd className="text-sm font-medium text-foreground">{m.value}</dd>
                </div>
              </div>
            ))}
          </dl>
          <Link to={applyHref} className="btn-cta mt-7 w-full justify-center">
            {t("Apply Now")} <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </Shell>
  );
};

export default JobDetails;
