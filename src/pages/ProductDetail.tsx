import { ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCallback, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import KickerLabel from "@/components/KickerLabel";
import CountUpValue from "@/components/CountUpValue";
import NotFound from "@/pages/NotFound";
import { getProduct, products, psPath, type ItemGroup, type ListItem } from "@/data/products";
import { useDialog } from "@/hooks/useDialog";
import { useT } from "@/i18n/LanguageContext";

const GroupBlock = ({
  group,
  onVisualItemClick,
}: {
  group: ItemGroup;
  onVisualItemClick?: (item: ListItem) => void;
}) => {
  const t = useT();
  return (
  <div>
    <h2 className="font-heading text-2xl font-bold text-foreground lg:text-3xl">
      {t(group.title)}
    </h2>
    {group.intro && (
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {t(group.intro)}
      </p>
    )}

    {group.table ? (
      <div className="reveal mt-8 overflow-hidden border border-border/60">
        {/* header */}
        <div className="hidden bg-accent text-accent-foreground md:grid md:grid-cols-[7rem_1fr_18rem]">
          <div className="px-4 py-3 text-center font-heading text-xs font-bold uppercase tracking-widest">
            {group.codeLabel ? t(group.codeLabel) : t("Ref")}
          </div>
          <div className="px-4 py-3 font-heading text-xs font-bold uppercase tracking-widest">
            {t("Description")}
          </div>
          <div className="px-4 py-3 text-center font-heading text-xs font-bold uppercase tracking-widest">
            {t("Illustration")}
          </div>
        </div>
        {group.items.map((item, i) => (
          <div
            key={item.name}
            className={`grid grid-cols-1 items-center gap-4 border-t border-border/60 p-4 transition-colors md:grid-cols-[7rem_1fr_18rem] md:gap-0 md:p-0 ${
              i % 2 ? "bg-secondary/40" : "bg-background"
            } hover:bg-primary/5`}
          >
            <div className="font-heading text-sm font-bold text-foreground md:px-4 md:py-5 md:text-center">
              {item.code}
            </div>
            <div className="md:px-4 md:py-5">
              <h3 className="font-heading text-sm font-semibold text-foreground">
                {t(item.name)}
              </h3>
              {item.description && (
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {t(item.description)}
                </p>
              )}
            </div>
            <div className="md:px-4 md:py-3">
              {item.image ? (
                <div className="flex items-center justify-center border border-border/50 bg-background p-2">
                  <img
                    src={item.image}
                    alt={t(item.name)}
                    loading="lazy"
                    decoding="async"
                    className="h-28 w-full max-w-xs object-contain md:h-24"
                  />
                </div>
              ) : (
                <span className="block text-center text-xs text-muted-foreground/70">
                  —
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : group.visual ? (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item, i) => (
          <article
            key={item.name}
            onClick={() => onVisualItemClick?.(item)}
            onKeyDown={
              item.detail
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onVisualItemClick?.(item);
                    }
                  }
                : undefined
            }
            role={item.detail ? "button" : undefined}
            tabIndex={item.detail ? 0 : undefined}
            style={{ animationDelay: `${i * 90}ms`, transitionDelay: `${i * 90}ms` }}
            className={`reveal group overflow-hidden border border-border/60 bg-background transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-edge hover:shadow-xl ${
              item.detail ? "cursor-pointer" : ""
            }`}
          >
            {item.image && (
              <div
                className={`relative aspect-[4/3] overflow-hidden bg-secondary ${
                  group.imageContain ? "flex items-center justify-center p-4" : ""
                }`}
              >
                <img
                  src={item.image}
                  alt={t(item.name)}
                  loading="lazy"
                  decoding="async"
                  className={`transition-transform duration-700 group-hover:scale-105 ${
                    group.imageContain
                      ? "h-full w-full object-contain"
                      : "h-full w-full object-cover"
                  }`}
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            )}
            <div className="p-6">
              <h3 className="font-heading text-lg font-bold text-foreground">
                {t(item.name)}
              </h3>
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t(item.description)}
                </p>
              )}
              {item.detail && (
                <span className="mt-4 inline-flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("View overview")}
                  <ChevronRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-1" />
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    ) : (
      <ul className="mt-8 grid gap-x-8 gap-y-px sm:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => (
          <li
            key={item.name}
            className="reveal flex items-start gap-3 border-b border-border/60 py-4"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <span className="font-heading text-sm font-semibold text-foreground">
                {t(item.name)}
              </span>
              {item.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t(item.description)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
  );
};

const ProductDetail = () => {
  const t = useT();
  const { slug } = useParams();
  const entry = getProduct(slug);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeDialog = useCallback(() => setSelectedItem(null), []);

  /* Dialog behaviour: focus moves to the close button, Tab is trapped, body
     scroll is locked, Escape closes this dialog only, focus goes back to the
     card that opened it. */
  useDialog(dialogRef, {
    open: selectedItem !== null,
    onClose: closeDialog,
    modal: true,
    initialFocus: closeButtonRef,
  });

  if (!entry) return <NotFound />;

  const related = products.filter(
    (p) => p.category === entry.category && p.slug !== entry.slug,
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main id="main">
      <PageHero
        breadcrumb={t(entry.name)}
        breadcrumbTrail={[
          { label: t("Products & Services"), href: "/products-services" },
        ]}
        title={t(entry.name)}
        highlight={entry.model && t(entry.model)}
        subtitle={t(entry.summary)}
        image={entry.heroImage}
        imageAlt={t(entry.heroAlt)}
        primaryCta={{ label: t("Request information"), href: "/contact" }}
        secondaryCta={{ label: t("All products & services"), href: "/products-services" }}
      />

      {/* OVERVIEW */}
      <section className="section-y">
        <div className="section-container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="reveal">
              <KickerLabel label={entry.category} />
              <h2 className="mt-3 font-heading text-3xl font-bold text-foreground lg:text-4xl">
                {t("Overview")}
              </h2>
              <div className="mt-6 space-y-5">
                {entry.paragraphs.map((p) => (
                  <p key={p} className="text-base leading-relaxed text-muted-foreground">
                    {t(p)}
                  </p>
                ))}
              </div>

              {entry.badges && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {entry.badges.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      {t(b)}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {entry.showcaseImage && (
              <div className="reveal reveal-delay-2 relative">
                <div className="absolute -inset-4 -z-10 bg-secondary" />
                <img
                  src={entry.showcaseImage}
                  alt={entry.showcaseAlt ? t(entry.showcaseAlt) : t(entry.name)}
                  loading="lazy"
                  decoding="async"
                  className={`w-full ${
                    entry.showcaseContained
                      ? "object-contain p-6"
                      : "aspect-[4/3] object-cover"
                  }`}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* KEY FIGURES */}
      {entry.keyFigures && (
        <section className="surface-dark bg-geat-dark section-y-sm">
          <div className="section-container">
            <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
              {entry.keyFigures.map((f) => (
                <div
                  key={f.label}
                  className="reveal border-l-2 border-primary px-6 py-4 transition-transform duration-500 hover:-translate-y-1"
                >
                  <CountUpValue
                    value={f.value}
                    className="block font-heading text-3xl font-bold text-foreground lg:text-4xl"
                  />
                  <KickerLabel label={f.label} className="mt-2" />
                </div>

              ))}
            </div>
          </div>
        </section>
      )}

      {/* SPEC TABLE */}
      {entry.specTable && (
        <section className="bg-secondary section-y">
          <div className="section-container">
            <h2 className="section-head font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t(entry.specTable.title)}
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {entry.specTable.columns.map((col) => (
                <div
                  key={col.name}
                  className="reveal border border-border/60 bg-background p-8 transition-shadow hover:shadow-xl"
                >
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {t(col.name)}
                  </h3>
                  <div className="mt-1 h-0.5 w-12 bg-primary" />
                  <dl className="mt-6 space-y-4">
                    {col.rows.map((r) => (
                      <div
                        key={r.label}
                        className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3"
                      >
                        <dt className="text-sm text-muted-foreground">{t(r.label)}</dt>
                        <dd className="font-heading text-base font-bold text-foreground">
                          {t(r.value)}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GROUPS */}
      {entry.groups && (
        <section className="section-y">
          <div className="section-container space-y-16 lg:space-y-24">
            {entry.groups.map((g) => (
              <GroupBlock
                key={g.title}
                group={g}
                onVisualItemClick={(item) => {
                  if (item.detail) setSelectedItem(item);
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* RELATED */}
      {related.length > 0 && (
        <section className="bg-secondary section-y">
          <div className="section-container">
            <h2 className="section-head font-heading text-3xl font-bold text-foreground lg:text-4xl">
              {t("More in")} {t(entry.category)}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={psPath(p.slug)}
                  className="reveal group flex items-center gap-6 border border-border/60 bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-24 w-32 shrink-0 overflow-hidden bg-secondary">
                    <img
                      src={p.showcaseImage ?? p.heroImage}
                      alt={t(p.name)}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {t(p.name)}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {t(p.summary)}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                      {t("Discover")}
                      <ChevronRight className="h-3.5 w-3.5 text-primary transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-background section-y">
        <div className="section-container">
          <div className="surface-dark reveal relative overflow-hidden rounded-2xl bg-geat-dark p-8 shadow-2xl lg:p-12">
            {/* Ambient glows — decorative scrims with no descendants, so they
                need no surface-dark; the panel above already carries one. */}
            <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-geat-blue/15 blur-[140px]" />
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />

            <div className="relative z-10 flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                {/* KickerLabel carries the eyebrow's decoration itself — the
                    hand-rolled dot that used to lead this label is gone. */}
                <KickerLabel label="Contact us" />
                <h2 className="mt-4 font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-[2.5rem]">
                  {t("Talk to our")} {t(entry.name).toLowerCase()} {t("team")}
                </h2>
                <p className="mt-4 max-w-xl text-balance text-base leading-relaxed text-muted-foreground">
                  {t("Our engineers in Ain Yagout are ready to discuss your requirements, answer technical questions, and help you find the right solution for your energy project.")}
                </p>
              </div>

              <Link to="/contact" className="btn-cta group shrink-0 lg:px-8 lg:py-4">
                <span className="whitespace-nowrap">{t("Contact GEAT")}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* bottom accent line */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-geat-blue to-primary" />
          </div>
        </div>
      </section>

      {/* ITEM OVERVIEW MODAL */}
      {selectedItem && (
        <div
          className="surface-dark fixed inset-0 z-[100] flex items-center justify-center bg-geat-dark/80 p-4 backdrop-blur-sm"
          onClick={closeDialog}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-overview-title"
            className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto border border-border bg-card p-6 shadow-2xl lg:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={closeDialog}
              className="tap-target absolute right-2 top-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t("Close overview")}
            >
              <X className="h-6 w-6" />
            </button>

            {selectedItem.image && (
              <div className="mb-6 aspect-[16/9] overflow-hidden bg-secondary">
                <img
                  src={selectedItem.image}
                  alt={t(selectedItem.name)}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <KickerLabel label="Product overview" />
            <h3
              id="item-overview-title"
              className="mt-2 font-heading text-2xl font-bold text-foreground lg:text-3xl"
            >
              {t(selectedItem.name)}
            </h3>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              {selectedItem.detail && t(selectedItem.detail)}
            </p>

            <div className="mt-8 flex justify-end">
              <button onClick={closeDialog} className="btn-cta group">
                <span>{t("Close overview")}</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
