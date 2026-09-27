import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Newsletter from "@/components/Newsletter";
import FormField, {
  FieldError,
  FormErrorSummary,
  FormRequiredLegend,
  REQUIRED_MARK_CLASS,
  type FormErrorItem,
} from "@/components/FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import contactHero from "@/assets/contact-hero.jpg";
import { submitContactRequest } from "@/api/forms";
import { apiErrorMessage, apiFieldErrors } from "@/lib/apiErrors";
import { useLanguage, useT } from "@/i18n/LanguageContext";

const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  jobTitle: z.string().trim().min(1, "Subject is required").max(100),
  country: z.string().min(1, "Please select a country"),
  details: z.string().trim().min(10, "Please provide more details").max(1000),
  communications: z.enum(["yes", "no"], {
    errorMap: () => ({ message: "Please select a communication preference" }),
  }),
});

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  country: "",
  details: "",
  communications: "" as "yes" | "no" | "",
};

type ContactForm = typeof emptyForm;

/** Visual order of the fields, and the control each summary entry focuses. */
const FIELD_ORDER: { key: keyof ContactForm; anchor: string }[] = [
  { key: "firstName", anchor: "firstName" },
  { key: "lastName", anchor: "lastName" },
  { key: "email", anchor: "email" },
  { key: "country", anchor: "country" },
  { key: "jobTitle", anchor: "jobTitle" },
  { key: "details", anchor: "details" },
  { key: "communications", anchor: "comm-yes" },
];

const countries = [
  "Algeria",
  "France",
  "Germany",
  "Italy",
  "Morocco",
  "Spain",
  "Tunisia",
  "Türkiye",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Other",
];

/**
 * A 16px radio mark with a 44x44 hit area.
 *
 * The mark itself must stay 16px: the coarse-pointer floor in index.css gives
 * every <button> `min-height: var(--tap)`, and a Radix radio is a <button>, so
 * without `min-h-4` the circle rendered 16 wide by 44 tall. Capping it left the
 * target at 16x16 — the only control on the site short in both dimensions. The
 * missing 28px therefore comes from a transparent pseudo-element, which a
 * <button> does render (an <input> would not), so the hit box grows and the
 * mark does not move.
 */
const RADIO_TAP_CLASS =
  "relative mt-1 min-h-4 shrink-0 before:absolute before:-inset-3.5 before:content-['']";

