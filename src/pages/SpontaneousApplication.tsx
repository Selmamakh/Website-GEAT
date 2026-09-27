import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import FormField, {
  CHECKBOX_TAP_AREA_CLASS,
  CHECKBOX_TAP_WRAP_CLASS,
  FieldError,
  FIELD_INVALID_CLASS,
  FormErrorSummary,
  FormRequiredLegend,
  REQUIRED_MARK_CLASS,
  type FormErrorItem,
} from "@/components/FormField";
import careersHero from "@/assets/careers-hero-bg.jpg";
import { ApiError } from "@/api/client";
import { submitSpontaneousApplication } from "@/api/jobs";
import { useReferenceData } from "@/hooks/useReferenceData";
import { apiErrorMessage } from "@/lib/apiErrors";
import { toast } from "@/hooks/use-toast";
import { useLanguage, useT } from "@/i18n/LanguageContext";

/** Mirrors the server's constraints; the server remains the authority. */
const schema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80, "First name is too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(80, "Last name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(160, "Email address is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[+0-9 ().-]{8,20}$/, "Enter a valid phone number"),
  /* Sent as professionKey: this one is a vocabulary key, not a label. */
  professionKey: z.string().trim().min(1, "Select a field of interest").max(80),
  location: z.string().trim().min(1, "Select a preferred location").max(120, "Location is too long"),
  areaOfInterest: z.string().trim().max(200, "Area of interest is too long"),
  linkedinUrl: z
    .string()
    .trim()
    .max(300, "LinkedIn URL is too long")
    .refine((value) => value === "" || z.string().url().safeParse(value).success, {
      message: "Enter a valid URL, or leave this empty",
    }),
  coverLetter: z.string().trim().max(20000, "Motivation text is too long"),
});

/** Visual order of the fields — drives the error summary. */
const FIELD_ORDER = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "professionKey",
  "location",
  "areaOfInterest",
  "linkedinUrl",
  "coverLetter",
  "cv",
  "confirmed",
] as const;

