import { Link } from "react-router-dom";
import LegalPage, { LegalSection } from "./LegalPage";
import { useT } from "@/i18n/LanguageContext";

/**
 * Every claim on this page was verified against the code: there is no
 * document.cookie write anywhere in src/, no analytics or tag manager, and
 * exactly three browser-storage keys — geat-lang (localStorage),
 * geni-accepted and geni-teaser-seen (sessionStorage).
 *
 * If analytics are ever added, this page and the Privacy Notice must change,
 * and a consent banner becomes necessary. There is none today because none is
 * needed today.
 */
const Cookies = () => {
  const t = useT();
  return (
    <LegalPage
      title="Cookie Policy"
      intro="What this website stores in your browser — and what it does not."
    >
      <LegalSection heading="This website does not use cookies">
        <p>
          {t("GEAT's website sets no cookies. It contains no analytics, no advertising pixels, no tag manager and no third-party tracking scripts. Nothing on this site follows you across other websites, and we do not build a profile of your visit.")}
        </p>
        <p>
          {t("Because no cookies are set and no tracking takes place, this site does not show a cookie consent banner. None is required.")}
        </p>
      </LegalSection>

      <LegalSection heading="Preferences stored on your device">
        <p>
          {t("The site does use your browser's local storage for three small preferences. These are not cookies: they are never sent to our servers, and they are not shared with anyone. None of them identifies you.")}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-heading font-semibold text-foreground">{t("Name")}</th>
                <th className="py-2 pr-4 font-heading font-semibold text-foreground">{t("Purpose")}</th>
                <th className="py-2 font-heading font-semibold text-foreground">{t("Lifetime")}</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border">
                <td className="py-2.5 pr-4 font-mono text-xs">geat-lang</td>
                <td className="py-2.5 pr-4">{t("Remembers whether you chose English or French.")}</td>
                <td className="py-2.5">{t("Until you clear your browser data")}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2.5 pr-4 font-mono text-xs">geni-accepted</td>
                <td className="py-2.5 pr-4">{t("Remembers that you accepted the careers assistant's terms, so it does not ask again.")}</td>
                <td className="py-2.5">{t("Until you close the tab")}</td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-mono text-xs">geni-teaser-seen</td>
                <td className="py-2.5 pr-4">{t("Remembers that you have already seen the careers assistant's introductory message.")}</td>
                <td className="py-2.5">{t("Until you close the tab")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection heading="How to remove them">
        <p>
          {t("Clearing your browser's site data for this domain removes all three immediately. The site continues to work normally afterwards — it will simply open in English and introduce the careers assistant again.")}
        </p>
      </LegalSection>

      <LegalSection heading="Fonts served by Google">
        <p>
          {t("The site's typefaces are loaded from Google Fonts. Google does not set a cookie for this, but your browser does contact Google's servers, which discloses your IP address and browser information to Google. This is described in our")}{" "}
          <Link to="/privacy" className="link-inline text-accent">{t("Privacy Notice")}</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
};

export default Cookies;
