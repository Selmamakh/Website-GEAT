import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useT } from "@/i18n/LanguageContext";
import KickerLabel from "@/components/KickerLabel";
import whoWeAreImg from "@/assets/who-we-are.jpg";

const WhoWeAre = () => {
  const t = useT();
  return (
    <section
      data-section="who-we-are"
      className="relative bg-background section-y"
    >
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content — left */}
          <div>
            <KickerLabel label="About GEAT" className="mb-4" />
            <h2 className="font-heading font-bold text-3xl lg:text-5xl text-foreground leading-tight mb-6">
              {t("Who we are")}
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-4 md:mb-6">
              {t("GEAT is a joint venture between Sonelgaz and GE, located in Aïn Yagout in the Batna province of Algeria.")}
            </p>
            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-8">
              {t("It was created to manufacture turbine modules and auxiliaries, assemble gas and steam turbines and control systems, develop digital solutions, and provide maintenance and repair services for electricity generation equipment.")}
            </p>
            <Link
              to="/about"
              className="group inline-flex min-h-11 items-center gap-2 text-foreground font-heading font-semibold text-sm uppercase tracking-wider transition-all hover:gap-3"
            >
              {t("Discover More")}
              <ArrowRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Image — right */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={whoWeAreImg}
              alt={t("GEAT team of engineers and technicians in turbine manufacturing facility")}
              className="w-full h-[280px] md:h-[420px] lg:h-[540px] object-cover"
              loading="lazy"
              decoding="async"
              width={1600}
              height={1064}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-geat-dark/25 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
