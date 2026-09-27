import { Link } from "react-router-dom";
import { ArrowRight, FileText, Search, Users, ClipboardCheck, Handshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import RecruitmentTimeline from "@/components/RecruitmentTimeline";
import careersHero from "@/assets/careers-hero-bg.jpg";
import { useT } from "@/i18n/LanguageContext";

const steps = [
  {
    icon: Search,
    title: "1. Find your position",
    desc: "Browse our open jobs, filter by wilaya, department or experience level and read the full job description before applying.",
  },
  {
    icon: FileText,
    title: "2. Apply online",
    desc: "Complete the online form and upload your CV in PDF or Word format (max 5 MB). Your reference number is shown immediately after you submit.",
  },
  {
    icon: ClipboardCheck,
    title: "3. HR review",
    desc: "Our recruiters review your file with the hiring manager. This step usually takes up to three weeks for technical positions.",
  },
  {
    icon: Users,
    title: "4. Interviews",
    desc: "Participate in interviews with the relevant department and HR to discuss your experience, skills, motivation, and suitability for the position.",
  },
  {
    icon: Handshake,
    title: "5. Onboarding",
    desc: "Complete the necessary administrative steps and begin your onboarding journey with GEAT.",
  },
];

const tips = [
  "Organize your CV clearly: Highlight your education, professional experience, certifications, and relevant achievements.",
  "Mention your key skills: Include the technical and professional skills that match the position you are applying for.",
  "Describe your previous experience: Mention the tasks and responsibilities you handled in previous roles, internships, or projects.",
  "Highlight the systems and tools you master: Specify the software, technical systems, equipment, or platforms you are comfortable using.",
  "Match your profile to the position: Focus on the experience and skills that are most relevant to the job requirements.",
  "Keep your information accurate and up to date: Make sure your contact details, experience, and qualifications are clearly presented.",
];

const HowToApply = () => {
  const t = useT();
  return (
  <div className="min-h-screen bg-background">
    <Navbar />
    <CareersSubNav />

    <main id="main">
    <PageHero
      breadcrumb={t("How to apply")}
      breadcrumbTrail={[{ label: t("Careers"), href: "/careers" }]}
      title={t("How to apply at GEAT")}
      subtitle={t("A clear, five-step recruitment process — from your application to your first day in Batna.")}
      image={careersHero}
      imageAlt="GEAT recruitment team reviewing applications"
      primaryCta={{ label: t("View Open Positions"), href: "/careers/jobs" }}
      secondaryCta={{ label: t("Submit Your CV"), href: "/careers/submit-cv" }}
    />

    <section className="section-y">
      <div className="section-container">
        <div className="section-head text-center">
          <div className="reveal mx-auto mb-5 h-1 w-12 bg-primary" />
          <h2 className="reveal font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {t("Our recruitment process")}
          </h2>
        </div>
        <RecruitmentTimeline steps={steps} />
      </div>
    </section>

    <section className="bg-secondary/50 section-y-lg">
      <div className="section-container grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">{t("Tips for your application")}</h2>
          <ul className="mt-7 space-y-4">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{t(tip)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-fit rounded-2xl border border-border bg-card p-7">
          <h3 className="font-heading text-xl font-semibold text-foreground">{t("Ready to start?")}</h3>
          <p className="mt-3 text-sm text-muted-foreground">
            {t("Explore the positions open today, or send us a spontaneous application if none matches\n            your profile yet.")}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/careers/jobs" className="btn-cta justify-center">
              {t("All Jobs")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/careers/faq" className="btn-cta btn-cta-outline justify-center">
              {t("FAQs & support")}
            </Link>
          </div>
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

export default HowToApply;
