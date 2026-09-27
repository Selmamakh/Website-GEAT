import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";

/**
 * The one field primitive used by every GEAT form (Contact, Job Application,
 * Spontaneous Application, Application Status).
 *
 * It owns the parts that were previously missing everywhere: the label/control
 * binding, `aria-invalid`, `aria-describedby`, `aria-required`, and an error
 * state that is carried by a 2px destructive border and an icon as well as by
 * colour.
 *
 * ---------------------------------------------------------------------------
 * ONE FIELD DESIGN
 * ---------------------------------------------------------------------------
 * There used to be two. /contact rendered an underline field (h-11, no box,
 * `border-b` only) and overrode the error affordance with a bottom rule, while
 * the two application forms rendered a boxed field from a class string that
 * was duplicated verbatim in three files. Same site, same primitive, two
 * different controls and two different ways of saying "this is wrong".
 *
 * The boxed shape won — it is what two of the three forms already used and it
 * matches the shape of every shadcn primitive underneath. It now lives here,
 * once, and the caller no longer chooses it: it picks a `control` shape and
 * FormField supplies the classes. `controlClass` is additive only.
 *
 * The control itself is still supplied as a render function, because the same
 * primitive has to wrap a native <input>, <textarea> and <select>, a shadcn
 * <Input>/<Textarea>, a Radix <SelectTrigger> (a compound component that
 * cannot be rendered from a prop bag) and an sr-only file picker.
 */

/** Boxed text-like control: 48px tall, matches every other field on the site. */
export const FIELD_INPUT_CLASS =
  "h-12 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-brand-edge";

/** Same box, free height, for multi-line controls. */
export const FIELD_TEXTAREA_CLASS =
  "w-full rounded-lg border border-input bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-brand-edge";

/**
 * The single invalid affordance. Not colour alone: the border also doubles in
 * width, and FieldError adds an icon next to the message.
 */
export const FIELD_INVALID_CLASS = "border-2 border-destructive";

/**
 * A 16px consent checkbox with a 44x44 activation area.
 *
 * The mark has to stay 16px: the coarse-pointer floor in index.css gives every
 * `input[type="checkbox"]` `min-height: var(--tap)`, which rendered the box 16
 * wide by 44 tall, so `min-h-4` caps it back — and capping it left the target at
 * 16x16. Pseudo-elements do not render on <input>, so the missing 28px comes
 * from a real overlay element instead. It works because it lives inside the
 * <label> that owns the checkbox: a press on the overlay activates the label,
 * and the label forwards to its control.
 *
 *   <label htmlFor="confirmed">
 *     <span className={CHECKBOX_TAP_WRAP_CLASS}>
 *       <input id="confirmed" type="checkbox" className="h-4 w-4 min-h-4 accent-primary" />
 *       <span aria-hidden="true" className={CHECKBOX_TAP_AREA_CLASS} />
 *     </span>
 *     <span>…consent text…</span>
 *   </label>
 */
export const CHECKBOX_TAP_WRAP_CLASS = "relative mt-0.5 flex h-4 w-4 shrink-0";
export const CHECKBOX_TAP_AREA_CLASS = "absolute -inset-3.5";

export type FieldControlShape = "input" | "textarea" | "custom";

export interface FieldControlProps {
  id: string;
  className: string;
  "aria-invalid": true | undefined;
  "aria-describedby": string | undefined;
  "aria-required": true | undefined;
}

export interface FieldControlState {
  invalid: boolean;
}

interface FormFieldProps {
  /** Also the id of the control the render function receives. */
  id: string;
  label: string;
  required?: boolean;
  /** Already-translated message. Empty / undefined means valid. */
  error?: string;
  /** Already-translated helper text rendered under the label. */
  hint?: string;
  /**
   * Which of the site's field shapes this control is.
   *   "input"    — the boxed 48px control (default). Text inputs, selects,
   *                Radix select triggers.
   *   "textarea" — the same box, free height.
   *   "custom"   — no shape at all. Only for controls that are not visible
   *                themselves, i.e. the sr-only file picker whose <label> is
   *                the real target.
   */
  control?: FieldControlShape;
  /**
   * Extra classes appended to the shape above — spacing or grid placement for
   * a one-off. NOT a way to redefine the field: the shape is merged first, so
   * this is additive. If you find yourself passing a height, a radius or a
   * border here, change FIELD_INPUT_CLASS instead so the whole site moves.
   */
  controlClass?: string;
  className?: string;
  labelClassName?: string;
  children: (control: FieldControlProps, state: FieldControlState) => React.ReactNode;
}

