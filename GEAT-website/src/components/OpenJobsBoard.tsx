import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cog,
  Layers,
  MapPin,
  Monitor,
  Package,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  XCircle,
} from "lucide-react";

import { retryPolicy } from "@/api/client";
import { fetchJobs, type JobQueryFilters } from "@/api/jobs";
import type { JobListItem } from "@/api/types";
import { useJobFacetsQuery } from "@/hooks/useJobs";
import { useReferenceData } from "@/hooks/useReferenceData";
import type { MetaVocabulary } from "@/api/types";
import { useLanguage, useT } from "@/i18n/LanguageContext";

/**
 * The four filter dimensions the API actually backs.
 *
 * GET /api/jobs/facets returns exactly these four, and they are the only
 * filters GET /api/jobs accepts. The pre-API board also offered Experience and
 * Education; neither exists in the job payload nor in the facets, so they are
 * not rendered rather than being faked client-side.
 */
export type JobFacetKey = "profession" | "department" | "contract" | "location";

type FacetGroup = {
  key: JobFacetKey;
  /** English source string, translated through t(). */
  label: string;
  /** Which /api/meta vocabulary supplies this dimension's labels. */
  vocabulary: MetaVocabulary;
  values: { key: string; count: number }[];
};

/**
 * One value per dimension.
 *
 * The API returns HTTP 500 when a filter parameter is repeated
 * (?profession=it&profession=maintenance), so the board can only ever send a
 * single value per dimension. Selecting a second value replaces the first.
 */
type Selection = Partial<Record<JobFacetKey, string>>;

/**
 * Jobs are fetched a page at a time, but the board paginates in the browser so
 * that a field page restricted to several departments (which needs one request
 * per department, again because of the repeated-parameter limit) can show one
 * merged list. 100 is comfortably above the real posting count; if the board
 * ever exceeds it the count line will under-report, which is why `total` is
 * checked against what arrived.
 */
const FETCH_PAGE_SIZE = 100;

/** Icons are chosen from the API's department keys, never from a label. */
const departmentIcons: Record<string, typeof Cog> = {
  production: Cog,
  maintenance: Wrench,
  repair: Wrench,
  it: Monitor,
  finance: Calculator,
  rh: Users,
  qualite: ShieldCheck,
  ehs: ShieldCheck,
  juridique: ShieldCheck,
  sourcing: Package,
  planification: Package,
  project_mgmt: Layers,
  grid: Cog,
  electricite: Cog,
  mecanique: Cog,
  electrotechnique: Cog,
  fm: Package,
};

