/**
 * Sanitiser for the rich-text job body sections.
 *
 * The API's *Html fields are authored in the HRIS back office, so they are not
 * hostile by default — but they are still remote input rendered through
 * dangerouslySetInnerHTML, and nothing downstream re-checks them. Everything
 * outside this allow-list (scripts, event handlers, iframes, styles, javascript:
 * URLs) is stripped before it reaches the DOM.
 */

import DOMPurify from "dompurify";

/** Formatting a job description legitimately needs, and nothing more. */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "h3",
  "h4",
  "h5",
  "blockquote",
  "span",
];

const ALLOWED_ATTR = ["href", "title", "target", "rel"];

export const sanitizeHtml = (html: string): string =>
  DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Relative and mailto/tel links are fine; javascript: and data: are not.
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });

/**
 * Vet a URL that came from the API before it becomes an `href`.
 *
 * The HRIS back office authors `externalRedirectUrl`, so it is not hostile by
 * default — but it is still remote input landing on a GEAT-branded "Apply Now"
 * control, and `href="javascript:…"` executes in the page's own origin when
 * clicked. The rich-text path already refuses non-http(s) schemes via
 * ALLOWED_URI_REGEXP; a bare href had no such check, which was the one
 * inconsistency in this file's coverage.
 *
 * Returns the normalised absolute URL, or null when the value is missing,
 * unparseable, or carries any scheme other than http(s). Callers fall back to
 * the internal apply route rather than rendering a link they cannot vouch for.
 */
export const safeExternalUrl = (url: string | null | undefined): string | null => {
  if (!url?.trim()) return null;
  try {
    const parsed = new URL(url, typeof window === "undefined" ? undefined : window.location.origin);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
};

/**
 * Force every link that survives sanitising to open safely. DOMPurify keeps
 * target="_blank" but cannot add the rel that stops the opened page reaching
 * back through window.opener.
 */
export const sanitizeRichText = (html: string): string => {
  const clean = sanitizeHtml(html);
  if (typeof document === "undefined") return clean;

  const holder = document.createElement("div");
  holder.innerHTML = clean;
  holder.querySelectorAll("a[target='_blank']").forEach((anchor) => {
    anchor.setAttribute("rel", "noopener noreferrer");
  });
  return holder.innerHTML;
};
