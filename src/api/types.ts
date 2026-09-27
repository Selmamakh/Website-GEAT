/**
 * Response shapes of the GEAT HRIS public API, transcribed from the running
 * server. The API speaks lowercase reference keys ("batna", "cdi", "it") for
 * every vocabulary field; labels come from the /api/meta/* endpoints.
 */

/** A vocabulary entry from /api/meta/*. */
export type MetaItem = {
  key: string;
  labelEn: string;
  labelFr: string;
  /** The display string the pre-API static data used, where one existed. */
  legacyValue: string | null;
};

export type MetaResponse = { items: MetaItem[] };

/** The eight vocabularies the API publishes. */
export const META_VOCABULARIES = [
  "professions",
  "locations",
  "contracts",
  "departments",
  "education-levels",
  "experience-bands",
  "business-areas",
  "professional-levels",
] as const;

export type MetaVocabulary = (typeof META_VOCABULARIES)[number];

/** One entry of GET /api/jobs — the list payload, which has no body sections. */
export type JobListItem = {
  id: string;
  slug: string;
  reference: string;
  title: string;
  summary: string | null;
  profession: string | null;
  department: string | null;
  contract: string | null;
  level: string | null;
  businessArea: string | null;
  locations: string[];
  openings: number;
  publishedAt: string;
  deadline: string | null;
  employer: string | null;
};

/** GET /api/jobs is a paginated envelope, not a bare array. */
export type JobListResponse = {
  items: JobListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type QuestionnaireOption = { id: string; label: string };

export type QuestionnaireQuestion = {
  id: string;
  ordinal: number;
  /** Server-driven; the known values are single/multiple choice, text, number. */
  type: string;
  isRequired: boolean;
  text: string;
  options: QuestionnaireOption[];
};

/**
 * Scoring fields (option points, isEliminatory) deliberately never cross the
 * API boundary, so nothing here can expose them.
 */
export type Questionnaire = { id: string; questions: QuestionnaireQuestion[] };

/** GET /api/jobs/:idOrSlug — the list fields plus the four body sections. */
export type JobDetail = JobListItem & {
  locale: "EN" | "FR";
  presentation: string | null;
  missions: string | null;
  profile: string | null;
  benefits: string | null;
  /** Rich-text variants. Null on every offer in the dev database. */
  presentationHtml: string | null;
  missionsHtml: string | null;
  profileHtml: string | null;
  benefitsHtml: string | null;
  externalRedirectUrl: string | null;
  questionnaire: Questionnaire | null;
};

export type FacetCount = { key: string; count: number };

/** GET /api/jobs/facets — counts by key, for the four facetable dimensions. */
export type JobFacets = {
  professions: FacetCount[];
  departments: FacetCount[];
  contracts: FacetCount[];
  locations: FacetCount[];
};

/** POST /api/jobs/:idOrSlug/apply and the spontaneous equivalent. */
export type ApplicationReceipt = { reference: string; applicationId: string };

export type ApplicationStatusStep = "received" | "in_review" | "in_progress" | "final_decision";

/** POST /api/applications/status. */
export type ApplicationStatus = {
  reference: string;
  submittedAt: string;
  jobTitle: string | null;
  step: ApplicationStatusStep;
};

/** One answer to a questionnaire question, serialised into the multipart body. */
export type QuestionnaireAnswer = {
  questionId: string;
  optionIds?: string[];
  textValue?: string;
  numericValue?: number;
};

/** The shared field set of both application endpoints. */
export type ApplicationFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  coverLetter: string;
  preferredLanguage: "EN" | "FR";
  cv: File;
  answers: QuestionnaireAnswer[];
  /**
   * Candidate profile fields restored to the job application form.
   *
   * Optional here on purpose: only the job application collects them, so the
   * spontaneous form stays valid without them, and `buildApplicationBody`
   * appends each one only when it carries a value.
   *
   * ⚠️ TO CONFIRM with the HRIS team: whether the apply endpoint stores these.
   * They are sent as additional multipart fields; a server that validates
   * strictly may ignore or reject them. See handover.md.
   */
  dateOfBirth?: string;
  /** Key from the `education-levels` vocabulary. */
  education?: string;
  /** Key from the `experience-bands` vocabulary. */
  experience?: string;
};

/** Spontaneous applications carry two extra fields. */
export type SpontaneousApplicationFields = ApplicationFields & {
  professionKey: string;
  areaOfInterest: string;
};