const Contact = () => {
  const t = useT();
  const { lang } = useLanguage();
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitCount, setSubmitCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  /* One source of truth: contactSchema validates a single field by parsing the
     whole form and keeping only that field's issue. */
  const fieldError = (key: keyof ContactForm, values: ContactForm) => {
    const result = contactSchema.safeParse(values);
    if (result.success) return "";
    const issue = result.error.issues.find((i) => i.path[0] === key);
    return issue ? issue.message : "";
  };

  /** Free-text fields: revalidate only once the field has been blurred. */
  const update = (key: keyof ContactForm, value: string) => {
    const next = { ...form, [key]: value } as ContactForm;
    setForm(next);
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: fieldError(key, next) }));
  };

  /** Selects and radios: a change is a deliberate choice, so validate at once. */
  const commit = (key: keyof ContactForm, value: string) => {
    const next = { ...form, [key]: value } as ContactForm;
    setForm(next);
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, next) }));
  };

  const blur = (key: keyof ContactForm) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, form) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f.key, true])));
      setSubmitCount((c) => c + 1);
      toast({
        title: t("Please review the form"),
        description: t(result.error.errors[0]?.message ?? "Some fields are invalid."),
        variant: "destructive",
      });
      return;
    }
    setErrors({});
    setSubmitting(true);

    /* The success toast is only shown once the receiving system has actually
       accepted the message. This used to be a 700ms setTimeout that claimed
       "Request received" while sending nothing, so anyone who wrote in was
       silently ignored and had no way to know. */
    try {
      /* Fields are listed explicitly rather than spread from result.data:
         with strictNullChecks off, zod's inferred output types every property
         as optional, which does not satisfy ContactRequest. */
      await submitContactRequest({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        jobTitle: form.jobTitle.trim(),
        country: form.country,
        details: form.details.trim(),
        communications: form.communications as "yes" | "no",
        preferredLanguage: lang === "fr" ? "FR" : "EN",
      });
      toast({
        title: t("Request received"),
        description: t("Thank you for contacting GEAT. Our team will reach out shortly."),
      });
      setForm(emptyForm);
      setTouched({});
      setSubmitCount(0);
    } catch (error) {
      /* The server is the authority on validation: whatever fields it names
         are shown even though the local schema was satisfied. */
      const fields = apiFieldErrors(error);
      if (Object.keys(fields).length > 0) {
        setErrors(fields);
        setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f.key, true])));
        setSubmitCount((c) => c + 1);
      }
      const { title, description } = apiErrorMessage(error);
      toast({ title: t(title), description: t(description), variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  /* Submitting with errors moves focus to the summary instead of leaving the
     user to hunt for scattered messages. */
  useEffect(() => {
    if (submitCount > 0) summaryRef.current?.focus();
  }, [submitCount]);

  const errorItems: FormErrorItem[] = FIELD_ORDER.filter((f) => errors[f.key]).map((f) => ({
    id: f.anchor,
    message: t(errors[f.key]),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main id="main" className="flex flex-1 flex-col">
        {/* Hero */}
        <PageHero
          breadcrumb={t("Contact us")}
          title={t("How Can We")}
          highlight={t("Help You?")}
          subtitle={t("Let us know how we can support your existing or future projects, and one of our sales or support representatives will contact you shortly.")}
          image={contactHero}
          imageAlt={t("GEAT technician working on a turbine module")}
          primaryCta={{ label: t("Get in Touch"), href: "#contact-form" }}
          secondaryCta={{ label: t("About GEAT"), href: "/about" }}
        />

        {/* Body */}
        <section id="contact-form" className="section-y bg-background flex-1 scroll-mt-20">
          <div className="section-container">
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">
              {/* Form card */}
              <div className="bg-card border border-border shadow-lg p-8 lg:p-10 relative z-10">
                <div className="w-12 h-1 bg-primary mb-6" />
                <h2 className="font-heading font-bold text-3xl text-foreground mb-3">
                  {t("Contact us")}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {t("Connect with GEAT by completing the form below.")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {submitCount > 0 && <FormErrorSummary ref={summaryRef} errors={errorItems} />}

                  <FormRequiredLegend />

                  <FormField
                    id="firstName"
                    label={t("First Name")}
                    required
                    error={errors.firstName ? t(errors.firstName) : undefined}
                  >
                    {(control) => (
                      <Input
                        {...control}
                        placeholder={t("First Name")}
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        onBlur={blur("firstName")}
                        maxLength={100}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="lastName"
                    label={t("Last Name")}
                    required
                    error={errors.lastName ? t(errors.lastName) : undefined}
                  >
                    {(control) => (
                      <Input
                        {...control}
                        placeholder={t("Last Name")}
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        onBlur={blur("lastName")}
                        maxLength={100}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="email"
                    label={t("Company Email Address")}
                    required
                    error={errors.email ? t(errors.email) : undefined}
                  >
                    {(control) => (
                      <Input
                        {...control}
                        type="email"
                        placeholder={t("Company Email Address")}
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        onBlur={blur("email")}
                        maxLength={255}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="country"
                    label={t("Country/Territory")}
                    required
                    error={errors.country ? t(errors.country) : undefined}
                  >
                    {(control) => (
                      <Select value={form.country} onValueChange={(v) => commit("country", v)}>
                        <SelectTrigger {...control} aria-label={t("Country/Territory")}>
                          <SelectValue placeholder={t("Select Country/Territory…")} />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((c) => (
                            <SelectItem key={c} value={c}>
                              {t(c)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <FormField
                    id="jobTitle"
                    label={t("Subject")}
                    required
                    error={errors.jobTitle ? t(errors.jobTitle) : undefined}
                  >
                    {(control) => (
                      <Input
                        {...control}
                        placeholder={t("Subject")}
                        value={form.jobTitle}
                        onChange={(e) => update("jobTitle", e.target.value)}
                        onBlur={blur("jobTitle")}
                        maxLength={100}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="details"
                    label={t("Please provide details about your request")}
                    required
                    error={errors.details ? t(errors.details) : undefined}
                    control="textarea"
                  >
                    {(control) => (
                      <Textarea
                        {...control}
                        placeholder={t("Please provide details about your request")}
                        value={form.details}
                        onChange={(e) => update("details", e.target.value)}
                        onBlur={blur("details")}
                        rows={5}
                        maxLength={1000}
                      />
                    )}
                  </FormField>

                  <div>
                    <p id="communications-label" className="text-sm font-medium text-foreground mb-3">
                      {t("Communications Preference:")}{" "}
                      <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>*</span>
                    </p>
                    <RadioGroup
                      value={form.communications}
                      onValueChange={(v) => commit("communications", v)}
                      className="space-y-3"
                      aria-labelledby="communications-label"
                      aria-required="true"
                      aria-invalid={errors.communications ? true : undefined}
                      aria-describedby="communications-error"
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="yes" id="comm-yes" className={RADIO_TAP_CLASS} />
                        <Label
                          htmlFor="comm-yes"
                          className="text-sm text-muted-foreground leading-relaxed font-normal"
                        >
                          {t("Yes, please keep me informed of topics and innovations transforming my industry, including special event invitations, surveys, newsletters, product and service incentives, and new product announcements from GEAT and its affiliated companies.")}
                        </Label>
                      </div>
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="no" id="comm-no" className={RADIO_TAP_CLASS} />
                        <Label
                          htmlFor="comm-no"
                          className="text-sm text-muted-foreground leading-relaxed font-normal"
                        >
                          {t("No, please exclude me from marketing communications from GEAT.")}
                        </Label>
                      </div>
                    </RadioGroup>
                    <FieldError
                      id="communications-error"
                      message={errors.communications ? t(errors.communications) : undefined}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t("Detailed information about how the personal data you have supplied is collected, stored and processed can be found in the GEAT Privacy Notice. If you have opted in to receive marketing communications, you can withdraw your consent at any time by visiting the GEAT Communications Preference Center, or by using the unsubscribe link found at the bottom of all emails from GEAT.")}
                  </p>

                  {/* The pressed / focused fill is the accent PAIR. It used to be
                      `bg-geat-blue` under `text-primary-foreground`: a fixed brand
                      value that does not retarget inside surface-dark sitting under
                      a semantic foreground that does, so the two drifted apart the
                      moment this card was placed on a dark ground. */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-none bg-brand text-brand-foreground hover:bg-brand/90 focus-visible:bg-accent focus-visible:text-accent-foreground active:bg-accent active:text-accent-foreground uppercase tracking-wider text-xs px-8 py-6 transition-colors sm:w-auto"
                  >
                    {submitting ? t("Submitting…") : t("Submit Contact Request")}
                  </Button>
                </form>
              </div>

              {/* Useful links */}
              <aside className="lg:pt-4">
                <h2 className="font-heading font-bold text-3xl text-foreground mb-8">
                  {t("Useful links")}
                </h2>
                <div className="space-y-8">
                  <LinkBlock
                    title={t("Contact GEAT")}
                    body={
                      <>
                        {t("Have a question or need more information? Reach out to the GEAT team by email, and we’ll be happy to assist you.")}{" "}
                        <a href="mailto:contact@geat.dz" className="link-inline text-accent">
                          contact@geat.dz
                        </a>
                      </>
                    }
                  />
                  <LinkBlock
                    title={t("Contact Our HR Team")}
                    body={
                      <>
                        {t("Interested in joining GEAT or have a career-related question? Contact our HR team for information about opportunities, applications, and recruitment.")}{" "}
                        <a href="mailto:recruitment@geat.dz" className="link-inline text-accent">
                          recruitment@geat.dz
                        </a>
                      </>
                    }
                  />

                  <LinkBlock
                    title={t("Career opportunities")}
                    body={
                      <>
                        {t("For career opportunities or to check your job applications, visit")}{" "}
                        <Link to="/careers" className="link-inline text-accent">
                          {t("Careers at GEAT")}
                        </Link>
                        .
                      </>
                    }
                  />
                  <LinkBlock
                    title={t("Media contacts")}
                    body={
                      <>
                        {t("For media contacts, visit")}{" "}
                        <a
                          href="https://www.linkedin.com/company/general-electric-algeria-turbines"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-inline text-accent"
                        >
                          {t("GEAT on LinkedIn")}
                          <ExternalLink
                            className="ml-1 inline h-3.5 w-3.5 align-[-0.15em]"
                            aria-hidden="true"
                          />
                          <span className="sr-only"> {t("(opens in a new tab)")}</span>
                        </a>
                        .
                      </>
                    }
                  />
                  <LinkBlock
                    title={t("Visit us")}
                    body={
                      <>
                        {t("Zone Industrielle, Lot n°60")}
                        <br />
                        {t("Section « C » Aïn Yagout,")}
                        <br />
                        {t("Batna, Algérie")}
                      </>
                    }
                  />
                </div>
              </aside>
            </div>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
};

const LinkBlock = ({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) => (
  <div>
    <h3 className="font-heading font-bold text-lg text-foreground mb-2">
      {title}
    </h3>
    <p className="text-muted-foreground leading-relaxed text-sm">{body}</p>
  </div>
);

export default Contact;
