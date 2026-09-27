import { Link } from "react-router-dom";
import LegalPage, { LegalSection, Placeholder } from "./LegalPage";
import { useT } from "@/i18n/LanguageContext";

const Privacy = () => {
  const t = useT();
  return (
    <LegalPage
      title="Privacy Notice"
      intro="How GEAT collects and uses personal data through this website."
    >
      <LegalSection heading="Who we are">
        <p>
          {t("This website is operated by GEAT — General Electric Algeria Turbines. The data controller responsible for the personal data described below is")}{" "}
          <Placeholder>{t("GEAT legal entity name, registered address and company number")}</Placeholder>.
        </p>
        <p>
          {t("For any question about this notice or about your personal data, contact us at")}{" "}
          <a href="mailto:contact@geat.dz" className="link-inline text-accent">contact@geat.dz</a>
          {t(", or write to our data protection contact at")}{" "}
          <Placeholder>{t("data protection contact email")}</Placeholder>.
        </p>
      </LegalSection>

      <LegalSection heading="What we collect, and when">
        <p>{t("This website collects personal data in three situations, and in no others.")}</p>
        <p>
          <strong className="text-foreground">{t("1. When you apply for a job.")}</strong>{" "}
          {t("The application forms collect your first and last name, email address, telephone number, location, LinkedIn profile URL if you provide one, your cover letter, your CV file, your preferred language, and your answers to any questions attached to the position. Spontaneous applications also collect the profession and area of interest you select.")}
        </p>
        <p>
          <strong className="text-foreground">{t("2. When you check an application's status.")}</strong>{" "}
          {t("The status lookup requires your application reference number and the email address you applied with. Both are used only to find your application and are not stored by this website.")}
        </p>
        <p>
          <strong className="text-foreground">{t("3. When you contact us or subscribe.")}</strong>{" "}
          {t("The contact form collects your name, email address, subject, country, message, and whether you agree to receive communications from us. The newsletter form collects your email address and your language preference.")}
        </p>
        <p>
          {t("We do not collect any other personal data through this website. There is no user account, no login, and no profiling or automated decision-making performed by the website itself.")}
        </p>
      </LegalSection>

      <LegalSection heading="What we do with it">
        <p>
          {t("Application data is transmitted to GEAT's recruitment system, where it is reviewed by GEAT recruiters and hiring managers for the purpose of assessing your candidacy. Contact form messages are used to answer your enquiry. Newsletter subscriptions are used to send you the updates you asked for, and nothing else.")}
        </p>
        <p>
          {t("We do not sell personal data, and we do not share it with third parties for their own marketing purposes.")}
        </p>
        <p>
          {t("The lawful bases we rely on are")}{" "}
          <Placeholder>{t("lawful bases to be confirmed by GEAT legal — typically consent for the newsletter, and steps taken at your request prior to entering a contract for applications")}</Placeholder>.
        </p>
      </LegalSection>

      <LegalSection heading="How long we keep it">
        <p>
          {t("Applications and CVs are retained by GEAT's recruitment system for")}{" "}
          <Placeholder>{t("retention period to be confirmed with the recruitment system owner")}</Placeholder>.{" "}
          {t("Newsletter subscriptions are kept until you unsubscribe.")}
        </p>
      </LegalSection>

      <LegalSection heading="What this website stores on your device">
        <p>
          {t("This website sets no cookies and uses no analytics, advertising or tracking technology. It stores three small preferences in your browser, none of which identify you:")}
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{t("your chosen language, so the site opens in it next time;")}</li>
          <li>{t("whether you have accepted the careers assistant's terms during this browsing session;")}</li>
          <li>{t("whether you have already seen the careers assistant's introductory message.")}</li>
        </ul>
        <p>
          {t("These stay on your device, are never transmitted to us, and are cleared when you clear your browser data. See our")}{" "}
          <Link to="/cookies" className="link-inline text-accent">{t("Cookie Policy")}</Link>{" "}
          {t("for details.")}
        </p>
      </LegalSection>

      <LegalSection heading="Third parties">
        <p>
          {t("Two third parties are involved when you use this website:")}
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            {t("GEAT's recruitment system, which receives and stores applications and answers status lookups. It is operated on GEAT's behalf by")}{" "}
            <Placeholder>{t("recruitment system provider to be confirmed")}</Placeholder>.
          </li>
          <li>
            {t("Google Fonts, which serves the site's typefaces. Your browser requests these files directly from Google, which necessarily discloses your IP address and browser information to Google.")}
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="Your rights">
        <p>
          {t("Subject to applicable law, you may request access to the personal data we hold about you, ask us to correct it, ask us to delete it, object to or restrict how we use it, and withdraw any consent you have given. Withdrawing consent does not affect processing carried out before you withdrew it.")}
        </p>
        <p>
          {t("To exercise any of these rights, email")}{" "}
          <a href="mailto:contact@geat.dz" className="link-inline text-accent">contact@geat.dz</a>.{" "}
          {t("You also have the right to lodge a complaint with the competent supervisory authority,")}{" "}
          <Placeholder>{t("supervisory authority to be named by GEAT legal")}</Placeholder>.
        </p>
      </LegalSection>

      <LegalSection heading="Changes to this notice">
        <p>
          {t("We may update this notice. The date at the top of this page shows when it was last reviewed.")}
        </p>
      </LegalSection>
    </LegalPage>
  );
};

export default Privacy;
