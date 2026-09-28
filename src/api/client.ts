/**
 * Thin fetch wrapper for the GEAT HRIS public API.
 *
 * The API is public and unauthenticated. Requests must NOT send credentials:
 * the server's CORS allow-list is pinned to http://localhost:8080 and does not
 * echo `Access-Control-Allow-Credentials`, so `credentials: "include"` makes the
 * browser reject every response. The default (`same-origin`) is correct here
 * because the API is cross-origin.
 */

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

/** Every failure mode the UI has to tell apart. */
export type ApiErrorKind =
  | "validation" /* 400 — the body names the offending fields */
  | "notFound" /* 404 — job unpublished, or no matching application */
  | "rateLimit" /* 429 — per-IP throttle */
  | "server" /* 5xx, or any other unexpected status */
  | "network" /* request never completed: API down, DNS, CORS */
  | "unconfigured"; /* no endpoint is configured for this feature — see below */

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  /** Field name -> message, as returned by a 400. Empty for other kinds. */
  readonly fields: Record<string, string>;

  constructor(kind: ApiErrorKind, status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.fields = fields;
  }
}

const kindForStatus = (status: number): ApiErrorKind => {
  if (status === 400 || status === 422) return "validation";
  if (status === 404) return "notFound";
  if (status === 429) return "rateLimit";
  return "server";
};

/**
 * Pull field errors out of a 400 body. The server has a couple of shapes for
 * these, so read defensively and fall back to an empty map rather than
 * throwing while handling an error.
 */
const readFieldErrors = (body: unknown): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!body || typeof body !== "object") return out;
  const record = body as Record<string, unknown>;

  const errors = record.errors ?? record.fields ?? record.fieldErrors ?? record.details;

  if (Array.isArray(errors)) {
    for (const entry of errors) {
      if (!entry || typeof entry !== "object") continue;
      const e = entry as Record<string, unknown>;
      const path = Array.isArray(e.path) ? e.path.join(".") : e.path ?? e.field ?? e.param;
      if (typeof path === "string" && typeof e.message === "string") out[path] = e.message;
    }
    return out;
  }

  if (errors && typeof errors === "object") {
    for (const [key, value] of Object.entries(errors as Record<string, unknown>)) {
      if (typeof value === "string") out[key] = value;
      else if (Array.isArray(value) && typeof value[0] === "string") out[key] = value[0];
    }
  }
  return out;
};

const readMessage = (body: unknown, fallback: string): string => {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const message = record.message ?? record.error;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
};

type RequestOptions = {
  method?: "GET" | "POST";
  /** Query string values; null/undefined/"" entries are dropped. */
  params?: Record<string, string | number | string[] | null | undefined>;
  /** Serialised as JSON. Mutually exclusive with `formData`. */
  json?: unknown;
  /**
   * Sent as-is. The Content-Type header is deliberately not set: the browser
   * has to add it itself so the multipart boundary is included.
   */
  formData?: FormData;
  signal?: AbortSignal;
  /**
   * Full URL to call instead of `API_BASE_URL + path`. Used by features whose
   * endpoint is configured independently of the HRIS (the contact form and the
   * newsletter), which may well live on a different host.
   */
  absoluteUrl?: string;
};

const buildUrl = (
  path: string,
  params: RequestOptions["params"],
  absoluteUrl?: string,
): string => {
  const url = new URL(absoluteUrl ?? `${API_BASE_URL.replace(/\/$/, "")}${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === null || value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      for (const item of value) if (item !== "") url.searchParams.append(key, item);
    } else {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = "GET", params, json, formData, signal, absoluteUrl } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params, absoluteUrl), {
      method,
      signal,
      headers: json ? { "Content-Type": "application/json" } : undefined,
      body: formData ?? (json ? JSON.stringify(json) : undefined),
    });
  } catch (error) {
    // AbortError is react-query cancelling a superseded request, not a failure
    // the user should ever see — let it through untouched.
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiError("network", 0, "The service could not be reached.");
  }

  const raw = await response.text();
  let body: unknown = null;
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(
      kindForStatus(response.status),
      response.status,
      readMessage(body, `Request failed with status ${response.status}.`),
      readFieldErrors(body),
    );
  }

  return body as T;
};

/**
 * react-query retries failed queries by default. Retrying a 404 or a 429 is
 * pointless at best and makes the throttle worse at worst, so only transient
 * failures are retried.
 */
export const retryPolicy = (failureCount: number, error: unknown): boolean => {
  if (error instanceof ApiError && error.kind !== "network" && error.kind !== "server") return false;
  return failureCount < 2;
};
