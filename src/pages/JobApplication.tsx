import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import careersHero from "@/assets/careers-hero-bg.jpg";
import GeniChat from "@/components/GeniChat";
import CareersSubNav from "@/components/CareersSubNav";
import ApplicationStatusModal from "@/components/ApplicationStatusModal";
import QuestionnaireFields, {
  emptyAnswers,
  missingRequiredAnswers,
  toAnswerPayload,
  type AnswerState,
} from "@/components/QuestionnaireFields";
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
import { ApiError } from "@/api/client";
import { applyToJob } from "@/api/jobs";
import { useJobQuery } from "@/hooks/useJobs";
import { useReferenceData } from "@/hooks/useReferenceData";
import { apiErrorMessage } from "@/lib/apiErrors";
import { toast } from "@/hooks/use-toast";
import { useLanguage, useT } from "@/i18n/LanguageContext";

/**
 * Mirrors the server's constraints so the candidate gets fast feedback, but the
 * server stays the authority: whatever a 400 names is shown even if this schema
 * was satisfied.
 */
const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80, "First name is too long"),
  lastName: z.string().trim().min(1, "Last name is required").max(80, "Last name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(160, "Email address is too long"),
  /* Algerian numbers, with or without +213. Optional server-side, but a
     recruiter needs a way to call back, so the form asks for it. */
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[+0-9 ().-]{8,20}$/, "Enter a valid phone number"),
  /* Optional: an empty value passes; a filled one must be a real, past date. */
  dateOfBirth: z
    .string()
    .trim()
    .refine((v) => v === "" || (!Number.isNaN(Date.parse(v)) && new Date(v) <= new Date()), {
      message: "Enter a valid date of birth",
    }),
  location: z.string().trim().min(1, "Select your city").max(120, "Location is too long"),
  education: z.string().trim().min(1, "Education is required"),
  experience: z.string().trim().min(1, "Experience is required"),
  coverLetter: z.string().trim().max(20000, "Cover letter is too long"),
});

const MAX_CV_BYTES = 5 * 1024 * 1024;

/** A date of birth cannot be in the future. */
const TODAY = new Date().toISOString().slice(0, 10);

/** Visual order of the fields — drives the error summary. */
const FIELD_ORDER = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "dateOfBirth",
  "location",
  "education",
  "experience",
  "coverLetter",
  "cv",
  "questionnaire",
  "confirmed",
] as const;

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  location: "",
  education: "",
  experience: "",
  coverLetter: "",
};

