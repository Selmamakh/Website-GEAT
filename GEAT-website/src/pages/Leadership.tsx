import { ArrowRight, ArrowUpRight, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import leadHero from "@/assets/hero-2.jpg";
import Newsletter from "@/components/Newsletter";
import turbineHeroAsset from "@/assets/turbine-hero.png";
import { useT } from "@/i18n/LanguageContext";

type Leader = {
  name: string;
  initials: string;
  titles: string[];
  bio: string;
};

const leaders: Leader[] = [
  {
    name: "NAME",
    initials: "KB",
    titles: ["Chief Executive Officer and President"],
    bio: "Karim Bensalem leads GEAT as CEO and President, driving the joint venture between SONELGAZ and GE to power Algeria's industrial future. With 25+ years in the energy sector, he champions reliable, efficient and sustainable energy infrastructure across the country.",
  },
  {
    name: "NAME",
    initials: "AH",
    titles: ["Chief Operating Officer, GEAT"],
    bio: "Amira oversees GEAT's manufacturing, assembly and service operations across Algeria. She ensures world-class performance, safety standards and operational reliability for every project the company delivers.",
  },
  {
    name: "NAME",
    initials: "YM",
    titles: ["Chief Executive Officer, Power Generation"],
    bio: "Yacine leads GEAT's Power Generation segment, providing advanced gas and steam turbine technologies, auxiliary systems and integrated power plant solutions that strengthen Algeria's electricity production.",
  },
  {
    name: "NAME",
    initials: "SB",
    titles: ["Chief Executive Officer, Electrification"],
    bio: "Sofiane is responsible for GEAT's Electrification segment, delivering high‑growth grid systems, substations and protection solutions that modernize Algeria's transmission and distribution network.",
  },
  {
    name: "NAME",
    initials: "NC",
    titles: ["Chief People Officer, GEAT"],
    bio: "Nadia leads people, organization and culture at GEAT — talent acquisition, workforce planning, employee relations and the safety, health and wellbeing of our 200+ engineers and specialists.",
  },
  {
    name: "NAME",
    initials: "RS",
    titles: ["Chief Financial Officer, GEAT"],
    bio: "Riad oversees finance, sourcing and business development across GEAT. He manages investor relationships and drives the financial discipline that supports long-term industrial investment in Algeria.",
  },
  {
    name: "NAME",
    initials: "LB",
    titles: ["Chief Legal Officer and Secretary"],
    bio: "Leila oversees all legal affairs at GEAT, ensuring the company operates with integrity, regulatory compliance and the highest standards of corporate governance.",
  },
  {
    name: "NAME",
    initials: "OT",
    titles: ["Chief Commercial & Operations Officer", "Head of Services"],
    bio: "Omar drives commercial strategy and operational excellence at GEAT, leading the Services business that delivers 24/7 maintenance, repair and technical assistance for power generation assets nationwide.",
  },
  {
    name: "NAME",
    initials: "SL",
    titles: ["Chief Corporate Officer", "Chief Sustainability Officer"],
    bio: "Samir engages public and private sector leaders to advance energy affordability, reliability, security and sustainability — shaping GEAT's role in Algeria's long-term energy transition.",
  },
];

const Leadership = () => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      <main id="main">
        {/* HERO */}
        <PageHero
          breadcrumb={t("Leadership")}
          title={t("Our")}
          highlight={t("Leadership")}
          subtitle={t("Meet the executive team driving GEAT's mission to electrify Algeria, deliver industrial excellence and build a sustainable energy future.")}
          image={leadHero}
          imageAlt={t("GEAT industrial turbine facility")}
          primaryCta={{ label: t("Contact Us"), href: "/contact" }}
          secondaryCta={{ label: t("About GEAT"), href: "/about" }}
        />


        {/* EXECUTIVE LEADERSHIP TEAM */}
        <section className="section-y bg-background">
          <div className="section-container">
            <div className="section-head">
              <div className="reveal w-12 h-1 bg-primary mb-6" />
              <h2 className="reveal reveal-delay-1 font-heading font-bold text-3xl lg:text-4xl text-foreground">
                {t("Executive Leadership Team")}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaders.map((leader, i) => (
                <article
                  key={leader.initials}
                  style={{ transitionDelay: `${(i % 3) * 100}ms` }}
                  className="reveal group relative rounded-2xl bg-card border border-border overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-brand-edge hover:shadow-[0_30px_60px_-20px_hsl(var(--geat-orange)/0.35)]"
                >
                  {/* Portrait area */}
                  <div className="surface-dark relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-geat-dark via-secondary to-geat-dark">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, hsl(var(--geat-orange)/0.4), transparent 55%), radial-gradient(circle at 70% 80%, hsl(var(--geat-blue)/0.4), transparent 55%)" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-heading font-bold text-[8rem] text-foreground leading-none transition-transform duration-700 group-hover:scale-110">
                        {leader.initials}
                      </span>
                    </div>
                    {/* corner accent */}
                    <span className="absolute top-0 left-0 h-1 w-16 bg-geat-orange transition-all duration-500 group-hover:w-full" />
                    <button
                      type="button"
                      aria-label={t("LinkedIn")}
                      className="tap-target group/li absolute top-3 right-3"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 backdrop-blur text-foreground transition-colors group-hover/li:bg-primary group-hover/li:text-primary-foreground">
                        <Linkedin className="w-4 h-4" />
                      </span>
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-1">
                      {leader.name}
                    </h3>
                    <div className="mb-4 space-y-0.5">
                      {leader.titles.map((title) => (
                        <p key={title} className="text-sm text-muted-foreground font-heading font-semibold">
                          {t(title)}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-4">
                      {t(leader.bio)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-heading font-semibold text-foreground transition-colors group-hover:text-accent">
                      {t("Read full bio")}
                      <ArrowUpRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WE BRING THE ENERGY — CTA band */}
        <section className="surface-dark section-y-lg relative overflow-hidden bg-geat-dark text-foreground">
          <div
            className="absolute inset-0 opacity-50"
            style={{ backgroundImage: `url(${turbineHeroAsset})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          {/* Decorative scrim only — no descendants, so no surface-dark;
              the section already carries one for the copy below. */}
          <div className="absolute inset-0 bg-gradient-to-r from-geat-dark via-geat-dark/85 to-geat-dark/40" />
          <div className="relative z-10 section-container">
            <div className="max-w-2xl relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
              <h2 className="reveal font-heading font-bold text-4xl md:text-6xl uppercase leading-[1.05] mb-6">
                {t("We bring the")} <span className="text-highlight">{t("energy")}</span>
              </h2>
              <p className="reveal reveal-delay-1 text-muted-foreground text-lg mb-8 leading-relaxed">
                {t("With Algeria's energy demand growing year after year, GEAT keeps innovating to meet the moment — building the people, technology and partnerships that power the country forward.")}
              </p>
              <Link to="/careers" className="reveal reveal-delay-2 btn-cta group">
                <span>{t("Join the Team")}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

export default Leadership;
