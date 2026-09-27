import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { careerFields } from "@/data/careers";
import turbineBand from "@/assets/turbine-band.png";
import { useT } from "@/i18n/LanguageContext";


export const PurposeMission = () => {
  const t = useT();
  return (
  /* pb-0: the section closes on a full-bleed image band, so it owns no
     bottom padding of its own. */
  <section className="section-y pb-0">
    <div className="section-container grid gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
      <h2 className="font-heading text-3xl font-bold leading-tight text-foreground lg:text-4xl">
        {t("Your purpose.")}
        <br />
        {t("Our mission.")}
      </h2>
      <div className="space-y-5 text-muted-foreground">
        <p>
          {t("GEAT is helping power Algeria's growth. Are you thinking about what impact you will leave behind?")}
        </p>
        <p>
          {t("Our engineers, technicians and specialists operate at the core of the energy sector — designing, manufacturing and maintaining the technologies that support the national grid and the industries that depend on it, with impact reaching power infrastructure across the country.")}
        </p>
        <p>
          {t("We are a team united by a shared purpose and driven by engineering excellence. Together, we are shaping the future of energy in Algeria, creating innovative solutions, building lasting impact, and powering Algeria forward.")}
        </p>
      </div>
    </div>

    {/* Full-width turbine band */}
    <div className="mt-14 w-full overflow-hidden lg:mt-20">
      <img
        src={turbineBand}
        alt="Cutaway rendering of a GEAT gas turbine over a digital energy grid background"
        loading="lazy"
        decoding="async"
        width={1920}
        height={420}
        className="h-[220px] w-full object-cover object-center sm:h-[300px] lg:h-[420px]"
      />
    </div>
  </section>
  );
};



export const FindYourPath = () => {
  const t = useT();
  return (
  <section className="bg-background section-y">
    <div className="section-container">
      <h2 className="reveal section-head font-heading text-3xl font-semibold leading-tight text-foreground lg:text-4xl">
        {t("Find your path")}
      </h2>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        {careerFields.map((field, i) => (
          <Link
            key={field.title}
            to={`/careers/fields/${field.slug}`}
            className={`reveal reveal-delay-${(i % 4) + 1} group block border border-border bg-card px-5 py-5 transition-all duration-300 hover:border-brand-edge hover:shadow-md`}
          >
            <h3 className="inline-block border-b border-primary pb-1 font-heading text-[13px] font-bold leading-snug text-foreground">
              {t(field.title)}
            </h3>
            <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground">{t(field.desc)}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-foreground">
              {t("Explore")}
              <ArrowRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>

      <div className="reveal mt-10">
        <Link
          to="/careers/jobs"
          className="group inline-flex items-center gap-2 rounded-full border-2 border-brand-edge px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
        >
          {t("Search All Opportunities")} <ArrowRight className="h-4 w-4 text-primary transition-colors group-hover:text-brand-foreground" />
        </Link>
      </div>

    </div>
  </section>
  );
};
