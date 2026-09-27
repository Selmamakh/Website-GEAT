/**
 * react-query hooks for the HRIS job endpoints.
 *
 * The active UI language is part of every query key, so switching language
 * refetches instead of serving the previous language from cache.
 */

import { useQueries, useQuery } from "@tanstack/react-query";

import { retryPolicy } from "@/api/client";
import { fetchJob, fetchJobFacets, fetchJobs, type JobQueryFilters } from "@/api/jobs";
import { useLanguage } from "@/i18n/LanguageContext";

/** Job postings change during the day but not by the second. */
const JOB_STALE_TIME = 60_000;

export const jobsQueryKey = (lang: string, filters: JobQueryFilters) =>
  ["jobs", lang, filters] as const;

export const useJobsQuery = (filters: JobQueryFilters = {}, enabled = true) => {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: jobsQueryKey(lang, filters),
    queryFn: ({ signal }) => fetchJobs(lang, filters, signal),
    staleTime: JOB_STALE_TIME,
    retry: retryPolicy,
    enabled,
    // Keeps the previous page on screen while the next one loads, so the board
    // does not collapse to skeletons on every filter change.
    placeholderData: (previous) => previous,
  });
};

export const useJobFacetsQuery = () => {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["jobs", "facets", lang] as const,
    queryFn: ({ signal }) => fetchJobFacets(lang, signal),
    staleTime: JOB_STALE_TIME,
    retry: retryPolicy,
  });
};

/**
 * How many published offers sit in these departments.
 *
 * One request per key: the API returns HTTP 500 if a filter parameter is
 * repeated, so several departments cannot be asked for in one call. A job
 * carries a single department, so the totals sum without double-counting.
 * Only `total` is read, hence pageSize 1.
 */
export const useJobCountByDepartments = (departmentKeys: string[]) => {
  const { lang } = useLanguage();

  const results = useQueries({
    queries: departmentKeys.map((key) => ({
      queryKey: ["jobs", "count", lang, key] as const,
      queryFn: ({ signal }: { signal: AbortSignal }) =>
        fetchJobs(lang, { department: [key], page: 1, pageSize: 1 }, signal),
      staleTime: JOB_STALE_TIME,
      retry: retryPolicy,
    })),
  });

  if (departmentKeys.length === 0) return { count: 0, isLoading: false };
  return {
    count: results.reduce((sum, result) => sum + (result.data?.total ?? 0), 0),
    isLoading: results.some((result) => result.isLoading),
  };
};

export const useJobQuery = (idOrSlug: string | undefined) => {
  const { lang } = useLanguage();
  return useQuery({
    queryKey: ["job", idOrSlug ?? "", lang] as const,
    queryFn: ({ signal }) => fetchJob(idOrSlug as string, lang, signal),
    enabled: Boolean(idOrSlug),
    staleTime: JOB_STALE_TIME,
    retry: retryPolicy,
  });
};