const SpontaneousApplication = () => {
  const t = useT();
  const { lang } = useLanguage();
  const { options } = useReferenceData();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    professionKey: "",
    location: "",
    areaOfInterest: "",
    linkedinUrl: "",
    coverLetter: "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitCount, setSubmitCount] = useState(0);
  const [reference, setReference] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  /* One source of truth: the Zod schema above validates a single field by
     parsing the whole form and keeping only that field's issue. */
  const fieldError = (key: keyof typeof form, values: typeof form) => {
    const result = schema.safeParse(values);
    if (result.success) return "";
    const issue = result.error.issues.find((i) => i.path[0] === key);
    return issue ? issue.message : "";
  };

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const next = { ...form, [key]: e.target.value };
      setForm(next);
      if (touched[key]) setErrors((prev) => ({ ...prev, [key]: fieldError(key, next) }));
    };

  const blur = (key: keyof typeof form) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, form) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    const next: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
    }
    if (!cv) next.cv = "Please upload your CV (PDF or Word, max 5 MB)";
    if (!confirmed) next.confirmed = "Please confirm that the information provided is accurate";
    setErrors(next);
    // `!result.success` is part of the guard so the parsed data is narrowed below.
    if (!result.success || Object.keys(next).length > 0) {
      setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
      setSubmitCount((c) => c + 1);
      toast({
        title: t("Please check the form"),
        description: t("Some required fields need your attention."),
      });
      return;
    }

    setSubmitting(true);
    try {
      /* Built field by field rather than spread from result.data: this project
         compiles with strict: false, under which zod infers every parsed
         property as optional. */
      const receipt = await submitSpontaneousApplication({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        linkedinUrl: form.linkedinUrl.trim(),
        coverLetter: form.coverLetter.trim(),
        professionKey: form.professionKey.trim(),
        areaOfInterest: form.areaOfInterest.trim(),
        preferredLanguage: lang === "fr" ? "FR" : "EN",
        cv: cv as File,
        answers: [],
      });
      setReference(receipt.reference);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message = apiErrorMessage(error);
      if (error instanceof ApiError && error.kind === "validation" && Object.keys(error.fields).length > 0) {
        setErrors({ ...error.fields });
        setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
        setSubmitCount((c) => c + 1);
      }
      toast({
        title: t(message.title),
        description: t(message.description),
        variant: error instanceof ApiError && error.kind === "rateLimit" ? "default" : "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* Submitting with errors moves focus to the summary instead of leaving the
     user to hunt for eight scattered messages. */
  useEffect(() => {
    if (submitCount > 0) summaryRef.current?.focus();
  }, [submitCount]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, cv: "File is too large (max 5 MB)" }));
      return;
    }
    setErrors((p) => ({ ...p, cv: "" }));
    setCv(file);
  };

  const errorItems: FormErrorItem[] = FIELD_ORDER.filter((key) => errors[key]).map((key) => ({
    id: key,
    message: t(errors[key]),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main">
        <CareersSubNav />

        <PageHero
          breadcrumb={t("Spontaneous Application")}
          breadcrumbTrail={[{ label: t("Careers"), href: "/careers" }]}
          title={t("Spontaneous Application")}
          image={careersHero}
          imageAlt="GEAT engineers at the Batna industrial complex"
          align="center"
        />

        <section className="section-y">
          <div className="section-container max-w-3xl">
            {reference ? (
              <div className="rounded-2xl border border-border bg-card p-9 text-center">
                <CheckCircle2 className="mx-auto h-14 w-14 text-primary" aria-hidden="true" />
                <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">
                  {t("Application received")}
                </h2>
                <p className="mt-4 text-muted-foreground">
                  {t("Thank you. Your spontaneous application has been registered and will be reviewed by our\n                recruitment team. We will contact you if a position matches your profile.")}
                </p>
                <p className="mt-7 text-sm uppercase tracking-wide text-muted-foreground">
                  {t("Your reference number")}
                </p>
                <p className="font-heading text-2xl font-bold text-foreground">{reference}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {t("Keep this number — you can use it in Check Application Status.")}
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link to="/careers/jobs" className="btn-cta justify-center">
                    {t("Browse Open Jobs")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link to="/careers" className="btn-cta btn-cta-outline justify-center">
                    {t("Back to Careers")}
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-7 lg:p-9" noValidate>
                {submitCount > 0 && (
                  <FormErrorSummary ref={summaryRef} errors={errorItems} className="mb-8" />
                )}

                <h2 className="font-heading text-xl font-semibold text-foreground">{t("Your details")}</h2>
                <FormRequiredLegend className="mt-2" />

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="firstName"
                    label={t("First name")}
                    required
                    error={errors.firstName ? t(errors.firstName) : undefined}
                  >
                    {(control) => (
                      <input
                        {...control}
                        value={form.firstName}
                        onChange={set("firstName")}
                        onBlur={blur("firstName")}
                        maxLength={80}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="lastName"
                    label={t("Last name")}
                    required
                    error={errors.lastName ? t(errors.lastName) : undefined}
                  >
                    {(control) => (
                      <input
                        {...control}
                        value={form.lastName}
                        onChange={set("lastName")}
                        onBlur={blur("lastName")}
                        maxLength={80}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="email"
                    label={t("Email address")}
                    required
                    error={errors.email ? t(errors.email) : undefined}
                  >
                    {(control) => (
                      <input
                        {...control}
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        onBlur={blur("email")}
                        maxLength={160}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="phone"
                    label={t("Phone number")}
                    required
                    error={errors.phone ? t(errors.phone) : undefined}
                  >
                    {(control) => (
                      <input
                        {...control}
                        type="tel"
                        value={form.phone}
                        onChange={set("phone")}
                        onBlur={blur("phone")}
                        maxLength={20}
                        placeholder="+213 ..."
                      />
                    )}
                  </FormField>

                  <FormField
                    id="professionKey"
                    label={t("Field of interest")}
                    required
                    error={errors.professionKey ? t(errors.professionKey) : undefined}
                  >
                    {(control) => (
                      <select
                        {...control}
                        value={form.professionKey}
                        onChange={set("professionKey")}
                        onBlur={blur("professionKey")}
                      >
                        <option value="">{t("Select a field")}</option>
                        {options("professions").map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </FormField>

                  <FormField
                    id="location"
                    label={t("Preferred wilaya")}
                    required
                    error={errors.location ? t(errors.location) : undefined}
                  >
                    {(control) => (
                      <select
                        {...control}
                        value={form.location}
                        onChange={set("location")}
                        onBlur={blur("location")}
                      >
                        <option value="">{t("Select a wilaya")}</option>
                        {options("locations").map((option) => (
                          <option key={option.key} value={option.label}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </FormField>
                </div>

                <h2 className="mt-10 font-heading text-xl font-semibold text-foreground">
                  {t("Your background")}
                </h2>
                <div className="mt-6 space-y-5">
                  <FormField
                    id="areaOfInterest"
                    label={t("Area of interest")}
                    error={errors.areaOfInterest ? t(errors.areaOfInterest) : undefined}
                  >
                    {(control) => (
                      <input
                        {...control}
                        value={form.areaOfInterest}
                        onChange={set("areaOfInterest")}
                        onBlur={blur("areaOfInterest")}
                        maxLength={200}
                        placeholder={t("For example: turbine maintenance, quality control")}
                      />
                    )}
                  </FormField>

                  <FormField
                    id="linkedinUrl"
                    label={t("LinkedIn Profile")}
                    error={errors.linkedinUrl ? t(errors.linkedinUrl) : undefined}
                  >
                    {(control) => (
                      <input
                        {...control}
                        type="url"
                        value={form.linkedinUrl}
                        onChange={set("linkedinUrl")}
                        onBlur={blur("linkedinUrl")}
                        maxLength={300}
                        placeholder="https://www.linkedin.com/in/..."
                      />
                    )}
                  </FormField>

                  <FormField id="coverLetter" label={t("Motivation")} control="textarea">
                    {(control) => (
                      <textarea
                        {...control}
                        rows={4}
                        value={form.coverLetter}
                        onChange={set("coverLetter")}
                        onBlur={blur("coverLetter")}
                        maxLength={20000}
                      />
                    )}
                  </FormField>

                  {/* The <input type="file"> is sr-only — a 1px box is not the
                      target and never was. The <label> is: it is bound by
                      htmlFor/id, so a press anywhere on it opens the picker, it is
                      a full-width row and it clears 44px on its own padding. The
                      focus ring is mirrored from the hidden input onto the label
                      with peer-focus-visible. */}
                  <FormField
                    id="cv"
                    label={t("CV (PDF or Word, max 5 MB)")}
                    required
                    control="custom"
                    error={errors.cv ? t(errors.cv) : undefined}
                  >
                    {(control, state) => (
                      <>
                        <input
                          {...control}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={onFile}
                          className="peer sr-only"
                        />
                        <label
                          htmlFor="cv"
                          className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border-dashed bg-background p-5 text-sm text-muted-foreground transition-colors hover:border-brand-edge peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
                            state.invalid ? FIELD_INVALID_CLASS : "border border-input"
                          }`}
                        >
                          <Upload className="h-5 w-5 text-primary" aria-hidden="true" />
                          <span>{cv ? cv.name : t("Choose a file")}</span>
                        </label>
                      </>
                    )}
                  </FormField>

                  <div>
                    <label className="flex items-start gap-3 text-sm text-muted-foreground" htmlFor="confirmed">
                      <span className={CHECKBOX_TAP_WRAP_CLASS}>
                        <input
                          id="confirmed"
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => {
                            setConfirmed(e.target.checked);
                            setErrors((prev) => ({
                              ...prev,
                              confirmed: e.target.checked
                                ? ""
                                : "Please confirm that the information provided is accurate",
                            }));
                          }}
                          aria-invalid={errors.confirmed ? true : undefined}
                          aria-describedby="confirmed-error"
                          aria-required="true"
                          className={`h-4 w-4 min-h-4 accent-primary ${
                            errors.confirmed ? "outline outline-2 outline-offset-2 outline-destructive" : ""
                          }`}
                        />
                        <span aria-hidden="true" className={CHECKBOX_TAP_AREA_CLASS} />
                      </span>
                      <span>
                        {t("I confirm that the information provided is accurate and I agree that GEAT may keep my\n                    application on file for future openings.")}
                        <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>{" *"}</span>
                      </span>
                    </label>
                    <FieldError
                      id="confirmed-error"
                      message={errors.confirmed ? t(errors.confirmed) : undefined}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-cta mt-9 w-full justify-center disabled:opacity-70"
                >
                  {submitting ? t("Submitting…") : t("Submit Application")}{" "}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <GeniChat />
      <ApplicationStatusModal />
    </div>
  );
};

export default SpontaneousApplication;
