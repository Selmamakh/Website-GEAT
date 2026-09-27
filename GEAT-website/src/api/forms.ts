/**
 * Submission endpoints for the two public forms that are not part of the HRIS
 * recruitment flow: the contact request and the newsletter subscription.
 *
 * WHY THESE ARE CONFIGURABLE RATHER THAN HARD-WIRED
 *
 * This site is a static SPA with no server of its own, so it cannot hold a
 * credential: Vite inlines every VITE_* value into the bundle at build time,
 * where any visitor can read it. Calling a mail service or an ESP directly
 * from the browser would therefore publish that key — and an ESP key normally
 * grants export of the whole contact list, not just "add one subscriber".
 *
 * So each form posts to an endpoint GEAT configures, which holds the real
 * credential server-side. Any of these satisfies the contract below:
 *   - an endpoint added to the GEAT HRIS API (most consistent with this code);
 *   - a serverless function on whichever host serves the site;
 *   - an ESP's own hosted form endpoint, which takes no secret at all.
 *
 * WHEN NOTHING IS CONFIGURED
 *
 * The submission fails with kind "unconfigured" and the UI says so plainly,
 * pointing the visitor at a real email address. It deliberately does NOT
 * pretend to succeed. Both forms previously did — the contact form showed
 * "Request received, our team will reach out shortly" while sending nothing,
 * and the newsletter did nothing at all and said nothing. Silent discard is
 * worse than a visible failure: the visitor believes they have been heard.
 */

import { ApiError, apiRequest } from "./client";

/** Full URL that receives contact requests. Empty until GEAT configures it. */
export const CONTACT_ENDPOINT: string = import.meta.env.VITE_CONTACT_ENDPOINT ?? "";

/** Full URL that receives newsletter subscriptions. Empty until configured. */
export const NEWSLETTER_ENDPOINT: string = import.meta.env.VITE_NEWSLETTER_ENDPOINT ?? "";

export const isContactConfigured = (): boolean => CONTACT_ENDPOINT.trim().length > 0;
export const isNewsletterConfigured = (): boolean => NEWSLETTER_ENDPOINT.trim().length > 0;

const unconfigured = (feature: string) =>
  new ApiError("unconfigured", 0, `No endpoint is configured for ${feature}.`);

/** The contact form's payload. Mirrors the zod schema on the Contact page. */
export type ContactRequest = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  country: string;
  details: string;
  /** Whether the sender agreed to receive commercial communications. */
  communications: "yes" | "no";
  /** UI language at the time of sending, so a reply can match it. */
  preferredLanguage: "EN" | "FR";
};

/**
 * POST the contact request as JSON.
 *
 * A 2xx means the receiving system has accepted responsibility for the
 * message. Anything else surfaces through the shared ApiError mapping, so the
 * sender is told to use the email address instead rather than assuming it
 * arrived.
 */
export const submitContactRequest = async (fields: ContactRequest): Promise<void> => {
  if (!isContactConfigured()) throw unconfigured("the contact form");
  await apiRequest<unknown>("", { method: "POST", absoluteUrl: CONTACT_ENDPOINT, json: fields });
};

export type NewsletterSubscription = {
  email: string;
  /** Which language the subscriber reads, for the ESP's list segmentation. */
  preferredLanguage: "EN" | "FR";
  /** Where on the site they subscribed, e.g. "/news". Useful for attribution. */
  source: string;
};

/**
 * POST a newsletter subscription as JSON.
 *
 * Double opt-in is deliberately NOT attempted here: confirmation emails,
 * pending states and unsubscribe links can only be issued by whatever holds
 * the ESP credential. This client's job ends at handing over a validated
 * address; the receiving endpoint owns the consent lifecycle.
 */
export const subscribeToNewsletter = async (fields: NewsletterSubscription): Promise<void> => {
  if (!isNewsletterConfigured()) throw unconfigured("the newsletter");
  await apiRequest<unknown>("", { method: "POST", absoluteUrl: NEWSLETTER_ENDPOINT, json: fields });
};
