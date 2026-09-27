import { Heart, Eye, Target, TrendingUp } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import teamImg from "@/assets/geat-team.jpeg";

const values = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "We believe in honest communication and clear accountability, building trust through openness with partners and employees.",
  },
  {
    icon: TrendingUp,
    title: "Efficiency",
    description:
      "Our solutions are designed to maximize productivity, minimizing waste and delivering results quickly and effectively.",
  },
  {
    icon: Heart,
    title: "Humility",
    description:
      "We approach every challenge with openness, respect for others and a willingness to learn and keep improving.",
  },
  {
    icon: Target,
    title: "Focus",
    description:
      "We commit to excellence in execution, staying disciplined in our goals and delivering measurable results.",
  },
];

/* Semantic tokens only: `geat-blue` is a fixed brand value that would not
   retarget if this block ever moved onto a `surface-dark` ground. `accent`
   resolves to the same blue on light and to the legible-on-navy blue inside
   surface-dark. */
const tints = [
  "bg-primary/10 text-primary",
  "bg-accent/15 text-accent",
  "bg-accent/15 text-accent",
  "bg-primary/10 text-primary",
];

const OurValues = () => {
  const t = useT();
  return (
    <section className="section-y bg-background">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image */}
          <div className="reveal overflow-hidden rounded-2xl">
            <img
              src={teamImg}
              alt={t("GEAT team at work")}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover aspect-[4/3]"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="reveal font-heading font-bold text-3xl lg:text-[2.5rem] leading-tight text-foreground mb-4">
              {t("The Values that Drive")}
              <br />
              {t("Everything We Do")}
            </h2>
            <p className="reveal reveal-delay-1 section-head text-muted-foreground text-sm leading-relaxed max-w-md">
              {t("We love what we do and take pride in our work, while staying deeply committed to powering Algeria's energy future.")}
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-9">
              {values.map((value, i) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    style={{ transitionDelay: `${i * 120}ms` }}
                    className="reveal"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${tints[i]}`}>
                      <Icon className="w-4 h-4" strokeWidth={2} />
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground mb-2">
                      {t(value.title)}
                    </h3>
                    <p className="text-muted-foreground text-[13px] leading-relaxed">
                      {t(value.description)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
