/**
 * Shared shell for the three legal pages (Privacy Notice, Terms of Use,
 * Cookie Policy).
 *
 * These pages are STATEMENTS OF FACT about how this website behaves, and
 * every factual claim in them was verified against the code:
 *   - the site sets no cookies and loads no analytics or advertising script;
 *   - the only browser storage is three non-personal preference keys;
 *   - application data goes straight to the GEAT HRIS and is never retained
 *     by the website itself.
 *
 * Anything that depends on GEAT's own policy rather than on this codebase —
 * retention periods, the data controller's legal identity, the DPO contact —
 * is marked with <Placeholder> so it renders visibly and cannot be mistaken
 * for approved wording. Those must be completed and signed off by GEAT before
 * launch; see handover.md. Writing plausible-looking legal text there would
 * have been worse than leaving the gap obvious.
 */

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import contactHero from "@/assets/contact-hero.jpg";
import { useT } from "@/i18n/LanguageContext";

/** Date the wording below was last reviewed. Update when the text changes. */
export const LEGAL_LAST_UPDATED = "2026-09-19";

/** A value only GEAT can supply. Rendered conspicuously so it cannot ship unnoticed. */
export const Placeholder = ({ children }: { children: React.ReactNode }) => (
  <mark className="rounded bg-destructive/10 px-1.5 py-0.5 font-medium text-destructive">
    [{children}]
  </mark>
);

export const LegalSection = ({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) => {
  const t = useT();
  return (
    <section className="mb-10">
      <h2 className="mb-3 font-heading text-xl font-bold text-foreground lg:text-2xl">
        {t(heading)}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
        {children}
      </div>
    </section>
  );
};

const LegalPage = ({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) => {
  const t = useT();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main">
        <PageHero
          title={title}
          image={contactHero}
          imageAlt={t("GEAT headquarters")}
          breadcrumb={t(title)}
          subtitle={intro}
        />
        <div className="section-y">
          <div className="section-container">
            <div className="mx-auto max-w-3xl">
              <p className="mb-10 text-xs text-muted-foreground">
                {t("Last updated")}: {LEGAL_LAST_UPDATED}
              </p>
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalPage;
