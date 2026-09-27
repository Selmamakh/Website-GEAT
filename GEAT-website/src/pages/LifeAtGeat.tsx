import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Star,
  HeartHandshake,
  ShieldCheck,
  ScrollText,
  TrendingUp,
  Quote,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import KickerLabel from "@/components/KickerLabel";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import life1 from "@/assets/careers-1.jpg";
import life2 from "@/assets/careers-2.jpg";
import life3 from "@/assets/engineer-1.jpg";
import teamAsset from "@/assets/geat-team.jpeg";
import workerAsset from "@/assets/geat-worker.jpg";
import facilityAsset from "@/assets/geat-facility.png";
import engineerAsset from "@/assets/geat-engineer-portrait.png";
import hallAsset from "@/assets/geat-turbine-hall.jpg";
import workshopAsset from "@/assets/ps/workshop.jpg";
import weldingAsset from "@/assets/ps/welding.jpg";
import ctaWorkshop from "@/assets/careers-cta-workshop.jpeg";
import buildingAsset from "@/assets/geat-building.png";
import lifeHero from "@/assets/life-at-geat-hero.png";
import { useT } from "@/i18n/LanguageContext";

const quality = [
  {
    icon: HeartHandshake,
    title: "Customer Satisfaction",
    desc: "We listen, respond and deliver — our customers' reliability targets shape every decision we make.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Safety",
    desc: "International standards, strict procedures and an uncompromising safety culture on every site.",
  },
  {
    icon: ScrollText,
    title: "Integrity",
    desc: "We act transparently and keep our commitments, to our customers and to each other.",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    desc: "Every inspection, every project feeds back into better methods, tools and performance.",
  },
];

const people = [
  {
    image: engineerAsset,
    role: "Engineers",
    desc: "Design, methods and technical studies on gas and steam turbine technology.",
  },
  {
    image: weldingAsset,
    role: "Technicians",
    desc: "Precision assembly, welding, machining and component repair specialists.",
  },
  {
    image: hallAsset,
    role: "Production Teams",
    desc: "The shop floor teams turning engineering into reliable rotating equipment.",
  },
  {
    image: workerAsset,
    role: "Maintenance Specialists",
    desc: "Field service teams keeping Algeria's power plants available and efficient.",
  },
  {
    image: teamAsset,
    role: "Support Functions",
    desc: "Quality, supply chain, HSE, finance and HR — the backbone of every project.",
  },
  {
    image: life3,
    role: "Young Professionals",
    desc: "Graduates and apprentices learning from experts on real industrial programmes.",
  },
];

const insideGeat = [
  { image: facilityAsset, caption: "Our Batna industrial complex" },
  { image: hallAsset, caption: "Turbine assembly hall" },
  { image: workshopAsset, caption: "Component repair workshop" },
  { image: weldingAsset, caption: "Certified welding operations" },
  { image: teamAsset, caption: "Teams across departments" },
  { image: life1, caption: "Collaboration on site" },
];

const stories = [
  {
    image: engineerAsset,
    name: "Mechanical Engineer",
    team: "Engineering & Technology",
    quote:
      "I joined for the turbines and stayed for the people. Here you own real technical problems from day one.",
  },
  {
    image: workerAsset,
    name: "Field Service Technician",
    team: "Services & Maintenance",
    quote:
      "Every outage is different. Seeing a plant come back online after our intervention never gets old.",
  },
  {
    image: teamAsset,
    name: "Quality Inspector",
    team: "Quality",
    quote:
      "Quality is everyone's responsibility — my job is to make sure nothing leaves Batna without earning it.",
  },
];

const related = [
  {
    image: life3,
    title: "How to apply",
    desc: "Learn more about our hiring process and get tips that guide you through the steps of the application.",
    to: "/careers/how-to-apply",
  },
  {
    image: life1,
    title: "FAQs & Support",
    desc: "Ready to start your future with us but still have questions? We've compiled answers from how to apply to your first months on board.",
    to: "/careers/faq",
  },
  {
    image: life2,
    title: "Careers",
    desc: "Discover the positions open today at GEAT and the paths available across engineering, manufacturing, quality and services.",
    to: "/careers/jobs",
  },
];

