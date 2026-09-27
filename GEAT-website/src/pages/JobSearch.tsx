import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import OpenJobsBoard from "@/components/OpenJobsBoard";
import { useJobsQuery } from "@/hooks/useJobs";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/i18n/LanguageContext";

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);

const JobAlertCard = () => {
  const t = useT();
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("Weekly");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    setError("");
    setEmail("");
    toast({
      title: t("Job alert created"),
      description: `${t("You will receive ")}${t(frequency)}${t(" updates for your current search filters.")}`,
    });
  };

  return (
    <div className="rounded-[8px] border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <Bell className="h-6 w-6 text-primary" />
        <h3 className="font-heading text-xl font-bold text-foreground">{t("Create Job Alert")}</h3>
      </div>
      <form onSubmit={submit} className="grid gap-5 px-6 py-6 md:grid-cols-[1fr_auto_auto] md:items-end">
        <div>
          <label htmlFor="alert-email" className="mb-2 block text-sm font-semibold text-foreground">
            {t("Email Address")}
          </label>
          <input
            id="alert-email"
            type="email"
            value={email}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Enter mail")}
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:border-brand-edge"
          />
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>
        <div>
          <label htmlFor="alert-frequency" className="mb-2 block text-sm font-semibold text-foreground">
            {t("Frequency")}
          </label>
          <select
            id="alert-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="h-12 rounded-md border border-input bg-background px-3 text-sm focus-visible:border-brand-edge"
          >
            {["Daily", "Weekly", "Monthly"].map((f) => (
              <option key={f}>{t(f)}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-cta h-12 justify-center">
          {t("Create Job Alert")}
        </button>
      </form>
    </div>
  );
};

const JobSearch = () => {
  const t = useT();
  // One-row page: only `total` is needed for the count line, not the rows.
  const { data: countData } = useJobsQuery({ page: 1, pageSize: 1 });
  const total = countData?.total;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CareersSubNav />

      <main id="main">
      <section className="surface-dark bg-geat-dark section-y-sm">
        <div className="section-container">
          <Breadcrumb
            current={t("Open jobs")}
            trail={[{ label: t("Careers"), href: "/careers" }]}
            className="mb-0"
          />
          <h1 className="mt-5 font-heading text-3xl font-bold text-foreground lg:text-4xl">
            {t("Open jobs")}
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            {total === undefined
              ? t("Search and filter all open positions at General Electric Algeria Turbines.")
              : t("Search and filter all {count} open positions at General Electric Algeria Turbines.").replace(
                  "{count}",
                  String(total),
                )}
          </p>
        </div>
      </section>

      <section className="bg-muted/40 section-y-lg">
        {/* The floating chat launcher sits bottom-right. The board is inset
            slightly so the results header's "Sort by" control never sits flush
            against the container edge underneath it. */}
        <div className="section-container">
          <div className="lg:px-4">
            <OpenJobsBoard perPageDefault={10} />
          </div>

          <div className="mt-12">
            <JobAlertCard />
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            {t("Can't find the right role?")}{" "}
            <Link to="/careers/submit-cv" className="link-inline font-bold text-accent">
              {t("Submit a spontaneous application")}
            </Link>
          </p>
        </div>
      </section>
      </main>

      <Footer />
      <GeniChat />
      <ApplicationStatusModal />
    </div>
  );
};

export default JobSearch;
