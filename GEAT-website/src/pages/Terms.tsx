import { Link } from "react-router-dom";
import LegalPage, { LegalSection, Placeholder } from "./LegalPage";
import { useT } from "@/i18n/LanguageContext";

const Terms = () => {
  const t = useT();
  return (
    <LegalPage
      title="Terms of Use"
      intro="The terms on which GEAT makes this website available to you."
    >
      <LegalSection heading="Acceptance">
        <p>
          {t("By using this website you agree to these terms. If you do not agree with them, please do not use the site.")}
        </p>
      </LegalSection>

      <LegalSection heading="What this website is for">
        <p>
          {t("This site provides information about GEAT — General Electric Algeria Turbines, its products and services, its news, and its current job openings. It also allows you to apply for a position and to check the progress of an application you have already submitted.")}
        </p>
      </LegalSection>

      <LegalSection heading="Job listings and applications">
        <p>
          {t("Job openings shown on this site are published from GEAT's recruitment system and may change or be withdrawn at any time without notice. Publication of a position is not an offer of employment, and submitting an application does not create any obligation on GEAT to interview you or to make an offer.")}
        </p>
        <p>
          {t("You confirm that the information you submit in an application is accurate and is your own. Applications are only accepted through the forms on this website; we cannot process applications sent by other means.")}
        </p>
        <p>
          {t("When you apply, you receive a reference number. Keep it — together with the email address you applied with, it is the only way to check your application's status on this site.")}
        </p>
      </LegalSection>

      <LegalSection heading="The careers assistant">
        <p>
          {t("The careers assistant on this site answers common recruitment questions from a fixed set of prepared responses, and lists job openings drawn from our recruitment system. It does not give personalised advice, it does not assess your candidacy, and it cannot submit an application on your behalf.")}
        </p>
        <p>
          {t("Anything you type into the assistant stays in your browser: it is not transmitted to GEAT, not stored, and not seen by our recruiters. Please do not use it to send us personal information — use the application form or the contact form instead.")}
        </p>
      </LegalSection>

      <LegalSection heading="Accuracy of content">
        <p>
          {t("We take care to keep this site accurate and up to date, but we provide its content for general information and give no warranty that it is complete, current or error-free. Technical specifications, figures and descriptions of products and services are indicative and do not form part of any contract.")}
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>{t("You agree not to:")}</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>{t("use the site in a way that disrupts it or interferes with anyone else's use of it;")}</li>
          <li>{t("attempt to gain unauthorised access to the site or to any system connected to it;")}</li>
          <li>{t("submit false information, impersonate another person, or upload a file containing malicious code;")}</li>
          <li>{t("extract content or job data automatically at scale without our written permission.")}</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Intellectual property">
        <p>
          {t("The content of this website, including its text, images, diagrams and design, belongs to GEAT or its licensors and is protected by applicable intellectual property law. You may view and print pages for your own personal or internal business use; any other reproduction or distribution requires our prior written consent.")}
        </p>
        <p>
          {t("GEAT, Sonelgaz and GE Vernova names and logos are the trade marks of their respective owners.")}
        </p>
      </LegalSection>

      <LegalSection heading="External links">
        <p>
          {t("Some pages link to websites operated by others, including recruitment partners. We do not control those sites and are not responsible for their content or their privacy practices.")}
        </p>
      </LegalSection>

      <LegalSection heading="Availability and liability">
        <p>
          {t("We do not guarantee that this website will be available without interruption. Parts of it — in particular the job board and the application forms — depend on our recruitment system and may be temporarily unavailable.")}
        </p>
        <p>
          {t("To the fullest extent permitted by law, our liability arising from your use of this website is limited as set out in")}{" "}
          <Placeholder>{t("limitation of liability wording to be confirmed by GEAT legal")}</Placeholder>.
        </p>
      </LegalSection>

      <LegalSection heading="Privacy">
        <p>
          {t("Our")}{" "}
          <Link to="/privacy" className="link-inline text-accent">{t("Privacy Notice")}</Link>{" "}
          {t("explains what personal data we collect through this site and how we use it. Our")}{" "}
          <Link to="/cookies" className="link-inline text-accent">{t("Cookie Policy")}</Link>{" "}
          {t("explains what is stored in your browser.")}
        </p>
      </LegalSection>

      <LegalSection heading="Governing law">
        <p>
          {t("These terms are governed by")}{" "}
          <Placeholder>{t("governing law and competent courts to be confirmed by GEAT legal")}</Placeholder>.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          {t("Questions about these terms can be sent to")}{" "}
          <a href="mailto:contact@geat.dz" className="link-inline text-accent">contact@geat.dz</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
};

export default Terms;
