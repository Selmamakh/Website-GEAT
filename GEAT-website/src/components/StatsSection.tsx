import { useEffect, useRef, useState } from "react";
import { ArrowUpLeft } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

const stats = [
  { value: 2014, prefix: "", suffix: "", label: "Established" },
  { value: 200000, prefix: "", suffix: " m²", label: "Facility Area" },
  { value: 140, prefix: "", suffix: "+", label: "Jobs Created" },
];

const formatNumber = (num: number) => num.toLocaleString("en-US");

const useCountUp = (end: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    // Honour a reduced-motion preference: land on the final figure at once.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
};

const StatCard = ({
  stat,
  className = "",
  size = "sm",
}: {
  stat: typeof stats[0];
  className?: string;
  size?: "sm" | "lg";
}) => {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(stat.value, 1800, visible);

  return (
    <div
      ref={ref}
      className={`group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 lg:p-8 transition-transform duration-500 hover:-translate-y-1 ${className}`}
    >
      <p className="text-muted-foreground text-sm leading-snug max-w-[16rem]">
        {t(stat.label)}
      </p>
      <span
        className={`font-heading font-extrabold tracking-tight text-foreground mt-10 ${
          size === "lg" ? "text-5xl lg:text-7xl" : "text-4xl lg:text-5xl"
        }`}
      >
        {stat.prefix}<span className="tabular-nums">{formatNumber(count)}</span>{stat.suffix}
      </span>
    </div>
  );
};

const StatsSection = () => {
  const t = useT();
  return (
    <section className="surface-dark section-y bg-geat-dark">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="flex flex-col justify-between gap-5">
            <div>
              <h2 className="reveal font-heading font-extrabold text-3xl lg:text-4xl leading-tight tracking-tight text-foreground">
                {t("Numbers")}
                <br />
                <span className="text-primary">{t("speak.")}</span>
              </h2>
              <p className="reveal reveal-delay-1 text-muted-foreground mt-5 max-w-sm leading-relaxed">
                {t("A growing industrial footprint, strong local employment, and a commitment to Algeria's energy development.")}
              </p>
            </div>
            <StatCard stat={stats[2]} size="lg" className="min-h-[15rem]" />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <StatCard stat={stats[0]} className="min-h-[14rem]" />
              <StatCard stat={stats[1]} className="min-h-[14rem]" />
            </div>
            <div className="hidden lg:flex flex-1 items-end justify-end pr-2 pb-2">
              <ArrowUpLeft
                aria-hidden="true"
                className="w-20 h-20 text-muted-foreground/60"
                strokeWidth={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
