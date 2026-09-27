import { useEffect, useRef, useState } from "react";
import { X, Check, Circle, Search, AlertTriangle } from "lucide-react";
import { z } from "zod";
import FormField, {
  FormErrorSummary,
  FormRequiredLegend,
  type FormErrorItem,
} from "@/components/FormField";
import { ApiError } from "@/api/client";
import { fetchApplicationStatus } from "@/api/jobs";
import type { ApplicationStatusStep } from "@/api/types";
import { apiErrorMessage } from "@/lib/apiErrors";
import { formatDate } from "@/data/careers";
import { useDialog } from "@/hooks/useDialog";
import { useT } from "@/i18n/LanguageContext";

const schema = z.object({
  reference: z
    .string()
    .trim()
    .min(6, "Enter your application reference number")
    .max(40, "Reference number is too long"),
  email: z.string().trim().email("Enter a valid email address").max(255),
});

const STEPS = ["Application Submitted", "Under HR Review", "Interview", "Final Decision"];

const EXPLANATIONS: Record<string, string> = {
  "Application Submitted":
    "We have received your application. Our recruitment team will start the review shortly.",
  "Under HR Review":
    "Your CV is being reviewed by our HR team together with the hiring manager. This step usually takes up to two weeks.",
  Interview:
    "You have been shortlisted. A recruiter will contact you to schedule your technical and HR interviews.",
  "Final Decision":
    "Your file is with the hiring committee for the final decision. The outcome will appear here as soon as it is recorded.",
};

type Result = {
  jobTitle: string;
  reference: string;
  date: string;
  stepIndex: number;
};

/** The API's step values, in the order the tracker renders them. */
const STEP_ORDER: ApplicationStatusStep[] = ["received", "in_review", "in_progress", "final_decision"];

const inputClass =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus-visible:border-brand-edge";

/** Visual order of the fields — drives the error summary. `id` is the id the
    control actually carries, so a summary entry focuses the right input. */
const FIELDS = [
  { key: "reference", id: "asm-ref" },
  { key: "email", id: "asm-email" },
] as const;

type Values = { reference: string; email: string };
type FieldKey = keyof Values;

