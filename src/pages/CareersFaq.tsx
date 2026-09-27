import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";

import { careersFaqs } from "@/data/careers";
import careersHero from "@/assets/careers-hero-bg.jpg";
import life1 from "@/assets/careers-1.jpg";
import life2 from "@/assets/careers-2.jpg";
import life3 from "@/assets/engineer-1.jpg";
import { useT } from "@/i18n/LanguageContext";

const relatedContent = [
  {
    image: life3,
    title: "How to apply",
    desc: "Learn more about our hiring process and get tips that guide you through the steps of the application.",
    to: "/careers/how-to-apply",
  },
  {
    image: life1,
    title: "Life at GEAT",
    desc: "Our culture is built on safety, shared expertise, mutual respect and equal opportunity for all.",
    to: "/careers/life-at-geat",
  },
  {
    image: life2,
    title: "Careers",
    desc: "Discover the positions open today at GEAT across engineering, manufacturing, quality and services.",
    to: "/careers/jobs",
  },
];

const CareersFaq = () => {
  const t = useT();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CareersSubNav />

      <main id="main">
      <PageHero
        breadcrumb={t("FAQs & support")}
        breadcrumbTrail={[{ label: t("Careers"), href: "/careers" }]}
        title={t("FAQs & support")}
        subtitle={t("Answers to the questions candidates ask us most often about applying to GEAT.")}
        image={careersHero}
        imageAlt="GEAT HR team supporting candidates"
        primaryCta={{ label: t("Explore all jobs"), href: "/careers/jobs" }}
      />

      <section className="surface-dark bg-geat-dark section-y">
        <div className="section-container max-w-5xl">
          <h2 className="reveal section-head font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {t("Application")}
          </h2>

          <div className="border-t border-border">
            {careersFaqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.q} className="border-b border-border">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between gap-6 px-5 py-6 text-left transition-colors sm:px-7 ${
                      isOpen ? "bg-muted" : "hover:bg-muted/50"
                    }`}
                  >
                    <span className="font-heading text-base font-bold text-foreground sm:text-lg">
                      {t(faq.q)}
                    </span>
                    {isOpen ? (
                      <Minus className="h-5 w-5 shrink-0 text-foreground" />
                    ) : (
                      <Plus className="h-5 w-5 shrink-0 text-foreground" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="max-w-3xl px-5 pb-7 text-sm leading-relaxed text-muted-foreground sm:px-7">
                      {t(faq.a)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      <section className="surface-dark bg-geat-dark section-y pt-0">
        <div className="section-container">
          <h2 className="reveal section-head font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {t("Related content")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedContent.map((item, i) => (
              <Link
                key={item.title}
                to={item.to}
                className={`reveal reveal-delay-${i + 1} group block overflow-hidden rounded-2xl bg-card transition-transform hover:-translate-y-1`}
              >
                <img
                  src={item.image}
                  alt={t(item.title)}
                  loading="lazy"
                  decoding="async"
                  className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                    {t(item.title)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
                  {/* Ink label + amber arrow — the same CTA shape as the 16
                      light-ground instances. Amber IS legible here (6.64:1 on
                      the navy card) but a "Learn more" should not be a
                      different component on a different background. */}
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    {t("Learn more")} <ArrowRight className="h-4 w-4 text-primary" />
                  </span>
                </div>
              </Link>
            ))}
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

export default CareersFaq;
