import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import KickerLabel from "@/components/KickerLabel";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import { useT } from "@/i18n/LanguageContext";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import OpenJobsBoard from "@/components/OpenJobsBoard";
import { PurposeMission, FindYourPath } from "@/components/CareersPurpose";

import careersHeroTurbine from "@/assets/careers-hero-turbine.png";
import ctaWorkshop from "@/assets/careers-cta-workshop.jpeg";
import teamAsset from "@/assets/geat-team.jpeg";
import geatLogo from "@/assets/geat-logo-header.png";

const SectionHeading = ({
  kicker,
  title,
  subtitle,
  align = "center",
}: {
  /** English source string — KickerLabel runs t() on it. Unlike the other
      props here, do NOT pre-translate this one. */
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) => (
  <div className={`section-head ${align === "center" ? "text-center" : ""}`}>
    <div className={`reveal mb-5 h-1 w-12 bg-primary ${align === "center" ? "mx-auto" : ""}`} />
    {kicker && <KickerLabel label={kicker} className="reveal mb-3" />}
    <h2 className="reveal reveal-delay-1 font-heading text-3xl font-bold text-foreground lg:text-4xl">{title}</h2>
    {subtitle && (
      <p
        className={`reveal reveal-delay-2 mt-4 max-w-2xl text-muted-foreground ${
          align === "center" ? "mx-auto" : ""
        }`}
      >
        {subtitle}
      </p>
    )}
  </div>
);
const geniConversation: { from: "geni" | "user"; text: string }[] = [
  { from: "geni", text: "Hi! I'm Geni, GEAT's careers assistant. What are you looking for today?" },
  { from: "user", text: "I'm a mechanical engineer — any openings in Batna?" },
  {
    from: "geni",
    text: "Yes — we have roles in turbine assembly, quality and field services. Want me to filter the open jobs for you?",
  },
  { from: "user", text: "Yes please. How does the application work?" },
];



const Careers = () => {
  const t = useT();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CareersSubNav />

      <main id="main">
        {/* 1. HERO */}
        <PageHero
          breadcrumb={t("Careers")}
          title={t("Powering careers.\nBuilding the future.")}
          subtitle={t("Join GEAT and be part of a team that drives innovation, excellence and sustainable energy.")}
          image={careersHeroTurbine}
          imageAlt="Gas turbine rotor inside the GEAT manufacturing facility"
          primaryCta={{ label: t("View Open Positions"), href: "#opportunities" }}
          secondaryCta={{ label: t("Submit Your CV"), href: "/careers/submit-cv" }}
        />


        {/* PURPOSE & MISSION + FIND YOUR PATH */}
        <PurposeMission />
        <FindYourPath />

        {/* 3. WHY JOIN? */}
        <section className="section-y bg-background">
          <div className="section-container">
            <div className="reveal relative overflow-hidden rounded-xl">
              <img
                src={teamAsset}
                alt="GEAT teams at the Batna industrial complex"
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
                className="aspect-[16/9] w-full object-cover lg:aspect-[21/9]"
              />
              {/* Play button overlay for video feel. A 20% tint, not a dark
                  ground: the control inside sits on its own light card, so this
                  deliberately does NOT carry surface-dark. */}
              <div className="absolute inset-0 flex items-center justify-center bg-geat-dark/20">
                <button
                  type="button"
                  aria-label={t("Play video")}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-card/90 text-foreground shadow-lg transition-transform hover:scale-110 lg:h-20 lg:w-20"
                >
                  <svg className="ml-1 h-7 w-7 lg:h-8 lg:w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-12 max-w-4xl lg:mt-16">
              <h2 className="reveal reveal-delay-1 font-heading text-6xl font-black uppercase leading-none tracking-tight text-accent sm:text-7xl lg:text-8xl">
                {t("Why join?")}
              </h2>
              <p className="reveal reveal-delay-2 mt-7 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {t("You'll get the chance to push boundaries, take energy where it has never been, and build\n            smarter, more reliable solutions that will power generations to come. This is your chance\n            to help lead the energy transition in Algeria and leave a legacy that matters.")}
              </p>
            </div>
          </div>
        </section>

        {/* BUILD YOUR CAREER WITH GEAT */}
        <section className="surface-dark section-y bg-geat-dark">
          <div className="section-container grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div className="reveal border-l-2 border-primary pl-6">
              <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
                {t("Hi, I’m Geni")}
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                {t("I’m here to help you explore career opportunities at GEAT, find the perfect fit, and\n              guide you through the application process.")}
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("geni:open"))}
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-brand py-2 pl-6 pr-2 font-heading text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.03]"
              >
                {t("Chat with Geni")}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-foreground text-brand transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </div>


            {/* Geni conversation preview */}
            <div className="reveal mx-auto w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
              <div className="flex items-center gap-3 border-b border-border bg-card px-5 py-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-heading text-sm font-bold text-brand-foreground">
                  G
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-semibold text-foreground">{t("Geni")}</p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    {/* A presence light, not an ornament — so it takes the
                        semantic success token, not the brand amber. Amber is
                        the universal "degraded / away" colour in a status dot;
                        painting "Online" amber said the opposite of the word
                        beside it. The word carries the state for anyone who
                        cannot see the dot, so the mark itself has no contrast
                        floor. */}
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" />{" "}
                    {t("Online — Careers assistant")}
                  </p>
                </div>
                <img
                  src={geatLogo}
                  alt="GEAT logo"
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-auto flex-none object-contain brightness-0 invert"
                />
              </div>

              <div className="space-y-4 bg-card px-5 py-6">
                {geniConversation.map((m, i) =>
                  m.from === "geni" ? (
                    <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 3)} flex justify-start`}>
                      <p className="max-w-[80%] rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
                        {t(m.text)}
                      </p>
                    </div>
                  ) : (
                    <div key={i} className={`reveal reveal-delay-${Math.min(i + 1, 3)} flex justify-end`}>
                      <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand px-4 py-3 text-sm leading-relaxed text-brand-foreground">
                        {t(m.text)}
                      </p>
                    </div>
                  )
                )}
                <div className="flex justify-start">
                  <span className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-muted px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60"
                        style={{ animationDelay: `${d * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent("geni:open"))}
                className="flex w-full items-center justify-between border-t border-border bg-card px-5 py-4 text-left text-sm text-muted-foreground transition-colors hover:bg-muted"
              >
                {t("Ask Geni a question…")}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </button>
            </div>


          </div>
        </section>

        {/* 4. JOB OPPORTUNITIES */}
        <section id="opportunities" className="section-y bg-muted/40">
          <div className="section-container">
            <SectionHeading
              kicker="Career Opportunities"
              title={t("Find your opportunity at GEAT")}
              subtitle={t("Explore open positions and take the next step in your career with General Electric Algeria Turbines.")}
              align="left"
            />
            <OpenJobsBoard />
          </div>
        </section>



        {/* 8. FINAL CTA */}
        <section className="surface-dark section-y-lg relative overflow-hidden bg-geat-dark">
          <div className="absolute inset-0">
            <img
              src={ctaWorkshop}
              alt=""
              loading="lazy"
              decoding="async"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
            {/* Decorative scrim only — no descendants, so no surface-dark;
                the section already carries one for the copy below. */}
            <div className="absolute inset-0 bg-geat-dark/80" />
          </div>
          <div className="section-container relative z-10 text-center">
            <h2 className="reveal font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t("Can't find what you're looking for?")}
            </h2>
            <p className="reveal reveal-delay-1 mx-auto mt-5 max-w-xl text-muted-foreground">
              {t("Submit a spontaneous application, and we'll contact you if a position matches your profile.")}
            </p>
            <div className="reveal reveal-delay-2 mt-9 flex justify-center">
              <Link to="/careers/submit-cv" className="btn-cta">
                {t("Submit a Spontaneous Application")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

        </section>
      </main>

      <Footer />
      <GeniChat />
      <ApplicationStatusModal />
    </div>
  );
};

export default Careers;