const LifeAtGeat = () => {
  const t = useT();
  const [slide, setSlide] = useState(0);
  const perView = 3;
  const maxSlide = Math.max(0, insideGeat.length - perView);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CareersSubNav />

      <main id="main">
        <PageHero
          breadcrumb={t("Life at GEAT")}
          breadcrumbTrail={[{ label: t("Careers"), href: "/careers" }]}
          title={t("Life at")}
          highlight={t("GEAT")}
          subtitle={t("Discover what it's like to build your career at the heart of Algeria's energy industry.")}
          image={lifeHero}
          imageAlt="GEAT teams gathered in front of the Batna manufacturing halls"
        />


        {/* OUR CULTURE */}
        <section className="section-y">
          <div className="section-container grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-20">
            <div>
              <h2 className="font-heading text-4xl font-bold leading-tight text-foreground lg:text-5xl">
                {t("Our culture")}
              </h2>
            </div>
            <div className="space-y-5 text-muted-foreground">
              <p>
                {t("At GEAT, every project, every innovation, and every person contributes to a stronger\n              energy future. We believe in a culture where expertise, collaboration, and continuous\n              learning empower our people to make a meaningful impact.")}
              </p>
              <p>
                {t("As Algeria continues to develop a reliable and sustainable energy system, GEAT plays an\n              important role in supporting the country's power generation needs. Through our expertise\n              in gas and steam turbines, maintenance, repair, and power generation services, we help\n              our customers maintain reliable and efficient energy infrastructure.")}
              </p>
              <p>
                {t("Our mission is to deliver high-quality technology, engineering expertise, and services\n              that contribute to the performance and sustainability of Algeria's energy sector.")}
              </p>
              <p className="font-medium text-foreground">
                {t("At GEAT, we are building more than technology. We are building expertise, developing\n              talent, and powering progress. Join GEAT and be part of the energy that moves Algeria\n              forward.")}
              </p>
            </div>
          </div>

          <div className="section-container mt-14">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={buildingAsset}
                alt="GEAT General Electric Algeria Turbines administration building in Batna"
                loading="lazy"
                decoding="async"
                width={1600}
                height={900}
                className="h-64 w-full object-cover sm:h-80 lg:h-[460px]"
              />
            </div>
          </div>
        </section>

        {/* THE GEAT WAY */}
        <section className="surface-dark section-y bg-geat-dark">
          <div className="section-container grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="reveal">
              <h2 className="font-heading text-3xl font-bold uppercase leading-tight text-primary lg:text-4xl">
                {t("The GEAT Way")}
              </h2>
            </div>
            <div className="reveal reveal-delay-1 space-y-5 text-muted-foreground">
              <p>
                {t("At GEAT, we are committed to empowering businesses with reliable and efficient power\n              equipment solutions that enhance productivity, promote sustainability, and contribute to\n              improving quality of life.")}
              </p>
              <p>
                {t("Our way of working is guided by a commitment to excellence, safety, innovation,\n              environmental responsibility, and customer satisfaction. We bring together expertise,\n              collaboration, and continuous learning to deliver products and services that meet high\n              standards of performance and reliability.")}
              </p>
              <p>
                {t("Through our people and our expertise, we strive to be a trusted partner in powering a\n              brighter future for all.")}
              </p>
            </div>
          </div>
        </section>


        {/* QUALITY COMMITMENT */}
        <section className="section-y">
          <div className="section-container">
            <div className="reveal section-head flex flex-wrap items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Star className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
                  {t("Our Commitment to Quality")}
                </h2>
                <p className="mt-2 text-muted-foreground">{t("Quality is everyone's responsibility.")}</p>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {quality.map((q, i) => (
                <article
                  key={q.title}
                  className={`reveal reveal-delay-${(i % 4) + 1} rounded-lg border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand-edge hover:shadow-lg`}
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <q.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-3 font-heading text-lg font-semibold text-foreground">{t(q.title)}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{t(q.desc)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PEOPLE BEHIND THE POWER */}
        <section className="section-y bg-secondary/50">
          <div className="section-container">
            <KickerLabel label="Hear from the GEAT team" className="reveal mb-3" />
            <h2 className="reveal mb-4 font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t("People Behind the Power")}
            </h2>
            <p className="reveal reveal-delay-1 section-head max-w-2xl text-muted-foreground">
              {t("More than a thousand talents across engineering, manufacturing, services and support\n            functions — each one essential to keeping Algeria's turbines running.")}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {people.map((p, i) => (
                <article
                  key={p.role}
                  className={`reveal reveal-delay-${(i % 4) + 1} group overflow-hidden rounded-lg border border-border bg-card`}
                >
                  <img
                    src={p.image}
                    alt={`${t(p.role)} at GEAT`}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={520}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">{t(p.role)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(p.desc)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* INNOVATION & EXPERTISE */}
        <section className="section-y">
          <div className="section-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="reveal overflow-hidden rounded-2xl">
              <img
                src={hallAsset}
                alt="GEAT engineer working on turbine equipment"
                loading="lazy"
                decoding="async"
                width={1200}
                height={900}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div>
              <KickerLabel label="Innovation & Expertise" className="reveal mb-3" />
              <h2 className="reveal font-heading text-3xl font-bold text-foreground lg:text-4xl">
                {t("Engineering for Tomorrow")}
              </h2>
              <p className="reveal reveal-delay-1 mt-5 text-muted-foreground">
                {t("From manufacturing and maintenance to repair and digital solutions, our teams apply\n              technical expertise and innovative thinking to address the evolving needs of the energy\n              sector.")}
              </p>
              <p className="reveal reveal-delay-2 mt-4 text-muted-foreground">
                {t("Working on world-class gas and steam turbine technology means our engineers and\n              technicians grow alongside the equipment they serve — with certifications, methods and\n              digital tools that keep them at the state of the art.")}
              </p>
            </div>
          </div>
        </section>

        {/* SAFETY */}
        <section className="surface-dark section-y relative overflow-hidden bg-geat-dark">
          <img
            src={weldingAsset}
            alt=""
            loading="lazy"
            decoding="async"
            width={1600}
            height={900}
            /* 10%, not 25%.
               This band has no scrim: the copy sits straight on `bg-geat-dark`
               with the welding photo composited over it, so the ground under
               a glyph is `opacity * photo + (1 - opacity) * #1D2735`. The
               welding shot has a blown-out turbine highlight that runs through
               the right-hand end of the first paragraph line, and at 25% that
               highlight lifted the ground to ~#555D63:
                 --muted-foreground  3.64:1 desktop / 3.92:1 mobile
                 the amber kicker    3.93:1 mobile
               both under 4.5:1. Orange is legal here — this is a dark ground —
               but the IMAGE, not the token, was defeating it.

               At 10% the same worst case (a pure-white pixel) composites to a
               ground of ~#33 3C 49, which gives --muted-foreground 6.0:1 and
               the amber kicker 4.9:1. Dimming the plate rather than stacking
               `.text-scrim` on top keeps the guarantee independent of which
               image loads AND keeps the band flat navy; .text-scrim ramps
               85% -> 100% top-to-bottom, which is right for a short caption
               panel (EngineersSection) and wrong for a full section band. */
            className="absolute inset-0 h-full w-full object-cover opacity-10"
          />
          <div className="section-container relative z-10 max-w-3xl">
            <KickerLabel label="Safety & Responsibility" className="reveal mb-3" />
            <h2 className="reveal font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t("Safety Comes First")}
            </h2>
            <p className="reveal reveal-delay-1 mt-5 text-lg font-medium text-foreground">
              {t("EHS is our shared Responsibility")}
            </p>
            <p className="reveal reveal-delay-2 mt-5 text-muted-foreground">
              {t("Safety and responsibility are fundamental to the way we work. We strive to maintain high\n            standards while protecting our people, our customers, our environment, and the communities\n            we serve.")}
            </p>
          </div>
        </section>

        {/* INSIDE GEAT CAROUSEL */}
        <section className="section-y">
          <div className="section-container">
            <div className="reveal section-head flex flex-wrap items-end justify-between gap-6">
              <div>
                <KickerLabel label="Inside GEAT" className="mb-3" />
                <h2 className="font-heading text-3xl font-bold text-foreground lg:text-4xl">
                  {t("A look inside our workplace")}
                </h2>
              </div>
              <div className="flex gap-3" role="group" aria-label={t("Inside GEAT gallery")}>
                <button
                  type="button"
                  aria-label={t("Previous images")}
                  onClick={() => setSlide((s) => Math.max(0, s - 1))}
                  disabled={slide === 0}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand-edge hover:text-accent disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={t("Next images")}
                  onClick={() => setSlide((s) => Math.min(maxSlide, s + 1))}
                  disabled={slide >= maxSlide}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-brand-edge hover:text-accent disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="overflow-hidden">
              <div
                className="flex gap-6 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(calc(-${slide} * (100% / ${perView} )))` }}
              >
                {insideGeat.map((item) => (
                  <figure
                    key={item.caption}
                    className="surface-dark relative w-[85%] shrink-0 overflow-hidden rounded-2xl sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                  >
                    <img
                      src={item.image}
                      alt={t(item.caption)}
                      loading="lazy"
                      decoding="async"
                      width={800}
                      height={720}
                      className="h-72 w-full object-cover"
                    />
                    {/* Decorative scrim only — the <figure> carries surface-dark
                        because the caption sits on top of it. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-geat-dark/90 via-transparent to-transparent" />
                    <figcaption className="absolute inset-x-0 bottom-0 p-5 font-heading text-sm font-semibold text-foreground">
                      {t(item.caption)}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MEET OUR PEOPLE */}
        <section className="section-y bg-secondary/50">
          <div className="section-container">
            <h2 className="reveal section-head font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t("Meet Our People")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {stories.map((s, i) => (
                <article
                  key={s.name}
                  className={`reveal reveal-delay-${i + 1} overflow-hidden rounded-lg border border-border bg-card`}
                >
                  <img
                    src={s.image}
                    alt={`${t(s.name)} at GEAT`}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={560}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-6">
                    <Quote className="mb-4 h-5 w-5 text-primary" />
                    <p className="text-sm italic leading-relaxed text-muted-foreground">"{t(s.quote)}"</p>
                    <p className="mt-5 font-heading text-sm font-semibold text-foreground">{t(s.name)}</p>
                    <p className="text-xs text-muted-foreground">{t(s.team)}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED CONTENT */}
        <section className="surface-dark section-y bg-geat-dark">
          <div className="section-container">
            <h2 className="reveal section-head font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t("Related content")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((item, i) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className={`reveal reveal-delay-${i + 1} group overflow-hidden rounded-2xl bg-card transition-transform hover:-translate-y-1`}
                >
                  <img
                    src={item.image}
                    alt={t(item.title)}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={520}
                    className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-primary">
                      {t(item.title)}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t(item.desc)}</p>
                    {/* Ink label + amber arrow — matches the light-ground CTA
                        shape. See the note on the twin block in CareersFaq. */}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                      {t("Learn more")} <ArrowRight className="h-4 w-4 text-primary" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CAREER OPPORTUNITIES CTA */}
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
      </main>

      <Footer />
      <GeniChat />
      <ApplicationStatusModal />
    </div>
  );
};

export default LifeAtGeat;
