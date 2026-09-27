import { useEffect } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import KickerLabel from "@/components/KickerLabel";
import Newsletter from "@/components/Newsletter";
import aboutHero from "@/assets/about-hero-building.jpg";
import turbineHallAsset from "@/assets/geat-turbine-hall.jpg";
import jointVentureAsset from "@/assets/geat-joint-venture.webp";
import gatewayTeamAsset from "@/assets/gateway-team.jpeg";
import workshopAsset from "@/assets/careers-cta-workshop.jpeg";
import { useT } from "@/i18n/LanguageContext";

const numbers = [
  {
    value: "$168M",
    title: "Investment",
    text: "Total investment in the GEAT joint venture, one of the largest industrial energy investments in Algeria.",
  },
  {
    value: "51% Sonelgaz & 49% GE",
    title: "Ownership",
    text: "A joint venture between Sonelgaz and GE Vernova, combining national ambition with global technology.",
  },
  {
    value: "2,7 MILLIONS",
    title: "Working hours",
    text: "Construction and equipment commissioning of our Aïn Yagout facility.",
  },
  {
    value: "200 000 sqm",
    title: "Factory area",
    text: "5 production bays, paint booth and administrative offices.",
  },
];

const segments = [
  {
    name: "POWER GENERATION",
    intro:
      "The Power Generation segment brings together the technologies, manufacturing capability and domain expertise required to produce reliable electricity at scale.",
    lines: [
      {
        title: "Gas Turbines",
        note: "Assembly, testing and packaging of heavy-duty gas turbines for Algerian and export power plants.",
        href: "/products-services/gas-turbines",
      },
      {
        title: "Auxiliary Systems",
        note: "Lube oil, fuel, cooling and enclosure systems engineered to operate in demanding site conditions.",
        href: "/products-services/auxiliaries",
      },
      {
        title: "Control Systems",
        note: "Instrumentation and control integration that safeguards availability and performance.",
        href: "/products-services/control-systems",
      },
      {
        title: "Plant Integration",
        note: "Coordinated delivery of equipment packages from the factory floor to the power plant.",
        href: "/products-services",
      },
    ],
  },
  {
    name: "ELECTRIFICATION & SERVICES",
    intro:
      "The Electrification & Services segment supports the full lifecycle of energy assets — from grid infrastructure to maintenance, repair and technical assistance.",
    lines: [
      {
        title: "Grid Solutions",
        note: "High and medium voltage substations, disconnectors, switchgear and protection systems.",
        href: "/products-services/grid-solutions",
      },
      {
        title: "Command & Control",
        note: "Command, control and telecom equipment for reliable transmission and distribution networks.",
        href: "/products-services/digital-solutions",
      },
      {
        title: "Maintenance & Repair",
        note: "Preventive maintenance, equipment repair and turbine support that maximize uptime.",
        href: "/products-services/repair-services",
      },
      {
        title: "Technical Assistance",
        note: "Field service, inspection and aero machine services delivered by local specialists.",
        href: "/products-services/power-plant-maintenance",
      },
    ],
  },
];

const promos = [
  {
    image: workshopAsset,
    eyebrow: "Powering forward Algeria",
    title: "Our products and services",
    text: "Explore the turbines, auxiliary systems and industrial services manufactured and supported at our Batna facility.",
    href: "/products-services",
  },
  {
    image: turbineHallAsset,
    eyebrow: "GEAT stories",
    title: "Discover the latest news and milestones",
    text: "From the first Algerian-built turbines to international exports, follow the milestones shaping our energy future.",
    href: "/news",
  },
];

