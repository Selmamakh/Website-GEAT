import { useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Check, Loader2, Mail, Send } from "lucide-react";
import { z } from "zod";
import { subscribeToNewsletter } from "@/api/forms";
import { apiErrorMessage } from "@/lib/apiErrors";
import { useLanguage, useT } from "@/i18n/LanguageContext";

/* Same shape the rest of the site's forms use: one zod schema, validated on
   blur once touched and again on submit. The field used to be uncontrolled
   with no schema at all, and the form's only handler was preventDefault() —
   so an address typed here went nowhere and the visitor was never told. */
const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .email("Enter a valid email address")
    .max(255, "Email address is too long"),
});

type Status = "idle" | "sending" | "done";

const Newsletter = () => {
  const t = useT();
  const { lang } = useLanguage();
  const { pathname } = useLocation();
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const validate = (value: string) => {
    const parsed = schema.safeParse({ email: value });
    return parsed.success ? "" : (parsed.error.issues[0]?.message ?? "");
  };

  const onChange = (value: string) => {
    setEmail(value);
    if (touched) setError(validate(value));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = validate(email);
    setTouched(true);
    setError(message);
    if (message) return;

    setStatus("sending");
    try {
      await subscribeToNewsletter({
        email: email.trim(),
        preferredLanguage: lang === "fr" ? "FR" : "EN",
        source: pathname,
      });
      /* Confirmed only once the receiving endpoint has accepted it. Whether a
         confirmation email follows is that endpoint's business — see
         src/api/forms.ts on why double opt-in cannot live in the browser. */
      setStatus("done");
      setEmail("");
      setTouched(false);
    } catch (err) {
      const { description } = apiErrorMessage(err);
      setError(description);
      setStatus("idle");
    }
  };

  return (
    <section className="relative bg-secondary section-y overflow-hidden">
      {/* subtle backdrop accents */}
      <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary/[0.05] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-geat-blue/[0.06] blur-3xl pointer-events-none" />

      <div className="section-container relative">
        <div className="surface-dark relative mx-auto max-w-6xl rounded-2xl bg-geat-dark text-foreground border border-border px-5 sm:px-10 lg:px-12 py-10 sm:py-12 shadow-2xl overflow-hidden">

          {/* accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
          <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-10 w-80 h-80 rounded-full bg-geat-blue/15 blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-[32px] text-foreground leading-tight">
                  {t("Subscribe Our Newsletter")}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-md leading-relaxed">
                  {t("For Latest Updates from GEAT")}
                </p>
              </div>
            </div>

            {status === "done" ? (
              /* aria-live so the confirmation is announced where the form was,
                 rather than silently replacing it for screen-reader users. */
              <div
                role="status"
                aria-live="polite"
                className="flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-heading text-sm font-bold text-success">
                    {t("Thank you for subscribing")}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t("If a confirmation email is required, it is on its way — please check your inbox.")}
                  </p>
                </div>
              </div>
            ) : (
              <form className="w-full min-w-0" onSubmit={onSubmit} noValidate>
                <label htmlFor={inputId} className="sr-only">{t("Email address")}</label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-0 sm:bg-card sm:rounded-md sm:overflow-hidden sm:shadow-lg">
                  <div className="flex flex-1 items-stretch rounded-md bg-card overflow-hidden shadow-lg sm:rounded-none sm:shadow-none">
                    <div className="flex items-center pl-4 pr-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id={inputId}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => onChange(e.target.value)}
                      onBlur={() => {
                        setTouched(true);
                        setError(validate(email));
                      }}
                      disabled={status === "sending"}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? errorId : undefined}
                      placeholder={t("your.email@company.com")}
                      className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground py-3.5 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-60"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group h-12 justify-center rounded-md px-5 sm:h-auto sm:rounded-none sm:px-6 bg-brand hover:bg-brand/90 active:bg-accent focus:bg-accent active:scale-95 transition-all text-brand-foreground text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {t("Subscribing…")}
                      </>
                    ) : (
                      <>
                        {t("Subscribe")}
                        <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <p id={errorId} role="alert" className="mt-2 text-xs text-destructive">
                    {t(error)}
                  </p>
                )}

                <p className="text-[11px] text-muted-foreground mt-3 leading-relaxed">
                  {t("By subscribing you agree to our")}{" "}
                  <Link to="/privacy" className="link-inline text-accent">
                    {t("Privacy Notice")}
                  </Link>
                  . {t("Unsubscribe anytime.")}
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
