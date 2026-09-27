import { ArrowRight, Cog, Cpu, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import KickerLabel from "@/components/KickerLabel";
import prodHero from "@/assets/hero-3.jpg";
import { products, psCategories, psPath, type PsCategory } from "@/data/products";
import { useT } from "@/i18n/LanguageContext";

const categoryIcon: Record<PsCategory, typeof Cog> = {
  Products: Cog,
  "Technologies & Solutions": Cpu,
  Services: Wrench,
};

const ProductsServices = () => {
  const t = useT();
  return (
  <div className="min-h-screen bg-background text-foreground">
    <Navbar />

    <main id="main">
    <PageHero
      breadcrumb={t("Products & Services")}
      title={t("Products, Technologies")}
      highlight={t("& Services")}
      subtitle={t("A complete portfolio of equipment, technologies and services powering Algeria's energy infrastructure.")}
      image={prodHero}
      imageAlt={t("GEAT turbine manufacturing and service capabilities")}
      primaryCta={{ label: t("Contact Us"), href: "/contact" }}
      secondaryCta={{ label: t("About GEAT"), href: "/about" }}
    />

    {/* INTRO + CATEGORY NAV */}
    <section className="section-y">
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="reveal">
            <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t("Engineered in Algeria, built for the grid")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {t("From 9F.04 gas turbines and STF-A650 steam turbines to auxiliary piping and skids, turbine control systems, grid equipment, digital energy platforms and full service and repair capabilities — GEAT covers the power generation value chain from our site in Ain Yagout.")}
            </p>
          </div>
          <div className="grid gap-px sm:grid-cols-3">
            {psCategories.map(({ name, description }) => {
              const Icon = categoryIcon[name];
              return (
                <div key={name} className="reveal border-l-2 border-primary px-6 py-4">
                  <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
                  <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                    {t(name)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(description)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    {/* PORTFOLIO GRIDS */}
    {psCategories.map(({ name }, index) => (
      <section
        key={name}
        className={`section-y ${index % 2 === 0 ? "bg-secondary" : ""}`}
      >
        <div className="section-container">
          <div className="section-head">
            {/* KickerLabel supplies its own decorative rule — the hand-rolled
                one that used to sit in front of this label is gone. */}
            <KickerLabel label={name} />
            <h2 className="mt-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {name === "Products"
                ? t("Turbines and auxiliary systems")
                : name === "Services"
                  ? t("Service and repair capabilities")
                  : t("Control, grid and digital technologies")}
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.category === name)
              .map((p) => (
                <Link
                  key={p.slug}
                  to={psPath(p.slug)}
                  className="reveal group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_hsl(var(--geat-dark)/0.05)] transition-all hover:-translate-y-1 hover:border-brand-edge hover:shadow-[0_16px_40px_-18px_hsl(var(--geat-dark)/0.28)]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-secondary sm:aspect-[4/3]">
                    <img
                      src={p.showcaseImage ?? p.heroImage}
                      alt={t(p.name)}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${
                        p.showcaseContained ? "object-contain p-6" : "object-cover"
                      }`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-7">
                    {p.model && <KickerLabel label={p.model} />}
                    <h3 className="mt-2 font-heading text-xl font-bold text-foreground">
                      {t(p.name)}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {t(p.summary)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                      {t("Discover")}
                      <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    ))}

    {/* CTA */}
    <section className="surface-dark bg-geat-dark section-y-lg">
      <div className="section-container flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {t("Looking for a specific solution?")}
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {t("Tell us about your plant, your turbines and your timeline — our teams will get back to you.")}
          </p>
        </div>
        <Link to="/contact" className="btn-cta group">
          <span>{t("Contact GEAT")}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
    </main>

    <Footer />
  </div>
  );
};

export default ProductsServices;
