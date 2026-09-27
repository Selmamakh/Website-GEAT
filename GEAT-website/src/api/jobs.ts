/** Endpoint functions for the GEAT HRIS public API. */

import { apiRequest } from "./client";
import type {
  ApplicationFields,
  ApplicationReceipt,
  ApplicationStatus,
  JobDetail,
  JobFacets,
  JobListResponse,
  MetaResponse,
  MetaVocabulary,
  SpontaneousApplicationFields,
} from "./types";

/** The API's language parameter. Always sent explicitly — it defaults to FR. */
export type ApiLang = "en" | "fr";

export type JobQueryFilters = {
  profession?: string[];
  location?: string[];
  contract?: string[];
  department?: string[];
  q?: string;
  page?: number;
  pageSize?: number;
};

export const fetchJobs = (
  lang: ApiLang,
  filters: JobQueryFilters = {},
  signal?: AbortSignal,
): Promise<JobListResponse> =>
  apiRequest<JobListResponse>("/jobs", {
    params: {
      lang,
      page: filters.page,
      pageSize: filters.pageSize,
      profession: filters.profession,
      location: filters.location,
      contract: filters.contract,
      department: filters.department,
      q: filters.q,
    },
    signal,
  });

export const fetchJobFacets = (lang: ApiLang, signal?: AbortSignal): Promise<JobFacets> =>
  apiRequest<JobFacets>("/jobs/facets", { params: { lang }, signal });

export const fetchJob = (
  idOrSlug: string,
  lang: ApiLang,
  signal?: AbortSignal,
): Promise<JobDetail> =>
  apiRequest<JobDetail>(`/jobs/${encodeURIComponent(idOrSlug)}`, { params: { lang }, signal });

export const fetchMeta = (
  vocabulary: MetaVocabulary,
  signal?: AbortSignal,
): Promise<MetaResponse> => apiRequest<MetaResponse>(`/meta/${vocabulary}`, { signal });

/**
 * Build the multipart body shared by both application endpoints.
 *
 * Content-Type is never set by hand anywhere in this file — the browser must
 * add it so the multipart boundary is included. The server strips empty
 * strings for the optional fields, so sending "" for an untouched input is
 * safe and keeps the body shape stable.
 */
const buildApplicationBody = (fields: ApplicationFields): FormData => {
  const body = new FormData();
  body.append("firstName", fields.firstName);
  body.append("lastName", fields.lastName);
  body.append("email", fields.email);
  body.append("phone", fields.phone);
  body.append("location", fields.location);
  body.append("linkedinUrl", fields.linkedinUrl);
  body.append("coverLetter", fields.coverLetter);
  body.append("preferredLanguage", fields.preferredLanguage);
  // Multipart carries strings only, so the answers travel as JSON.
  body.append("answers", JSON.stringify(fields.answers));
  body.append("cv", fields.cv);
  /* Only the job application collects these, and an empty optional field is
     not worth a multipart part, so each is appended only when filled. */
  if (fields.dateOfBirth) body.append("dateOfBirth", fields.dateOfBirth);
  if (fields.education) body.append("education", fields.education);
  if (fields.experience) body.append("experience", fields.experience);
  return body;
};

export const applyToJob = (
  idOrSlug: string,
  fields: ApplicationFields,
): Promise<ApplicationReceipt> =>
  apiRequest<ApplicationReceipt>(`/jobs/${encodeURIComponent(idOrSlug)}/apply`, {
    method: "POST",
    formData: buildApplicationBody(fields),
  });

export const submitSpontaneousApplication = (
  fields: SpontaneousApplicationFields,
): Promise<ApplicationReceipt> => {
  const body = buildApplicationBody(fields);
  body.append("professionKey", fields.professionKey);
  body.append("areaOfInterest", fields.areaOfInterest);
  return apiRequest<ApplicationReceipt>("/applications/spontaneous", {
    method: "POST",
    formData: body,
  });
};

/**
 * A wrong reference and a wrong email both return 404 by design, so the caller
 * must render one neutral message and never distinguish the two.
 */
export const fetchApplicationStatus = (
  reference: string,
  email: string,
): Promise<ApplicationStatus> =>
  apiRequest<ApplicationStatus>("/applications/status", {
    method: "POST",
    json: { reference, email },
  });
