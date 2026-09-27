import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  ArrowUpRight,
  ArrowRight,
  Check,
  Search,
  HelpCircle,
  Shield,
  Lock,
  FileText,
  UserRound,
  BriefcaseBusiness,
  MessageSquare,
  ClipboardList,
  Factory,
  Building2,
} from "lucide-react";
import geniAvatar from "@/assets/geat-logo-chat.jpg";
import geatLogo from "@/assets/geat-logo-header.png";
import type { JobListItem } from "@/api/types";
import { useJobsQuery } from "@/hooks/useJobs";
import { useReferenceData } from "@/hooks/useReferenceData";
import { useDialog } from "@/hooks/useDialog";
import { useT } from "@/i18n/LanguageContext";

type T = (s: string) => string;

type Msg = { role: "geni" | "user"; text: string; jobs?: string[] };

const SUGGESTIONS = [
  "What jobs are available?",
  "How can I apply?",
  "What is the recruitment process?",
  "Does GEAT offer internships?",
];

const QUICK_ACTIONS = [
  { label: "I'm looking for\na job", question: "I'm looking for a job", Icon: BriefcaseBusiness, tone: "text-primary" },
  { label: "Show me\nmanufacturing jobs", question: "Show me manufacturing jobs", Icon: Factory, tone: "text-accent" },
  { label: "Explore current\nopenings", question: "What jobs are available?", Icon: ClipboardList, tone: "text-success" },
  { label: "Tell me about\nGEAT", question: "Tell me about careers at GEAT", Icon: Building2, tone: "text-foreground" },
];

const answer = (raw: string, t: T, jobs: JobListItem[]): Msg => {
  const q = raw.toLowerCase();

  /* Contract is an API key, not a label: "internship" is the key behind
     Internship / Stage. */
  const openings = jobs.filter((j) => j.contract !== "internship");
  const internships = jobs.filter((j) => j.contract === "internship");

  if (/(intern|stage|graduat|student|pfe)/.test(q)) {
    return {
      role: "geni",
      text:
        internships.length > 0
          ? t("Yes. GEAT welcomes final-year students for graduation internships (PFE) in engineering, quality, finance and supply chain. We currently have {n} internship opening published:").replace("{n}", String(internships.length))
          : t("Yes — GEAT regularly welcomes final-year students for graduation internships (PFE). No internship offer is published right now, but you can apply spontaneously through any open position form."),
      jobs: internships.map((j) => j.slug),
    };
  }

  if (/(manufactur|production|workshop|assembly)/.test(q)) {
    const manufacturing = jobs.filter((j) =>
      /(production|qualite|maintenance|repair|mecanique|grid)/i.test(
        `${j.department ?? ""} ${j.profession ?? ""}`,
      ),
    );
    return {
      role: "geni",
      text:
        manufacturing.length > 0
          ? t("Here are our manufacturing and production related openings at the Batna industrial site:")
          : t("No manufacturing role is published at the moment, but new positions open regularly on our Batna industrial site."),
      jobs: manufacturing.slice(0, 5).map((j) => j.slug),
    };
  }

  if (/(apply|application|postuler|cv|resume|submit)/.test(q)) {
    return {
      role: "geni",
      text:
        t('Applying is simple: open the position that interests you, click "Apply Now", then complete the online form with your personal details, education, experience, skills, CV and cover letter. Once submitted you receive an application reference number to track your candidacy.'),
    };
  }

  if (/(process|recruit|steps|interview|hiring|entretien)/.test(q)) {
    return {
      role: "geni",
      text:
        t("The GEAT recruitment process has five steps:\n1. Online application\n2. CV screening by our talent team\n3. HR interview (motivation and background)\n4. Technical interview with the hiring manager\n5. Offer, medical check and onboarding\n\nYou can follow your application at any stage with Check Application Status."),
    };
  }

  if (/(job|position|opening|vacanc|opportunit|hiring now|offre|poste|recrut|looking for)/.test(q)) {
    return {
      role: "geni",
      text: t("We currently have {n} open positions across Manufacturing, Engineering, Quality, Finance and Services — mainly in Batna and Algiers. Here are the latest:").replace("{n}", String(openings.length)),
      jobs: openings.slice(0, 5).map((j) => j.slug),
    };
  }

  if (/(location|where|batna|algiers|alger|site|based)/.test(q)) {
    return {
      role: "geni",
      text:
        t("Our main industrial site is in Batna, where turbine manufacturing and assembly take place. We also have roles in Algiers and field-service assignments on customer power plants across Algeria."),
    };
  }

  if (/(salary|benefit|offer|advantage|package|avantage)/.test(q)) {
    return {
      role: "geni",
      text:
        t("GEAT offers a permanent contract, competitive compensation, health coverage, transport allowance, structured technical training, international exposure through our turbine technology partnerships and clear internal mobility paths. Exact packages are discussed during the interview stage."),
    };
  }

  if (/(career|geat|company|about|who)/.test(q)) {
    return {
      role: "geni",
      text:
        t("GEAT — General Electric Algeria Turbines — manufactures and services gas and steam turbines in Algeria. A career here means working on real energy infrastructure alongside experienced engineers, with continuous training, international standards and long-term development. Departments include Engineering, Manufacturing, Quality, Supply Chain, Finance and Services."),
    };
  }

  if (/(contact|hr|human resources|email|call)/.test(q)) {
    return {
      role: "geni",
      text:
        t("For any recruitment question you can reach our Talent Acquisition team through the Contact page of this website. Applications are only processed through the online application form."),
    };
  }

  return {
    role: "geni",
    text:
      t("I can help with open positions, how to apply, the recruitment process, internships, locations and what GEAT offers. Try one of the suggested questions below, or ask me about a specific department."),
  };
};

