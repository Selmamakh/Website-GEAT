import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that reveals any element
 * with the `.reveal` class as it scrolls into view — site-wide.
 */
const RevealOnScroll = () => {
  useEffect(() => {
    const observed = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
};

export default RevealOnScroll;
