/**
 * One place that turns an ApiError into something a candidate can act on.
 *
 * The four failure modes are deliberately distinct: a throttled submission is
 * recoverable by waiting, a validation error names fields to fix, a 404 means
 * the offer is gone, and a network failure is not the user's fault at all.
 * Collapsing them into "something went wrong" is what this avoids.
 */

import { ApiError } from "@/api/client";

export type ApiMessage = { title: string; description: string };

/** English source strings; pass each through t() at the call site. */
export const apiErrorMessage = (error: unknown): ApiMessage => {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case "rateLimit":
        return {
          title: "Please wait a moment",
          description:
            "Too many attempts were made from this connection. Wait about a minute and try again — nothing was lost.",
        };
      case "validation":
        /* A 400 that names no field carries the whole reason in its message —
           "You have already applied to this offer (reference ...)" is the one
           the server returns most often, and the candidate cannot act on a
           generic "check the form" instead. Server messages are passed through
           t() unchanged when the dictionary has no entry for them. */
        if (Object.keys(error.fields).length === 0 && error.message.trim()) {
          return { title: "This application could not be submitted", description: error.message };
        }
        return {
          title: "Please check the form",
          description: "Some fields need your attention before this can be submitted.",
        };
      case "notFound":
        return {
          title: "No longer available",
          description: "This position is no longer published. Browse the current openings instead.",
        };
      case "network":
        return {
          title: "Connection problem",
          description: "We could not reach the recruitment service. Check your connection and try again.",
        };
      /* No endpoint has been configured for this feature yet. Saying so, and
         naming a channel that does work, is the whole point — the alternative
         these forms used to take was a fake success toast. */
      case "unconfigured":
        return {
          title: "This form is not available yet",
          description:
            "Online submission is not active yet. Please email contact@geat.dz and we will respond from there.",
        };
      default:
        return {
          title: "Something went wrong",
          description: "The recruitment service reported an error. Please try again in a few minutes.",
        };
    }
  }
  return {
    title: "Something went wrong",
    description: "The recruitment service reported an error. Please try again in a few minutes.",
  };
};

/**
 * Field errors from a 400, mapped onto the form's own field names. The server
 * is the authority on validation, so whatever it names is shown even if the
 * client-side schema was happy.
 */
export const apiFieldErrors = (error: unknown): Record<string, string> =>
  error instanceof ApiError && error.kind === "validation" ? error.fields : {};