const ACCEPTED_KEY = "geni-accepted";
/* The launcher stack (teaser bubble + two pills + FAB) sits over page content
   in the bottom-right corner. It is shown once per session; after it has been
   read — or as soon as the visitor scrolls past the first viewport — it
   collapses to the bare 56px FAB so it stops covering page controls. */
const TEASER_KEY = "geni-teaser-seen";
const TEASER_MS = 9000;

/* What the assistant can actually help with.
   This list used to describe data Geni "may collect and process" — contact
   information, job interests, recruitment answers, application information —
   and the panel said GEAT recruiters would use it. None of that happens:
   messages live in React state and are discarded when the panel closes.
   Nothing is transmitted or stored, so the notice was claiming collection
   that does not exist. It now describes the assistant's scope instead. */
const DATA_POINTS = [
  { Icon: BriefcaseBusiness, label: "Current job openings and what they involve" },
  { Icon: ClipboardList, label: "How to apply and what the process looks like" },
  { Icon: MessageSquare, label: "Common questions about working at GEAT" },
  { Icon: UserRound, label: "Where to go next for anything it cannot answer" },
];

const todayLabel = () =>
  new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const timeLabel = () =>
  new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

type Step = 1 | 2 | 3;

const StepRail = ({ step, t }: { step: Step; t: T }) => {
  const items: { n: Step; label: string }[] = [
    { n: 1, label: t("Welcome") },
    { n: 2, label: t("Terms") },
    { n: 3, label: t("Start Chat") },
  ];
  return (
    <div className="flex items-start justify-center gap-2 px-5 pt-4">
      {items.map((it, i) => (
        <div key={it.n} className="flex items-start">
          <div className="flex w-20 flex-col items-center gap-1.5">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                step >= it.n ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {it.n}
            </span>
            <span
              className={`text-[11px] font-medium transition-colors duration-300 ${
                step >= it.n ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {it.label}
            </span>
          </div>
          {i < items.length - 1 && (
            <span
              className={`mt-3.5 h-px w-8 transition-colors duration-300 ${
                step > it.n ? "bg-accent" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const GeniChat = () => {
  /* One page of live postings backs the suggestions and the cards below. */
  const { data: jobsData } = useJobsQuery({ page: 1, pageSize: 50 });
  const jobs = jobsData?.items ?? [];
  const { label } = useReferenceData();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [accepted, setAccepted] = useState(() => {
    try {
      return sessionStorage.getItem(ACCEPTED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState<Step>(() => {
    try {
      return sessionStorage.getItem(ACCEPTED_KEY) === "true" ? 3 : 1;
    } catch {
      return 1;
    }
  });
  const [teaser, setTeaser] = useState(() => {
    try {
      return (
        sessionStorage.getItem(TEASER_KEY) !== "true" &&
        sessionStorage.getItem(ACCEPTED_KEY) !== "true"
      );
    } catch {
      return true;
    }
  });
  const [startedAt] = useState(() => `${todayLabel()} • ${timeLabel()}`);

  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(false);
  const acceptedRef = useRef(accepted);
  const pendingQuestionRef = useRef(pendingQuestion);

  useEffect(() => {
    acceptedRef.current = accepted;
  }, [accepted]);

  useEffect(() => {
    pendingQuestionRef.current = pendingQuestion;
  }, [pendingQuestion]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open && accepted) inputRef.current?.focus();
  }, [open, accepted, messages.length]);

  const send = (text: string) => {
    if (!acceptedRef.current) return;
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { role: "user", text: value }]);
    setInput("");
    window.setTimeout(() => {
      setMessages((prev) => [...prev, answer(value, t, jobs)]);
    }, 450);
  };

  const sendRef = useRef(send);
  sendRef.current = send;

  const dismissTeaser = () => {
    try {
      sessionStorage.setItem(TEASER_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setTeaser(false);
  };

  const dismissTeaserRef = useRef(dismissTeaser);
  dismissTeaserRef.current = dismissTeaser;

  /** Close the panel and hand focus back to the launcher that opened it. */
  const closePanel = () => {
    restoreFocusRef.current = true;
    setOpen(false);
  };

  const launch = (question?: string) => {
    dismissTeaser();
    setOpen(true);
    if (!question) return;
    if (acceptedRef.current) window.setTimeout(() => sendRef.current(question), 250);
    else setPendingQuestion(question);
  };

  const accept = () => {
    try {
      sessionStorage.setItem(ACCEPTED_KEY, "true");
    } catch {
      // ignore storage errors
    }
    setAccepted(true);
    setStep(3);

    window.setTimeout(() => {
      const question = pendingQuestionRef.current;
      if (question) {
        sendRef.current(question);
        setPendingQuestion(null);
      }
    }, 350);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      dismissTeaserRef.current();
      setOpen(true);
      const question = (e as CustomEvent<{ question?: string }>).detail?.question;
      if (acceptedRef.current) {
        if (question) window.setTimeout(() => sendRef.current(question), 250);
      } else if (question) {
        setPendingQuestion(question);
      }
    };
    window.addEventListener("geni:open", handler);
    return () => window.removeEventListener("geni:open", handler);
  }, []);

  /* Collapse the launcher stack to the bare FAB after its first view. */
  useEffect(() => {
    if (!teaser) return;
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) dismissTeaserRef.current();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const timer = window.setTimeout(() => dismissTeaserRef.current(), TEASER_MS);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, [teaser]);

  /* The chat is a docked, NON-MODAL surface: there is no backdrop and the page
     behind it stays fully interactive, so Tab must be allowed to leave.
     `modal: false` gives us Escape (through the shared stack, so only the
     topmost dialog closes) plus focus-in on open, and no Tab trap.
     Initial focus: the composer once the terms are accepted, otherwise the
     panel itself so its label is announced. */
  useDialog(panelRef, {
    open,
    onClose: closePanel,
    modal: false,
    initialFocus: accepted ? inputRef : panelRef,
  });

  /* Restore focus to the launcher when the panel is dismissed (not when a link
     inside it navigates away). */
  useEffect(() => {
    if (open || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    launcherRef.current?.focus();
  }, [open]);

  return (
    <>
      {/* A landmark, so the teaser copy is not orphaned outside every region
          (axe `region`, 1 node on each /careers page). */}
      {!open && (
        <aside
          aria-label={t("Careers assistant")}
          className="floating-widget fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2.5 sm:bottom-5 sm:right-5 sm:gap-3"
        >
          {teaser && (
            <div className="relative flex items-center gap-3 rounded-2xl rounded-br-sm bg-card px-5 py-4 pr-10 shadow-xl ring-1 ring-border">
              <p className="text-sm text-foreground">{t("Hi! Are you looking for a job?")}</p>
              <button
                onClick={dismissTeaser}
                aria-label={t("Dismiss message")}
                className="group tap-target absolute right-0 top-0"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-secondary group-hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          )}

          {teaser && (
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                onClick={() => launch("What jobs are available?")}
                className="tap-target gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg ring-1 ring-border transition-colors hover:text-accent hover:ring-brand-edge"
              >
                <Search className="h-4 w-4 text-primary" /> {t("Find a job")}
              </button>
              <button
                onClick={() => launch()}
                className="tap-target gap-2 rounded-full bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg ring-1 ring-border transition-colors hover:text-accent hover:ring-brand-edge"
              >
                <HelpCircle className="h-4 w-4 text-primary" /> {t("Ask a question")}
              </button>
            </div>
          )}

          <button
            ref={launcherRef}
            onClick={() => launch()}
            aria-label={t("Open Geni, the GEAT Careers Assistant")}
            aria-haspopup="dialog"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-xl transition-transform hover:scale-105"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        </aside>
      )}

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t("Geni, the GEAT Careers Assistant")}
          tabIndex={-1}
          className="fixed inset-x-3 bottom-3 z-50 flex max-h-[85vh] flex-col overflow-hidden rounded-2xl border border-border bg-secondary shadow-2xl sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[620px] sm:w-[400px]"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-border bg-card px-4 py-3">
            <img
              src={geniAvatar}
              alt=""
              width={28}
              height={28}
              loading="lazy"
              decoding="async"
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <p className="min-w-0 flex-1 truncate font-heading text-base font-semibold text-foreground">
              Geni
            </p>
            <img
              src={geatLogo}
              alt="GEAT"
              loading="lazy"
              decoding="async"
              className="h-6 w-auto shrink-0 object-contain"
            />
            <button
              onClick={closePanel}
              aria-label={t("Close chat")}
              className="group tap-target -my-2 -mr-2 shrink-0"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-muted group-hover:text-foreground">
                <X className="h-5 w-5" />
              </span>
            </button>
          </div>

          {step === 2 && <StepRail step={2} t={t} />}

          {/* STEP 1 — Welcome */}
          {step === 1 && (
            <div className="flex flex-1 animate-fade-in flex-col overflow-y-auto px-5 py-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src={geniAvatar}
                  alt=""
                  width={80}
                  height={80}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <p className="mt-3 font-heading text-2xl font-bold text-foreground">Geni</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("Your recruitment assistant at GEAT")}
                </p>
              </div>

              <div className="mt-6 space-y-3 rounded-xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground shadow-sm">
                <p>{t("👋 Hi! I'm Geni, GEAT's recruitment assistant.")}</p>
                <p>
                  {t("I can help you explore career opportunities, open positions, our culture, teams and more.")}
                </p>
                <p>
                  {t("Before we get started, please review and accept our")}{" "}
                  <span className="font-semibold text-foreground">{t("Terms of Use")}</span>.
                </p>
              </div>

              <button
                onClick={() => setStep(2)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground shadow-sm transition-opacity hover:opacity-90"
              >
                {t("Review Terms")} <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm text-muted-foreground">{t("What can you help me with?")}</span>
              </div>

              <p className="mt-auto pt-6 text-center text-[11px] leading-relaxed text-muted-foreground">
                <Shield className="mr-1 inline h-3.5 w-3.5" />
                {t("By continuing, you agree to GEAT's")}{" "}
                <span className="font-medium text-foreground">{t("Terms of Use")}</span> {t("and")}{" "}
                <span className="font-medium text-foreground">{t("Privacy Policy")}</span>.
              </p>
            </div>
          )}

          {/* STEP 2 — Terms */}
          {step === 2 && (
            <>
              <div className="flex-1 animate-fade-in overflow-y-auto px-4 pb-2 pt-4">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={geniAvatar}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                    <p className="font-heading text-base font-semibold text-foreground">
                      {t("Before we get started")}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    {t("Geni is a guide to our careers pages, not a recruiter. It can help you with:")}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {DATA_POINTS.map(({ Icon, label }) => (
                      <li key={label} className="flex items-center gap-2.5 text-sm text-foreground">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        {t(label)}
                      </li>
                    ))}
                  </ul>
                  {/* The honest statement of what happens to the conversation.
                      The previous wording told visitors recruiters would use
                      what they typed here, which was never true. */}
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {t("What you type here stays in your browser: it is not sent to GEAT, not stored, and not seen by our recruiters. To reach us, use the application form or the contact page.")}
                  </p>

                  <div className="mt-4 flex gap-3 rounded-xl border border-border bg-secondary p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-card text-muted-foreground ring-1 ring-border">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="text-sm">
                      <p className="leading-relaxed text-foreground">
                        {t("Please review the full Terms of Use to understand how your data is used.")}
                      </p>
                      {/* Now points at the real Terms of Use page. It went to
                          /careers/faq while no such page existed. */}
                      <Link
                        to="/terms"
                        onClick={() => setOpen(false)}
                        className="mt-1.5 inline-flex items-center gap-1 font-semibold text-accent hover:underline"
                      >
                        {t("View Terms of Use")} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-card px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={closePanel}
                    className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    {t("Decline")}
                  </button>
                  <button
                    onClick={accept}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-opacity hover:opacity-90"
                  >
                    <Check className="h-4 w-4" /> {t("Accept & Continue")}
                  </button>
                </div>
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" /> {t("Your data is safe with GEAT.")}
                </p>
              </div>
            </>
          )}

          {/* STEP 3 — Chat */}
          {step === 3 && accepted && (
            <>
              <div className="flex-1 animate-fade-in space-y-4 overflow-y-auto px-4 py-4">
                <div className="flex gap-3 rounded-xl border border-success/30 bg-success/5 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-bold text-success">{t("You're all set!")}</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground">
                      {t("Thanks for accepting GEAT's Terms of Use.")}
                      <br />
                      {t("I'm ready to help you explore opportunities at GEAT.")}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex items-start gap-2.5">
                    <img
                      src={geniAvatar}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                    <div className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground shadow-sm">
                      {t("How can I help you today?")}
                    </div>
                  </div>
                  <p className="mt-1.5 pl-10 text-[11px] text-muted-foreground">{startedAt}</p>
                </div>

                {/* Live region so incoming replies are announced to screen readers. */}
                <div className="space-y-4" aria-live="polite" aria-atomic="false">
                  {messages.map((m, i) => (
                    <div key={i} className="space-y-2">
                      {m.role === "user" ? (
                        <div className="flex justify-end">
                          <div className="max-w-[85%] rounded-xl bg-brand px-4 py-2.5 text-sm text-brand-foreground">
                            {m.text}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2.5">
                          <img
                            src={geniAvatar}
                            alt=""
                            width={28}
                            height={28}
                            loading="lazy"
                            decoding="async"
                            className="mt-0.5 h-7 w-7 shrink-0 rounded-full object-cover"
                          />
                          <div className="max-w-[88%] whitespace-pre-line rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm">
                            {m.text}
                          </div>
                        </div>
                      )}
                      {m.jobs && m.jobs.length > 0 && (
                        <ul className="space-y-2 pl-9">
                          {m.jobs.map((slug) => {
                            const job = jobs.find((j) => j.slug === slug);
                            if (!job) return null;
                            return (
                              <li key={slug}>
                                <Link
                                  to={`/careers/jobs/${job.slug}`}
                                  onClick={() => setOpen(false)}
                                  className="flex items-start justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:border-brand-edge"
                                >
                                  <span>
                                    <span className="block text-sm font-semibold text-foreground">
                                      {job.title}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                      {[
                                        label("departments", job.department),
                                        job.locations
                                          .map((key) => label("locations", key))
                                          .filter(Boolean)
                                          .join(" · "),
                                      ]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    </span>
                                  </span>
                                  <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {messages.length === 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {QUICK_ACTIONS.map(({ label, question, Icon, tone }) => (
                      <button
                        key={question}
                        onClick={() => send(question)}
                        className="flex flex-col items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-5 text-center text-sm font-semibold leading-snug text-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-edge hover:shadow-md"
                      >
                        <Icon className={`h-6 w-6 ${tone}`} />
                        <span className="whitespace-pre-line">{t(label)}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="tap-target rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-primary/5"
                      >
                        {t(s)}
                      </button>
                    ))}
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Composer */}
              <div className="border-t border-border bg-card px-3 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="relative"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t("Write a message...")}
                    className="h-12 w-full rounded-xl border border-border bg-card pl-4 pr-14 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-brand-edge"
                  />
                  <button
                    type="submit"
                    aria-label={t("Send message")}
                    className="group tap-target absolute right-1 top-1/2 -translate-y-1/2"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-brand-foreground transition-opacity group-hover:opacity-90">
                      <Send className="h-4 w-4" />
                    </span>
                  </button>
                </form>
                <p className="mt-2 text-center text-[11px] text-muted-foreground">
                  {/* Was "Geni provides AI-generated information", which is not
                      true: every reply below comes from the fixed rule set in
                      answer(). No model generates anything. */}
                  {t("Geni answers from a set of prepared responses. Please verify important details with GEAT.")}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default GeniChat;
