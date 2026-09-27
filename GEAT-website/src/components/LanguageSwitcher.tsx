import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useLanguage, type Lang } from "@/i18n/LanguageContext";

const options: { code: Lang; short: string; label: string }[] = [
  { code: "en", short: "EN", label: "English" },
  { code: "fr", short: "FR", label: "Français" },
];

const LanguageSwitcher = ({ className = "" }: { className?: string }) => {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  /* Escape closes the menu and hands focus back to the trigger. */
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /* Menu-button pattern: opening moves focus onto the selected option. */
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;
    const checked = menu.querySelector<HTMLElement>('[aria-checked="true"]');
    (checked ?? menu.querySelector<HTMLElement>('[role="menuitemradio"]'))?.focus();
  }, [open]);

  const current = options.find((o) => o.code === lang)!;

  const choose = (code: Lang) => {
    setLang(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("Select language")}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="language-menu"
        className="flex min-h-11 items-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-sm font-heading font-semibold text-foreground transition-colors hover:border-brand-edge hover:text-accent"
      >
        <Globe className="h-4 w-4 text-primary" />
        {current.short}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Unmounted while closed — the options used to stay focusable behind
          opacity-0, adding two invisible tab stops to the header. */}
      {open && (
        <div
          ref={menuRef}
          id="language-menu"
          role="menu"
          aria-label={t("Select language")}
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-popover shadow-lg animate-in fade-in slide-in-from-top-1 duration-200 ease-out"
        >
          {options.map((o) => (
            <button
              key={o.code}
              type="button"
              role="menuitemradio"
              aria-checked={lang === o.code}
              onClick={() => choose(o.code)}
              className={`flex min-h-11 w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-popover-foreground transition-colors hover:bg-muted ${
                lang === o.code ? "font-semibold" : ""
              }`}
            >
              <span className="w-6 font-heading font-bold">{o.short}</span>
              <span className="flex-1">{o.label}</span>
              {lang === o.code && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
