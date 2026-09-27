/**
 * Reference-data layer: turns the API's vocabulary keys into display labels.
 *
 * The API speaks lowercase keys ("batna", "cdi", "it"); everything rendered
 * must be a label, and every filter value sent back must be a key. The
 * /api/meta/* endpoints are the only source of labels — a key is never
 * humanised client-side ("gas_turbines" -> "Gas Turbines"), because doing that
 * silently drops the French label, which is the whole reason these endpoints
 * exist.
 *
 * The vocabularies change very rarely and are not language-scoped (each entry
 * carries both labelEn and labelFr), so they are fetched once per session and
 * never refetched.
 */

import { useCallback, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import { fetchMeta } from "@/api/jobs";
import { retryPolicy } from "@/api/client";
import { META_VOCABULARIES, type MetaItem, type MetaVocabulary } from "@/api/types";
import { useLanguage } from "@/i18n/LanguageContext";

export const metaQueryKey = (vocabulary: MetaVocabulary) => ["meta", vocabulary] as const;

export type LabelLookup = (vocabulary: MetaVocabulary, key: string | null | undefined) => string;

export type ReferenceData = {
  /** key -> label in the active language. Returns "" for a null/unknown key. */
  label: LabelLookup;
  /** Every entry of a vocabulary, in API order, labelled for the active language. */
  options: (vocabulary: MetaVocabulary) => { key: string; label: string }[];
  isLoading: boolean;
  isError: boolean;
};

export const useReferenceData = (): ReferenceData => {
  const { lang } = useLanguage();

  const results = useQueries({
    queries: META_VOCABULARIES.map((vocabulary) => ({
      queryKey: metaQueryKey(vocabulary),
      queryFn: ({ signal }: { signal: AbortSignal }) => fetchMeta(vocabulary, signal),
      staleTime: Infinity,
      gcTime: Infinity,
      retry: retryPolicy,
    })),
  });

  // useQueries returns a fresh array every render, so the map is rebuilt only
  // when a vocabulary actually resolves.
  const settledAt = results.map((result) => result.dataUpdatedAt).join("|");

  const byVocabulary = useMemo(() => {
    const map = new Map<MetaVocabulary, Map<string, MetaItem>>();
    META_VOCABULARIES.forEach((vocabulary, index) => {
      const items = results[index]?.data?.items ?? [];
      map.set(vocabulary, new Map(items.map((item) => [item.key, item])));
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settledAt]);

  const pick = useCallback((item: MetaItem) => (lang === "fr" ? item.labelFr : item.labelEn), [lang]);

  const label = useCallback<LabelLookup>(
    (vocabulary, key) => {
      if (!key) return "";
      const item = byVocabulary.get(vocabulary)?.get(key);
      // No label yet (vocabularies still loading, or a key this build has never
      // seen): show nothing rather than a humanised guess.
      return item ? pick(item) : "";
    },
    [byVocabulary, pick],
  );

  const options = useCallback(
    (vocabulary: MetaVocabulary) => {
      const entries = byVocabulary.get(vocabulary);
      if (!entries) return [];
      return [...entries.values()].map((item) => ({ key: item.key, label: pick(item) }));
    },
    [byVocabulary, pick],
  );

  return {
    label,
    options,
    isLoading: results.some((result) => result.isLoading),
    isError: results.some((result) => result.isError),
  };
};