const FilterDropdown = ({
  label,
  values,
  picked,
  onPick,
}: {
  label: string;
  values: { key: string; label: string; count: number }[];
  picked: string | undefined;
  onPick: (value: string) => void;
}) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pickedLabel = values.find((value) => value.key === picked)?.label;

  return (
    <div
      ref={ref}
      className="relative"
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !open) return;
        setOpen(false);
        triggerRef.current?.focus();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={open ? listId : undefined}
        disabled={values.length === 0}
        onClick={() => setOpen((o) => !o)}
        className="font-body flex h-12 w-full items-center justify-between gap-2 rounded-md bg-card px-4 text-left text-sm font-semibold text-foreground shadow-sm transition-shadow hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="truncate">
          {t(label)}
          {pickedLabel && (
            <span className="ml-2 font-normal text-muted-foreground">· {pickedLabel}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 flex-none text-primary transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-30 max-h-72 w-full min-w-[15rem] overflow-y-auto rounded-md border border-border bg-card py-2 shadow-xl"
        >
          {values.map((value) => {
            const selected = value.key === picked;
            return (
              <li key={value.key}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onPick(value.key);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`font-body flex min-h-11 w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-muted ${
                    selected ? "font-bold text-foreground" : "text-foreground"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border transition-colors ${
                      selected ? "border-brand-edge bg-brand" : "border-input bg-card"
                    }`}
                  >
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                  </span>
                  <span className="flex-1">{value.label}</span>
                  <span className="text-xs text-muted-foreground">{value.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const JobCardSkeleton = () => (
  <div className="flex animate-pulse flex-col gap-4 rounded-[8px] border border-border bg-card p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
    <span className="h-11 w-11 flex-none rounded-full bg-muted sm:h-16 sm:w-16" />
    <div className="min-w-0 flex-1 space-y-3">
      <div className="h-5 w-2/3 rounded bg-muted" />
      <div className="h-4 w-1/3 rounded bg-muted" />
      <div className="h-4 w-1/2 rounded bg-muted" />
    </div>
  </div>
);

const OpenJobsBoard = ({
  perPageDefault = 3,
  departmentKeys,
}: {
  perPageDefault?: number;
  /**
   * Restricts the board to these API department keys (used by the career-field
   * pages). One request is issued per key, because the API cannot take a
   * repeated filter parameter.
   */
  departmentKeys?: string[];
}) => {
  const t = useT();
  const { lang } = useLanguage();
  const { label } = useReferenceData();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selected, setSelected] = useState<Selection>({});
  const [page, setPage] = useState(1);
  const perPage = perPageDefault;

  // Keystrokes should not each cost a request.
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  const facetsQuery = useJobFacetsQuery();

  /**
   * One filter combination per pinned department, or a single combination when
   * the board is unrestricted.
   */
  const combinations = useMemo<JobQueryFilters[]>(() => {
    const base: JobQueryFilters = {
      q: debouncedQuery || undefined,
      profession: selected.profession ? [selected.profession] : undefined,
      contract: selected.contract ? [selected.contract] : undefined,
      location: selected.location ? [selected.location] : undefined,
      page: 1,
      pageSize: FETCH_PAGE_SIZE,
    };

    if (departmentKeys?.length) {
      // A department picked in the dropdown narrows the pinned set rather than
      // widening it, so an unrelated pick correctly yields nothing.
      const keys = selected.department
        ? departmentKeys.filter((key) => key === selected.department)
        : departmentKeys;
      return keys.map((key) => ({ ...base, department: [key] }));
    }

    return [{ ...base, department: selected.department ? [selected.department] : undefined }];
  }, [debouncedQuery, selected, departmentKeys]);

  const jobQueries = useQueries({
    queries: combinations.map((filters) => ({
      queryKey: ["jobs", lang, filters] as const,
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchJobs(lang, filters, signal),
      staleTime: 60_000,
      retry: retryPolicy,
      placeholderData: (previous: unknown) => previous,
    })),
  });

  const isLoading = jobQueries.some((result) => result.isLoading);
  const isError = jobQueries.every((result) => result.isError) && jobQueries.length > 0;
  const refetchAll = () => jobQueries.forEach((result) => result.refetch());

  /** Merge the combinations, de-duplicating by id, keeping newest first. */
  const jobs = useMemo(() => {
    const seen = new Map<string, JobListItem>();
    for (const result of jobQueries) {
      for (const job of result.data?.items ?? []) if (!seen.has(job.id)) seen.set(job.id, job);
    }
    return [...seen.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobQueries.map((result) => result.dataUpdatedAt).join("|")]);

  const facetGroups = useMemo<FacetGroup[]>(() => {
    const facets = facetsQuery.data;
    if (!facets) return [];
    return [
      { key: "profession", label: "Profession", vocabulary: "professions", values: facets.professions ?? [] },
      { key: "department", label: "Department", vocabulary: "departments", values: facets.departments ?? [] },
      { key: "contract", label: "Contract", vocabulary: "contracts", values: facets.contracts ?? [] },
      { key: "location", label: "Location", vocabulary: "locations", values: facets.locations ?? [] },
    ];
  }, [facetsQuery.data]);

  useEffect(() => setPage(1), [debouncedQuery, selected, perPage]);

  const totalPages = Math.max(1, Math.ceil(jobs.length / perPage));
  const current = jobs.slice((page - 1) * perPage, page * perPage);

  const pick = (key: JobFacetKey, value: string) =>
    setSelected((prev) => ({ ...prev, [key]: prev[key] === value ? undefined : value }));

  const reset = () => {
    setQuery("");
    setDebouncedQuery("");
    setSelected({});
  };

  const hasFilters = Boolean(debouncedQuery) || Object.values(selected).some(Boolean);

  return (
    <div className="font-body">
      {/* Filter panel */}
      <div className="reveal surface-dark rounded-lg bg-geat-dark p-7 lg:p-10">
        {/* h2, not h3: the board is always mounted directly under the page h1
            (/careers/jobs) or under a section h2, so an h3 here skipped a level. */}
        <h2 className="font-heading text-xl font-bold text-foreground lg:text-2xl">
          {t("Find the right opportunity")}
        </h2>

        <div className="relative mt-6 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="job-keywords"
            value={query}
            maxLength={120}
            aria-label={t("Search jobs")}
            placeholder={t("Search by keyword, job title or job ID")}
            onChange={(e) => setQuery(e.target.value)}
            className="font-body h-14 w-full rounded-md bg-card pl-11 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facetGroups.map((group) => (
            <FilterDropdown
              key={group.key}
              label={group.label}
              values={group.values.map((value) => ({
                key: value.key,
                label: label(group.vocabulary, value.key) || value.key,
                count: value.count,
              }))}
              picked={selected[group.key]}
              onPick={(value) => pick(group.key, value)}
            />
          ))}
          {facetsQuery.isLoading &&
            Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-card/40" />
            ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={reset}
            disabled={!hasFilters}
            className="font-body tap-target gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <XCircle className="h-4 w-4" />
            {t("Clear filters")}
          </button>
        </div>
      </div>

      {/* Results header */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-1 sm:px-2">
        <p className="font-body text-base text-foreground" aria-live="polite">
          {isLoading ? (
            t("Loading opportunities…")
          ) : (
            <>
              <span className="font-bold text-foreground">{jobs.length}</span>{" "}
              {t("opportunities available")}
            </>
          )}
        </p>
      </div>

      {/* Job cards */}
      <div className="mt-5 space-y-4">
        {isLoading && Array.from({ length: Math.min(perPage, 3) }, (_, i) => <JobCardSkeleton key={i} />)}

        {!isLoading && isError && (
          <div className="rounded-lg border border-border bg-card p-10 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-primary" />
            <p className="font-heading mt-4 text-lg font-bold text-foreground">
              {t("Open positions cannot be loaded right now")}
            </p>
            <p className="font-body mt-2 text-sm text-muted-foreground">
              {t("We could not reach the recruitment service. Please try again in a moment.")}
            </p>
            <button
              type="button"
              onClick={refetchAll}
              className="font-body tap-target mt-5 rounded-full border-2 border-brand-edge px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              {t("Try again")}
            </button>
          </div>
        )}

        {!isLoading &&
          !isError &&
          current.map((job) => {
            const Icon = departmentIcons[job.department ?? ""] ?? Briefcase;
            const locationLabels = job.locations
              .map((key) => label("locations", key))
              .filter(Boolean)
              .join(" · ");
            const departmentLabel = label("departments", job.department);
            const contractLabel = label("contracts", job.contract);
            const levelLabel = label("professional-levels", job.level);
            return (
              <article
                key={job.id}
                className="flex flex-col gap-4 rounded-[8px] border border-border bg-card p-5 transition-all duration-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-6 sm:p-6"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
                  <Icon className="h-5 w-5 text-primary sm:h-7 sm:w-7" />
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-lg font-bold sm:text-xl">
                    <Link
                      to={`/careers/jobs/${job.slug}`}
                      className="tap-target text-foreground transition-colors hover:text-accent"
                    >
                      {job.title}
                    </Link>
                  </h3>

                  {(departmentLabel || locationLabels) && (
                    <p className="font-body text-sm text-muted-foreground">
                      {[departmentLabel, locationLabels].filter(Boolean).join(" • ")}
                    </p>
                  )}

                  <div className="font-body mt-2.5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {contractLabel && (
                      <span className="inline-flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        {contractLabel}
                      </span>
                    )}
                    {levelLabel && (
                      <span className="inline-flex items-center gap-2">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        {levelLabel}
                      </span>
                    )}
                    {locationLabels && (
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {locationLabels}
                      </span>
                    )}
                  </div>
                  <p className="font-body mt-2.5 text-sm text-muted-foreground">{job.reference}</p>
                </div>

                <Link
                  to={`/careers/jobs/${job.slug}`}
                  aria-label={`${t("View position")}: ${job.title}`}
                  className="group font-body tap-target flex-none gap-2 text-sm font-bold text-foreground"
                >
                  {t("View position")}
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </Link>
              </article>
            );
          })}

        {!isLoading && !isError && current.length === 0 && (
          <div className="rounded-lg bg-background p-10 text-center shadow-sm">
            <p className="font-heading text-lg font-bold text-foreground">
              {hasFilters ? t("No positions match your filters") : t("No open positions right now")}
            </p>
            <p className="font-body mt-2 text-sm text-muted-foreground">
              {hasFilters
                ? t("Try removing a filter or broadening your keywords.")
                : t("New opportunities are published regularly — please check back soon.")}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="font-body tap-target mt-5 rounded-full border-2 border-brand-edge px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-brand hover:text-brand-foreground"
              >
                {t("Clear filters")}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && !isError && jobs.length > perPage && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label={t("Previous page")}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="font-body flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-opacity disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page ? "page" : undefined}
              className={`font-body h-11 w-11 rounded-full text-sm font-bold shadow-sm transition-colors ${
                p === page
                  ? "bg-brand text-brand-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            aria-label={t("Next page")}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="font-body flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-opacity disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OpenJobsBoard;
