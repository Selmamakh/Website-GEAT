/**
 * Global broken-image guard — a safety net, no longer a workaround.
 *
 * History: every image used to be imported as a `.asset.json` stub pointing at
 * a remote CDN path with no binary in the repo. 59 images across 8 routes
 * failed to decode and rendered as the browser's broken-image glyph,
 * including every product card and the Contact and Careers heroes. Those 79
 * binaries have since been restored into src/assets and are imported
 * directly, so Vite hashes, bundles and serves them.
 *
 * This stays because a build can still lose an image — a bad path, a failed
 * deploy, a stripped LFS object. When that happens the failed <img> is marked
 * with `data-img-failed` and index.css paints a neutral GEAT-toned panel at
 * the element's own size, so a missing file never looks like a broken page.
 *
 * `error` does not bubble, so the listener runs in the capture phase on the
 * document. One listener covers every image on the site, including images
 * added later by React.
 */

const FAILED_ATTR = "data-img-failed";

function markFailed(el: EventTarget | null) {
  if (!(el instanceof HTMLImageElement)) return;
  if (el.hasAttribute(FAILED_ATTR)) return;

  el.setAttribute(FAILED_ATTR, "");

  /* A decorative image that fails should stay silent for screen readers.
     One that carried meaning already has its accessible name in `alt` —
     do NOT copy alt into aria-label as well. An earlier version did, which
     produced `<img alt="Gas Turbines" aria-label="Gas Turbines" role="img">`
     and made the duplication look deliberate to auditing tools. */
  if (!el.alt) el.setAttribute("role", "presentation");
}

export function installImageFallback() {
  const onError = (e: Event) => markFailed(e.target);
  document.addEventListener("error", onError, true);

  /* Images that already failed before this ran (cached 404s, SSR'd markup). */
  const sweep = () => {
    document.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth === 0) markFailed(img);
    });
  };
  sweep();
  window.setTimeout(sweep, 1200);

  return () => document.removeEventListener("error", onError, true);
}