const JobApplication = () => {
  const t = useT();
  const { lang } = useLanguage();
  const { slug } = useParams();
  const { options } = useReferenceData();
  const { data: job, isLoading: jobLoading, error: jobError } = useJobQuery(slug);

  const [form, setForm] = useState(emptyForm);
  const [cv, setCv] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitCount, setSubmitCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  // Reset the answer map whenever a different questionnaire arrives.
  useEffect(() => {
    setAnswers(emptyAnswers(job?.questionnaire));
  }, [job?.questionnaire]);

  /* One source of truth: the Zod schema above validates a single field by
     parsing the whole form and keeping only that field's issue. */
  const fieldError = (key: keyof typeof form, values: typeof form) => {
    const result = applicationSchema.safeParse(values);
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

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_CV_BYTES) {
      setErrors((prev) => ({ ...prev, cv: "File is too large (max 5 MB)" }));
      setCv(null);
      return;
    }
    setErrors((prev) => ({ ...prev, cv: "" }));
    setCv(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    const result = applicationSchema.safeParse(form);
    const next: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) next[String(issue.path[0])] = issue.message;
    }
    if (!cv) next.cv = "Please upload your CV (PDF or Word, max 5 MB)";
    if (!confirmed) next.confirmed = "Please confirm that the information provided is accurate";
    if (missingRequiredAnswers(job.questionnaire, answers)) {
      next.questionnaire = "Please answer every required question";
    }

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
      const receipt = await applyToJob(job.slug, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        /* The form no longer asks for a LinkedIn profile, but the endpoint
           still accepts the field, so it is sent empty rather than dropped
           from the payload shape. */
        linkedinUrl: "",
        coverLetter: form.coverLetter.trim(),
        preferredLanguage: lang === "fr" ? "FR" : "EN",
        cv: cv as File,
        answers: toAnswerPayload(job.questionnaire, answers),
        dateOfBirth: form.dateOfBirth.trim(),
        education: form.education,
        experience: form.experience,
      });
      setReference(receipt.reference);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      const message = apiErrorMessage(error);
      /* A 400 names the offending fields — surface them on the inputs rather
         than only in a toast, so the candidate can see what to fix. */
      if (error instanceof ApiError && error.kind === "validation") {
        if (Object.keys(error.fields).length > 0) {
          setErrors({ ...error.fields });
          setTouched(Object.fromEntries(FIELD_ORDER.map((k) => [k, true])));
          setSubmitCount((c) => c + 1);
        }
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
     user to hunt for scattered messages. */
  useEffect(() => {
    if (submitCount > 0) summaryRef.current?.focus();
  }, [submitCount]);

  const errorItems: FormErrorItem[] = FIELD_ORDER.filter((key) => errors[key]).map((key) => ({
    id: key,
    message: t(errors[key]),
  }));

  if (reference) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main">
          <section className="section-y-lg">
            <div className="section-container">
              <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
                <CheckCircle2 className="mx-auto mb-6 h-14 w-14 text-primary" aria-hidden="true" />
                <h1 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
                  {t("Application Submitted Successfully")}
                </h1>
                <p className="mt-4 text-muted-foreground">
                  {t("Thank you {name}. Your application has been received by the GEAT Talent Acquisition team.")
                    .replace("{name}", form.firstName)}
                </p>
                <div className="mt-8 rounded-xl bg-secondary p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t("Application reference number")}
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold text-foreground">{reference}</p>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">
                  {t("Keep this reference — it is the only way to check your application status later.")}
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-4">
                  <Link to="/careers" className="btn-cta">
                    {t("Explore Career Opportunities")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
  }

  // The offer can be unpublished between the board and this form.
  if (!jobLoading && (jobError || !job)) {
    const gone = jobError instanceof ApiError && jobError.kind === "notFound";
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main id="main" className="section-container section-y-lg text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="mt-4 font-heading text-3xl font-bold text-foreground">
            {gone ? t("Position not found") : t("This position cannot be loaded right now")}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {gone
              ? t("This opening may no longer be available.")
              : t("We could not reach the recruitment service. Please try again in a moment.")}
          </p>
          <Link to="/careers/jobs" className="btn-cta mt-8">
            {t("See all opportunities")} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </main>
        <Footer />
        <GeniChat />
      </div>
    );
  }

  /* City, education and experience are HRIS vocabularies, not local arrays.
     The pre-API form read them from static lists in src/data/careers.ts that
     the HRIS migration deleted; /api/meta/* publishes the same three, already
     carrying both language labels, and useReferenceData caches them for the
     session. Selects therefore submit the vocabulary KEY and display the
     label in the active language. */
  const locationOptions = options("locations");
  const educationOptions = options("education-levels");
  const experienceOptions = options("experience-bands");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main id="main">
        <CareersSubNav />

        <PageHero
          breadcrumb={t("Application")}
          breadcrumbTrail={
            job
              ? [
                  { label: t("Careers"), href: "/careers" },
                  { label: job.title, href: `/careers/jobs/${job.slug}` },
                ]
              : [{ label: t("Careers"), href: "/careers" }]
          }
          title={job ? t("Apply for {title}").replace("{title}", job.title) : t("Apply to GEAT")}
          subtitle={job?.reference}
          image={careersHero}
          imageAlt="GEAT engineers on site"
          primaryCta={{ label: t("Back to position"), href: job ? `/careers/jobs/${job.slug}` : "/careers" }}
        />

        <section className="section-y">
          <div className="section-container">
            <form
              onSubmit={handleSubmit}
              className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-border bg-card p-6 lg:p-10"
              noValidate
            >
              {submitCount > 0 && <FormErrorSummary ref={summaryRef} errors={errorItems} />}

              <FormRequiredLegend />

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  id="firstName"
                  label={t("First Name")}
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
                  label={t("Last Name")}
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
                  label={t("Email")}
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
                  label={t("Phone")}
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
                  id="dateOfBirth"
                  label={t("Date of Birth")}
                  error={errors.dateOfBirth ? t(errors.dateOfBirth) : undefined}
                >
                  {(control) => (
                    <input
                      {...control}
                      type="date"
                      value={form.dateOfBirth}
                      onChange={set("dateOfBirth")}
                      onBlur={blur("dateOfBirth")}
                      max={TODAY}
                    />
                  )}
                </FormField>

                <FormField
                  id="location"
                  label={t("City")}
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
                      <option value="">{t("Select a city")}</option>
                      {locationOptions.map((option) => (
                        <option key={option.key} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>
              </div>

              {/* Education and experience span the full width, as they did
                  before the API migration — their labels are long enough that
                  a two-up row truncates them on a phone. */}
              <div className="mt-5 grid grid-cols-1 gap-5">
                <FormField
                  id="education"
                  label={t("Education")}
                  required
                  error={errors.education ? t(errors.education) : undefined}
                >
                  {(control) => (
                    <select
                      {...control}
                      value={form.education}
                      onChange={set("education")}
                      onBlur={blur("education")}
                    >
                      <option value="">{t("Select your education level")}</option>
                      {educationOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>

                <FormField
                  id="experience"
                  label={t("Experience")}
                  required
                  error={errors.experience ? t(errors.experience) : undefined}
                >
                  {(control) => (
                    <select
                      {...control}
                      value={form.experience}
                      onChange={set("experience")}
                      onBlur={blur("experience")}
                    >
                      <option value="">{t("Select your experience level")}</option>
                      {experienceOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>
              </div>

              {/* The <input type="file"> is sr-only — a 1px box is not the target
                  and never was. The <label> is: it is bound by htmlFor/id, so a
                  press anywhere on it opens the picker, it is a full-width row and
                  it clears 44px on its own padding. The focus ring is mirrored
                  from the hidden input onto the label with peer-focus-visible. */}
              <FormField
                id="cv"
                label={t("CV Upload")}
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
                      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border-dashed bg-background px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-brand-edge peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ${
                        state.invalid ? FIELD_INVALID_CLASS : "border border-input"
                      }`}
                    >
                      <Upload className="h-5 w-5 text-primary" aria-hidden="true" />
                      {cv ? (
                        <span className="text-foreground">{cv.name}</span>
                      ) : (
                        <span>{t("Upload your CV — PDF or Word, max 5 MB")}</span>
                      )}
                    </label>
                  </>
                )}
              </FormField>

              <FormField id="coverLetter" label={t("Cover Letter")} control="textarea">
                {(control) => (
                  <textarea
                    {...control}
                    value={form.coverLetter}
                    onChange={set("coverLetter")}
                    onBlur={blur("coverLetter")}
                    rows={6}
                    maxLength={20000}
                    placeholder={t("Tell us why you want to join GEAT")}
                  />
                )}
              </FormField>

              <QuestionnaireFields
                questionnaire={job?.questionnaire ?? null}
                answers={answers}
                onChange={setAnswers}
                error={errors.questionnaire ? t(errors.questionnaire) : undefined}
              />

              <div>
                <label className="flex items-start gap-3 text-sm text-foreground" htmlFor="confirmed">
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
                    {t("I confirm that the information provided is accurate.")}
                    <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>{" *"}</span>
                  </span>
                </label>
                <FieldError
                  id="confirmed-error"
                  message={errors.confirmed ? t(errors.confirmed) : undefined}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || jobLoading}
                className="btn-cta w-full justify-center disabled:opacity-70 sm:w-auto"
              >
                {submitting ? t("Submitting…") : t("Submit Application")}{" "}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
      <GeniChat />
      <ApplicationStatusModal />
    </div>
  );
};

export default JobApplication;
