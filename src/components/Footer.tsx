import { Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import geatLogo from "@/assets/geat-logo.png";
import { useT } from "@/i18n/LanguageContext";
import { FOOTER_WIDGET_LANE, hasChatLauncher } from "./floatingWidgetLane";

const footerLinks = {
  "About GEAT": [
    { label: "About us", to: "/about" },
    { label: "Leadership", to: "/leadership" },
    { label: "Newsroom", to: "/news" },
  ],
  Company: [
    { label: "Products", to: "/products-services" },
    { label: "Technologies & Solutions", to: "/products-services" },
    { label: "Services", to: "/products-services" },
  ],
  Careers: [
    { label: "Job & Careers", to: "/careers" },
    { label: "Open Jobs", to: "/careers/jobs" },
    { label: "Spontaneous Application", to: "/careers/submit-cv" },
  ],
};


const Footer = () => {
  const t = useT();
  const { pathname } = useLocation();

  /* The footer is the last thing in the document, so at full scroll it is what
     the fixed floating widgets land on — measured at 390px, the amber
     ScrollToTop FAB was sitting on top of the right-hand end of the legal row
     below and hiding half of "Preferences" on every route, and on /careers/*
     the Geni launcher does the same from lower down. A fixed element cannot be
     pushed by the content it covers, so the document reserves the lane
     instead. Sizes and the arithmetic behind them: floatingWidgetLane.ts. */
  const widgetLane = hasChatLauncher(pathname)
    ? FOOTER_WIDGET_LANE.careers
    : FOOTER_WIDGET_LANE.default;

  return (
    <footer className={`surface-dark relative bg-geat-dark text-foreground ${widgetLane}`}>
      {/* Main footer */}
      <div className="section-container section-y-sm">


        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12 mb-10 sm:mb-14">
          {/* Brand */}
          <div className="md:col-span-3">
            <img
              src={geatLogo}
              alt="GEAT — General Electric Algeria Turbines"
              width={505}
              height={337}
              loading="lazy"
              decoding="async"
              className="h-16 w-auto brightness-0 invert mb-4 sm:h-20"
            />

            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3 font-semibold">
              {t("Follow Us")}
            </p>
            {/* -m-1 + px-1 keep the 36px marks exactly where they were while the
                anchors themselves grow to a 44x44 pointer target. */}
            <div className="flex items-center -m-1">
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="tap-target group px-1"
              >
                <span className="h-9 w-9 rounded-md border border-border group-hover:border-brand group-hover:bg-brand transition-all flex items-center justify-center group-hover:text-brand-foreground">
                  <Linkedin className="h-4 w-4 text-foreground" />
                </span>
              </a>
              <a
                href="https://emploitic.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Emploitic"
                className="tap-target group px-1"
              >
                <span className="h-9 px-4 rounded-md border border-border group-hover:border-brand group-hover:bg-brand transition-all flex items-center justify-center text-xs font-semibold text-foreground group-hover:text-brand-foreground">
                  Emploitic
                </span>
              </a>
            </div>
          </div>

          {/* Links */}
          <nav
            aria-label={t("Footer")}
            className="md:col-span-5 grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-8"
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h2 className="font-heading font-bold text-[13px] uppercase tracking-wider mb-4 sm:mb-5 text-foreground">
                  {t(category)}
                </h2>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                      >
                        <span className="w-0 group-hover:w-3 h-px bg-primary mr-0 group-hover:mr-2 transition-all" />
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Contact */}
          <div className="md:col-span-4 border-t border-border pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-8">
            <h2 className="font-heading font-bold text-[13px] uppercase tracking-wider mb-4 sm:mb-5 text-foreground">
              {t("Get in Touch")}
            </h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{t("Phone")}</p>
                  <a href="tel:+213033278111" className="text-sm text-foreground hover:text-primary transition-colors">
                    +213 (0) 33 27 81 11
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{t("Email")}</p>
                  <a href="mailto:contact@geat.dz" className="text-sm text-foreground hover:text-primary transition-colors break-all">
                    contact@geat.dz
                  </a>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-0.5">{t("Address")}</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    Zone Industrielle, Lot n°60<br />
                    Section « C » Aïn Yagout,<br />
                    Batna, Algérie
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GEAT — General Electric Algeria Turbines. {t("All rights reserved.")}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {/* All three used to point at /contact because the pages did not
                exist. "Preferences" is gone rather than relocated: the site
                sets no cookies and runs no trackers, so there is nothing for a
                preference centre to configure. The Cookie Policy says so. */}
            <Link to="/cookies" className="hover:text-primary transition-colors">{t("Cookies")}</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">{t("Terms")}</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">{t("Privacy Notice")}</Link>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