const ApplicationStatusModal = () => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Values>({ reference: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitCount, setSubmitCount] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [pending, setPending] = useState(false);
  const [lookupError, setLookupError] = useState<{ title: string; description: string } | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setResult(null);
      setLookupError(null);
      setErrors({});
      setTouched({});
      setSubmitCount(0);
    };
    window.addEventListener("geat:application-status", handler);
    return () => window.removeEventListener("geat:application-status", handler);
  }, []);

  /* Escape (topmost dialog only), Tab trapped inside, body scroll locked,
     focus moved in on open and handed back to the opener on close. */
  useDialog(dialogRef, { open, onClose: () => setOpen(false), modal: true });

  /* Submitting with errors moves focus to the summary rather than leaving the
     user to hunt for the red text. */
  useEffect(() => {
    if (submitCount > 0) summaryRef.current?.focus();
  }, [submitCount]);

  /* One source of truth: the Zod schema validates a single field by parsing
     the whole form and keeping only that field's issue. */
  const fieldError = (key: FieldKey, values: Values) => {
    const parsed = schema.safeParse(values);
    if (parsed.success) return "";
    const issue = parsed.error.issues.find((i) => i.path[0] === key);
    return issue ? issue.message : "";
  };

  const set = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...form, [key]: e.target.value };
    setForm(next);
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: fieldError(key, next) }));
  };

  const blur = (key: FieldKey) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: fieldError(key, form) }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setTouched(Object.fromEntries(FIELDS.map((f) => [f.key, true])));
      setSubmitCount((c) => c + 1);
      return;
    }
    setErrors({});
    setLookupError(null);
    setPending(true);

    try {
      const status = await fetchApplicationStatus(parsed.data.reference, parsed.data.email);
      const stepIndex = Math.max(0, STEP_ORDER.indexOf(status.step));
      setResult({
        jobTitle: status.jobTitle ?? "",
        reference: status.reference,
        date: status.submittedAt ? formatDate(status.submittedAt) : "",
        stepIndex,
      });
    } catch (error) {
      /* A wrong reference and a wrong email both return 404, by design, so that
         the endpoint cannot be used to discover who applied for what. The UI
         must not distinguish them either: one neutral message for both. */
      if (error instanceof ApiError && error.kind === "notFound") {
        setLookupError({
          title: "No application matches",
          description:
            "We could not find an application for those details. Check the reference number and the email address used to apply, then try again.",
        });
      } else {
        setLookupError(apiErrorMessage(error));
      }
    } finally {
      setPending(false);
    }
  };

  const errorItems: FormErrorItem[] = FIELDS.filter((f) => errors[f.key]).map((f) => ({
    id: f.id,
    message: t(errors[f.key]),
  }));

  if (!open) return null;

  const currentStep = result ? STEPS[result.stepIndex] : "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-geat-dark/70 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="asm-title"
        tabIndex={-1}
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-7 shadow-2xl lg:p-9"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label={t("Close dialog")}
          className="tap-target group absolute right-3 top-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
            <X className="h-5 w-5" aria-hidden="true" />
          </span>
        </button>

        <div className="mb-6 h-1 w-12 bg-primary" />
        <h2 id="asm-title" className="mb-2 font-heading text-2xl font-bold text-foreground">
          {t("Check Your Application Status")}
        </h2>

        {!result ? (
          <>
            <p className="mb-7 text-sm text-muted-foreground">
              {t("Enter your application reference number together with the email address you used to apply.")}
            </p>
            <form onSubmit={submit} className="space-y-5" noValidate>
              {submitCount > 0 && <FormErrorSummary ref={summaryRef} errors={errorItems} />}

              {lookupError && (
                <div
                  role="status"
                  className="flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm"
                >
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-foreground">{t(lookupError.title)}</span>
                    <span className="text-muted-foreground">{t(lookupError.description)}</span>
                  </span>
                </div>
              )}

              <FormRequiredLegend />

              <FormField
                id="asm-ref"
                label={t("Application Reference Number")}
                required
                error={errors.reference ? t(errors.reference) : undefined}
                controlClass={inputClass}
              >
                {(control) => (
                  <input
                    {...control}
                    value={form.reference}
                    onChange={set("reference")}
                    onBlur={blur("reference")}
                    placeholder="GEAT-2026-XXXXXX"
                    maxLength={40}
                  />
                )}
              </FormField>

              <FormField
                id="asm-email"
                label={t("Email Address")}
                required
                error={errors.email ? t(errors.email) : undefined}
                controlClass={inputClass}
              >
                {(control) => (
                  <input
                    {...control}
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    onBlur={blur("email")}
                    placeholder="you@example.com"
                    maxLength={255}
                  />
                )}
              </FormField>

              <button type="submit" disabled={pending} className="btn-cta w-full justify-center disabled:opacity-70">
                {pending ? t("Checking…") : t("Check Status")}{" "}
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {t("Here is the latest update on your application.")}
            </p>

            <dl className="mb-8 grid gap-4 rounded-xl border border-border bg-secondary/40 p-5 sm:grid-cols-2">
              {[
                [t("Job Title"), result.jobTitle],
                [t("Application Reference"), result.reference],
                [t("Application Date"), result.date],
                [t("Current Status"), t(currentStep)],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-semibold text-foreground">{value}</dd>
                  </div>
                ))}
            </dl>

            <ol className="mb-6 space-y-0 sm:flex sm:space-y-0">
              {STEPS.map((step, i) => {
                const done = i < result.stepIndex;
                const active = i === result.stepIndex;
                return (
                  <li key={step} className="flex flex-1 gap-3 pb-6 sm:flex-col sm:pb-0">
                    <div className="flex flex-col items-center sm:w-full sm:flex-row">
                      <span
                        /* All three states carry a boundary that is visible on
                           the white modal (WCAG 1.4.11, 3:1). `done` used to
                           rim the amber disc with `border-primary`, i.e. the
                           disc's own fill — no boundary at all, and the fill
                           alone is 2.12:1 against the card. `border-brand-edge`
                           is 4.01:1 on white and matches the `active` rim
                           beside it. */
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                          done
                            ? "border-brand-edge bg-brand text-brand-foreground"
                            : active
                              ? "border-brand-edge bg-primary/15"
                              : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {done ? (
                          <Check className="h-4 w-4" />
                        ) : active ? (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        ) : (
                          <Circle className="h-3 w-3" />
                        )}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`w-0.5 flex-1 sm:h-0.5 sm:w-full ${
                            done ? "bg-primary" : "bg-border"
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`text-sm sm:mt-3 sm:pr-4 ${
                        active ? "font-semibold text-foreground" : done ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {t(step)}
                    </p>
                  </li>
                );
              })}
            </ol>

            <p className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
              {t(EXPLANATIONS[currentStep])}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setLookupError(null);
                }}
                className="btn-cta btn-cta-outline"
              >
                {t("Back")}
              </button>
              <button type="button" onClick={() => setOpen(false)} className="btn-cta">
                {t("Close")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationStatusModal;
