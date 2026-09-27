import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import geatLogo from "@/assets/geat-logo.png";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useDialog } from "@/hooks/useDialog";
import { useT } from "@/i18n/LanguageContext";

type NavChild = { label: string; href: string };
/** `href` is optional: a section without a landing page still gets a column. */
type NavCategory = { category: string; href?: string; items: NavChild[] };
type NavItem = {
  label: string;
  href?: string;
  children?: NavChild[];
  megaMenu?: NavCategory[];
};

const navItems: NavItem[] = [
  {
    label: "Company",
    children: [
      { label: "About us", href: "/about" },
      { label: "Leadership", href: "/leadership" },
    ],
  },
  {
    label: "Products & Services",
    megaMenu: [
      {
        category: "Products",
        href: "/products-services",
        items: [
          { label: "Gas Turbines", href: "/products-services/gas-turbines" },
          { label: "Steam Turbines", href: "/products-services/steam-turbines" },
          { label: "Auxiliaries", href: "/products-services/auxiliaries" },
        ],
      },
      {
        category: "Technologies & Solutions",
        href: "/products-services",
        items: [
          { label: "Control Systems", href: "/products-services/control-systems" },
          { label: "Grid Solutions", href: "/products-services/grid-solutions" },
          { label: "Digital Solutions", href: "/products-services/digital-solutions" },
        ],
      },
      {
        category: "Services",
        href: "/products-services",
        items: [
          { label: "Repair Services", href: "/products-services/repair-services" },
          { label: "Power Plant Maintenance", href: "/products-services/power-plant-maintenance" },
          { label: "Aero-Derivative Turbine Services", href: "/products-services/aero-derivative-turbine-services" },
        ],
      },
    ],
  },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Anything that navigates is an anchor: <Link> in-app, <a> off-site. */
const NavAnchor = ({
  href,
  className,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
  children,
}: {
  href: string;
  className?: string;
  onNavigate?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  children: ReactNode;
}) =>
  href.startsWith("/") ? (
    <Link
      to={href}
      className={className}
      onClick={onNavigate}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Link>
  ) : (
    <a
      href={href}
      className={className}
      onClick={onNavigate}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );

/**
 * One column of a desktop dropdown panel: a heading, a hairline rule, and the
 * destinations under it. BOTH panel shapes render through this.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS
 * ---------------------------------------------------------------------------
 * The header shipped two layouts for the same job. The mega menu drew
 * "heading + amber arrow, hairline rule, indented links" in a grid of columns.
 * The single-level dropdown drew "10px amber dot + heading, a hard-coded 96px
 * vertical rule, links to the right" — a different shape, a different
 * ornament, a different rule axis, and a heading that was dead text where the
 * mega menu's was a link.
 *
 * The dot was the visible symptom. It marked the only heading in its panel, so
 * it distinguished nothing, and a filled circle is the heaviest mark available
 * at 10px while the rest of the header's brand vocabulary — the trigger
 * underline, the hover underline sweep, the link arrows — is entirely linear.
 * A blob in a header made of lines.
 *
 * The mega-menu treatment won because it was already three of the four
 * instances and it carries information the other did not: the rule binds a
 * heading to its own list, and the arrow marks the heading as somewhere you
 * can actually go.
 *
 * `href` is optional because not every section has a landing page. Without one
 * the heading is plain text and gets NO arrow — an arrow with nothing behind
 * it promises a destination the panel cannot deliver. `min-h-11` on that
 * branch matches the linked branch's `.tap-target` box so the hairline rule
 * lands on the same baseline in every column.
 */
const NavPanelColumn = ({
  category,
  href,
  items,
  onNavigate,
}: {
  category: string;
  href?: string;
  items: NavChild[];
  onNavigate: () => void;
}) => {
  const t = useT();

  return (
    <div className="min-w-0">
      {href ? (
        <Link
          to={href}
          onClick={onNavigate}
          className="group/cat tap-target gap-2 font-heading text-lg font-bold text-foreground transition-colors hover:text-accent"
        >
          {t(category)}
          <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover/cat:translate-x-1" />
        </Link>
      ) : (
        <span className="inline-flex min-h-11 items-center font-heading text-lg font-bold text-foreground">
          {t(category)}
        </span>
      )}
      <div className="mt-1 h-px bg-border" />
      <ul className="mt-2 flex flex-col">
        {items.map((child) => (
          <li key={child.label}>
            <NavAnchor
              href={child.href}
              onNavigate={onNavigate}
              className="group/link flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-base font-heading text-foreground transition-colors hover:bg-muted/50 hover:text-accent"
            >
              {t(child.label)}
              <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100" />
            </NavAnchor>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Navbar = ({ showSearchJobs = false }: { showSearchJobs?: boolean }) => {
  const t = useT();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeDropdown = useCallback(() => {
    cancelClose();
    setOpenDropdown(null);
    setHoveredItem(null);
  }, [cancelClose]);

  /* Click outside the desktop nav closes whichever panel is open. */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [closeDropdown]);

  /* Escape closes the open dropdown and returns focus to its trigger. */
  useEffect(() => {
    if (!openDropdown) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const trigger = triggerRefs.current[openDropdown];
      closeDropdown();
      trigger?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openDropdown, closeDropdown]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  /* The only thing the drawer still owns here: hiding the floating widgets
     behind it (`body.menu-open .floating-widget` in index.css). Body-scroll
     lock, the Tab trap, Escape and focus restore all live in useDialog. */
  useEffect(() => {
    if (!mobileOpen) return;
    document.body.classList.add("menu-open");
    return () => document.body.classList.remove("menu-open");
  }, [mobileOpen]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileSection(null);
  }, []);

  /* The drawer declares aria-modal, so it behaves like one. */
  useDialog(drawerRef, { open: mobileOpen, onClose: closeMobile, modal: true });

  const renderDropdownItem = (item: NavItem) => {
    const isOpen = openDropdown === item.label;
    const panelId = `nav-panel-${slug(item.label)}`;
    const triggerId = `${panelId}-trigger`;

    const openMenu = () => {
      cancelClose();
      setOpenDropdown(item.label);
      setHoveredItem(item.label);
    };
    const scheduleClose = () => {
      cancelClose();
      closeTimerRef.current = setTimeout(() => {
        setOpenDropdown(null);
        setHoveredItem(null);
      }, 250);
    };

    const trigger = (
      <button
        type="button"
        id={triggerId}
        ref={(el) => {
          triggerRefs.current[item.label] = el;
        }}
        onClick={() => (isOpen ? closeDropdown() : openMenu())}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
        className="relative text-sm font-medium flex items-center gap-1 transition-colors py-2 text-foreground hover:text-accent"
      >
        {t(item.label)}
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        <span
          className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ease-out ${
            hoveredItem === item.label || isOpen ? "w-full" : "w-0"
          }`}
        />
      </button>
    );

    /* The panel is unmounted while closed, so nothing inside it can ever be
       tabbed to. (It used to stay in the DOM behind max-h-0/opacity-0, which
       parked 11 invisible tab stops in the middle of the header.) */
    const panelClass =
      "fixed left-0 right-0 top-16 lg:top-20 bg-card border-b border-border shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 ease-out";

    /* Both panel shapes are the same thing: a list of labelled columns. A
       single-level dropdown is a one-column panel. Normalising to one array
       here is what stops the two layouts drifting apart again — there is now
       a single grid and a single column renderer, so a change to one panel
       cannot miss the other. */
    const columns: NavCategory[] =
      item.megaMenu ??
      (item.children ? [{ category: item.label, href: item.href, items: item.children }] : []);

    return (
      <div
        key={item.label}
        className="relative"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
        onBlur={(e) => {
          /* Tabbing out of the trigger + panel closes it. relatedTarget is
             only trusted when it is a real node — a null relatedTarget (mouse
             press on a non-focusable target) is left to the outside-click and
             mouseleave handlers, so a click on a panel link is never eaten. */
          const next = e.relatedTarget as Node | null;
          if (next && !e.currentTarget.contains(next)) closeDropdown();
        }}
      >
        {trigger}

        {isOpen && columns.length > 0 && (
          <div id={panelId} onMouseEnter={cancelClose} onMouseLeave={scheduleClose} className={panelClass}>
            <div className="section-container py-10">
              {/* Every category side by side — one column each, at a readable
                  measure. No hover-to-switch, nothing hidden. A one-column
                  panel is the same grid with one child. */}
              <div className="grid max-w-5xl gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                {columns.map((cat) => (
                  <NavPanelColumn key={cat.category} {...cat} onNavigate={closeDropdown} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card">
      <a href="#main" className="skip-link">
        {t("Skip to content")}
      </a>

      <div className="section-container flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={geatLogo}
            alt="GEAT Logo"
            width={505}
            height={337}
            decoding="async"
            className="h-12 lg:h-16 w-auto"
          />
        </Link>

        <nav ref={navRef} aria-label={t("Primary")} className="hidden lg:flex items-center gap-8">
          {navItems.map((item) =>
            item.children || item.megaMenu ? (
              renderDropdownItem(item)
            ) : (
              <NavAnchor
                key={item.label}
                href={item.href!}
                onMouseEnter={() => setHoveredItem(item.label)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative text-sm font-medium text-foreground hover:text-accent transition-colors py-2"
              >
                {t(item.label)}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ease-out ${
                    hoveredItem === item.label ? "w-full" : "w-0"
                  }`}
                />
              </NavAnchor>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          {showSearchJobs && (
            <a
              href="#open-jobs"
              className="hidden lg:inline-flex items-center gap-1.5 bg-brand text-brand-foreground font-heading font-bold text-sm px-5 py-2 rounded-full hover:brightness-110 transition-all"
            >
              {t("Search Jobs")}
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
          <div className="h-6 w-px bg-border hidden sm:block" aria-hidden="true" />
          <LanguageSwitcher />
          <button
            type="button"
            className="lg:hidden tap-target -mr-2 text-foreground"
            aria-label={mobileOpen ? t("Close menu") : t("Open menu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer (right side). Unmounted while closed so it never parks
          off-screen focus stops on every page. */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside
            id="mobile-menu"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("Menu")}
            className="lg:hidden fixed top-0 right-0 z-50 h-[100dvh] w-[86vw] max-w-sm bg-background shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-300 ease-out"
          >
            <div className="flex items-center justify-between h-16 px-5 border-b border-border">
              <img src={geatLogo} alt="GEAT Logo" width={505} height={337} decoding="async" className="h-9 w-auto" />
              <button
                type="button"
                onClick={closeMobile}
                aria-label={t("Close menu")}
                className="tap-target -mr-2 text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav aria-label={t("Mobile")} className="flex-1 overflow-y-auto overscroll-contain">
              <Link
                to="/"
                onClick={closeMobile}
                className="w-full flex min-h-14 items-center justify-between px-5 border-b border-border text-left font-heading text-base font-semibold text-foreground active:bg-muted/60"
              >
                {t("Home")}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              {navItems.map((item) => {
                const groups: NavCategory[] | null = item.megaMenu ?? null;
                const flat = item.children ?? null;
                const expanded = mobileSection === item.label;
                const sectionId = `mobile-section-${slug(item.label)}`;

                if (!groups && !flat) {
                  return (
                    <NavAnchor
                      key={item.label}
                      href={item.href!}
                      onNavigate={closeMobile}
                      className="w-full flex min-h-14 items-center justify-between px-5 border-b border-border text-left font-heading text-base font-semibold text-foreground active:bg-muted/60"
                    >
                      {t(item.label)}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </NavAnchor>
                  );
                }

                return (
                  <div key={item.label} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setMobileSection(expanded ? null : item.label)}
                      aria-expanded={expanded}
                      aria-controls={sectionId}
                      className="w-full flex min-h-14 items-center justify-between px-5 text-left font-heading text-base font-semibold text-foreground active:bg-muted/60"
                    >
                      {t(item.label)}
                      <ChevronDown
                        className={`h-5 w-5 text-primary transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    {expanded && (
                      <div
                        id={sectionId}
                        className="bg-muted/40 px-5 pb-4 animate-in fade-in slide-in-from-top-1 duration-200"
                      >
                        {groups
                          ? groups.map((cat) => (
                              <div key={cat.category} className="pt-3">
                                <span className="block py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                  {t(cat.category)}
                                </span>
                                {cat.items.map((child) => (
                                  <NavAnchor
                                    key={child.label}
                                    href={child.href}
                                    onNavigate={closeMobile}
                                    className="w-full flex min-h-11 items-center justify-between text-left text-[15px] text-foreground active:text-accent"
                                  >
                                    {t(child.label)}
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                  </NavAnchor>
                                ))}
                              </div>
                            ))
                          : flat!.map((child) => (
                              <NavAnchor
                                key={child.label}
                                href={child.href}
                                onNavigate={closeMobile}
                                className="w-full flex min-h-12 items-center justify-between text-left text-[15px] text-foreground active:text-accent"
                              >
                                {t(child.label)}
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              </NavAnchor>
                            ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="p-5">
                <Link
                  to={showSearchJobs ? "/careers/jobs" : "/careers"}
                  onClick={closeMobile}
                  className="btn-cta w-full"
                >
                  {t("Search Jobs")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </nav>
          </aside>
        </>
      )}
    </header>
  );
};

export default Navbar;