/**
 * The required marker. Destructive, not primary: on a light ground the brand
 * amber is a fill colour, never text (see the --primary note in index.css), and
 * a 12px asterisk is the smallest text on the form.
 */
export const REQUIRED_MARK_CLASS = "text-destructive";

const SHAPE_CLASS: Record<FieldControlShape, string> = {
  input: FIELD_INPUT_CLASS,
  textarea: FIELD_TEXTAREA_CLASS,
  custom: "",
};

/**
 * The error slot for one control.
 *
 * It is rendered whether or not there is a message. A live region that is
 * inserted into the DOM at the same moment as its content is not announced —
 * assistive tech has to be observing the node before the text lands in it — so
 * the <p> is always present and only its children come and go. Empty, it is a
 * flex container with no line box and therefore zero height; the top margin
 * only appears with a message, so nothing shifts.
 *
 * Exported because the two consent controls (the /contact communications radio
 * group, the application-form confirmation checkbox) are not FormFields but
 * must say "this is wrong" in exactly the same way.
 */
export const FieldError = ({
  id,
  message,
  className,
}: {
  id: string;
  /** Already-translated message. Empty / undefined renders an empty region. */
  message?: string;
  className?: string;
}) => (
  <p
    id={id}
    aria-live="polite"
    className={cn(
      "flex items-start gap-1.5 text-xs font-medium text-destructive",
      message && "mt-2",
      className,
    )}
  >
    {message ? (
      <>
        <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </>
    ) : null}
  </p>
);

const FormField = ({
  id,
  label,
  required,
  error,
  hint,
  control = "input",
  controlClass,
  className,
  labelClassName,
  children,
}: FormFieldProps) => {
  const invalid = Boolean(error);
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  /* The error region is permanent, so it can always be described. */
  const describedBy = [hint ? hintId : null, errorId].filter(Boolean).join(" ");

  return (
    <div className={className}>
      <label
        className={cn("mb-2 block text-sm font-medium text-foreground", labelClassName)}
        htmlFor={id}
      >
        {label}
        {required && (
          <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>
            {" *"}
          </span>
        )}
      </label>

      {hint && (
        <p id={hintId} className="mb-2 text-xs text-muted-foreground">
          {hint}
        </p>
      )}

      {children(
        {
          id,
          className: cn(
            SHAPE_CLASS[control],
            controlClass,
            invalid && control !== "custom" && FIELD_INVALID_CLASS,
          ),
          "aria-invalid": invalid || undefined,
          "aria-describedby": describedBy || undefined,
          "aria-required": required || undefined,
        },
        { invalid },
      )}

      <FieldError id={errorId} message={error} />
    </div>
  );
};

/** "* required" legend. Every GEAT form shows it once, above the first field. */
export const FormRequiredLegend = ({ className }: { className?: string }) => {
  const t = useT();
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      <span aria-hidden="true" className={REQUIRED_MARK_CLASS}>
        *
      </span>{" "}
      {t("required")}
    </p>
  );
};

export interface FormErrorItem {
  /** id of the control focused when the entry is activated. */
  id: string;
  /** Already-translated message. */
  message: string;
}

const focusField = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  event.preventDefault();
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  el.focus({ preventScroll: true });
};

/**
 * Submit-time summary. Rendered at the top of the form and focused, so a user
 * who submits an empty form lands on one list instead of hunting for eight
 * scattered red messages.
 *
 * It is `tabIndex={-1}` so `summaryRef.current.focus()` in the page's submit
 * effect actually lands, and every anchor points at an id a control really
 * carries (verified per form: the Radix select triggers on /contact take the
 * id from FormField, `comm-yes` is the first radio, `cv` is the file input
 * behind its label, `confirmed` is the checkbox).
 */
export const FormErrorSummary = React.forwardRef<
  HTMLDivElement,
  { errors: FormErrorItem[]; className?: string }
>(({ errors, className }, ref) => {
  const t = useT();
  if (errors.length === 0) return null;

  return (
    <div
      ref={ref}
      role="alert"
      tabIndex={-1}
      className={cn("rounded-lg border-2 border-destructive bg-destructive/5 p-4", className)}
    >
      <p className="flex items-center gap-2 font-heading text-sm font-semibold text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
        {t("Please fix the following before submitting")}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-9 text-sm text-destructive">
        {errors.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="link-inline" onClick={(e) => focusField(e, item.id)}>
              {item.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});
FormErrorSummary.displayName = "FormErrorSummary";

export default FormField;