const About = () => {
  const t = useT();

  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main">
        <PageHero
          breadcrumb={t("About us")}
          title={t("About")}
          highlight={t("us")}
          subtitle={t("GEAT brings together advanced technology, industrial capability and local expertise to strengthen Algeria's power generation infrastructure and support the country's energy future.")}
          image={aboutHero}
          imageAlt={t("GEAT Algeria Turbines facility in Aïn Yagout, Batna")}
        />

        {/* OUR MISSION */}
        <section className="section-y border-b border-border bg-background">
          <div className="section-container">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4">
                <h2 className="reveal font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
                  {t("Our mission is clear")}
                </h2>
              </div>
              <div className="reveal reveal-delay-1 space-y-6 lg:col-span-8">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t("Empower businesses with reliable and efficient power equipment solutions that enhance productivity, promote sustainability, and improve quality of life to populations.")}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t("We are committed to delivering innovative products that meet the highest standards of performance, safety, and environmental responsibility.")}
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {t("Through our dedication to excellence and customer satisfaction, we strive to be a trusted partner in powering a brighter future for all.")}
                </p>
              </div>
            </div>

            <figure className="reveal reveal-delay-2 group mt-16 overflow-hidden rounded-lg border border-border bg-card p-4 md:p-8">
              <div className="overflow-hidden rounded-md">
                <img
                  src={jointVentureAsset}
                  width={1918}
                  height={820}
                  alt={t("Structure of the GEAT joint venture between GE Vernova (49%) and Sonelgaz (51%)")}
                  className="mx-auto w-full max-w-4xl transition-transform duration-700 group-hover:scale-[1.03]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </figure>
          </div>
        </section>

        {/* GEAT IN NUMBERS */}
        <section className="surface-dark section-y relative overflow-hidden border-b border-border bg-geat-dark">
          <div className="section-container relative z-10">
            <div className="max-w-3xl">
              <h2 className="reveal font-heading text-3xl font-bold text-foreground md:text-4xl">
                {t("GEAT in Numbers")}
              </h2>
              <p className="reveal reveal-delay-1 mt-6 leading-relaxed text-muted-foreground">
                {t("From industrial investment and manufacturing capacity to local employment and technical training, GEAT's key figures reflect our growing capabilities and contribution to Algeria's energy and industrial development.")}
              </p>
            </div>
            <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {numbers.map((n, i) => (
                <div
                  key={n.title}
                  style={{ transitionDelay: `${i * 120}ms` }}
                  className="reveal group border-l border-border pl-6 transition-all duration-500 hover:pl-7"
                >
                  <div className="font-heading text-4xl font-bold leading-none text-foreground transition-transform duration-500 group-hover:scale-105 lg:text-5xl">
                    {t(n.value)}
                  </div>
                  <KickerLabel label={n.title} className="mt-4" />
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(n.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE'RE ORGANIZED */}
        <section className="section-y border-b border-border bg-card">
          <div className="section-container">
            <h2 className="reveal font-heading text-xl font-bold text-foreground md:text-2xl">
              {t("How we're organized")}
            </h2>
            <p className="reveal reveal-delay-1 mt-6 max-w-4xl text-base leading-relaxed text-muted-foreground">
              {t("We are rewriting Algeria's energy equation with a portfolio that spans power generation equipment, electrification infrastructure and industrial services. Our two operating segments are organized around the nature of our markets and customers.")}
            </p>

            <div className="mt-14 space-y-14">
              {segments.map((seg, i) => (
                <div key={seg.name} style={{ transitionDelay: `${i * 100}ms` }} className="reveal border-t border-border pt-10">
                  <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-foreground">
                    {t(seg.name)}
                  </h3>
                  <p className="mt-5 max-w-4xl text-sm leading-relaxed text-muted-foreground">{t(seg.intro)}</p>
                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    {seg.lines.map((l, li) => (
                      <Link
                        key={l.title}
                        to={l.href}
                        style={{ transitionDelay: `${(i * 100) + (li * 80)}ms` }}
                        className="reveal group relative block border-l-2 border-primary/60 bg-background p-5 pl-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-card hover:shadow-[0_12px_30px_-16px_hsl(var(--foreground)/0.18)]"
                      >
                        <span className="absolute left-0 top-0 h-full w-0.5 bg-primary transition-all duration-300 group-hover:h-full" />
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-heading text-base font-bold text-foreground transition-colors group-hover:text-accent">{t(l.title)}</h4>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(l.note)}</p>
                          </div>
                          <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROMO CARDS */}
        <section className="section-y border-b border-border bg-background">
          <div className="section-container">
            <div className="grid gap-10 md:grid-cols-2">
              {promos.map((p, i) => (
                <article
                  key={p.title}
                  style={{ transitionDelay: `${i * 120}ms` }}
                  className="reveal group flex flex-col overflow-hidden rounded-lg border border-border bg-card"
                >
                  <div className="overflow-hidden">
                    <img
                      src={p.image}
                      alt={t(p.title)}
                      className="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] md:h-[280px]"
                      loading="lazy"
                      decoding="async"
                      width={1120}
                      height={560}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <KickerLabel label={p.eyebrow} />
                    <h3 className="mt-4 font-heading text-xl font-bold text-foreground md:text-2xl">{t(p.title)}</h3>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{t(p.text)}</p>
                    <Link
                      to={p.href}
                      className="mt-8 inline-flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wider text-foreground"
                    >
                      {t("Learn more")}
                      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CAREERS BAND */}
        <section className="surface-dark section-y-lg relative overflow-hidden bg-geat-dark text-foreground">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `url(${gatewayTeamAsset})`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
          {/* Decorative scrim only — no descendants, so it needs no surface-dark;
              the section above it already carries one for the copy. */}
          <div className="absolute inset-0 bg-gradient-to-r from-geat-dark via-geat-dark/85 to-geat-dark/40" />
          <div className="section-container relative z-10">
            <div className="max-w-2xl">
              <h2 className="reveal font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
                {t("Careers with GEAT")}
              </h2>
              <p className="reveal reveal-delay-1 mt-6 text-lg leading-relaxed text-muted-foreground">
                {t("Join a team of engineers and specialists building Algeria's energy future from Batna.")}
              </p>
              <Link to="/careers" className="reveal reveal-delay-2 btn-cta group mt-8">
                <span>{t("Explore careers")}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

export default About;
