import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { useT } from "@/i18n/LanguageContext";
import { SCROLL_TOP_POSITION, hasChatLauncher } from "./floatingWidgetLane";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  const t = useT();

  // Reset scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Show/hide button after scrolling down
  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  /* Offset the button on Careers pages so it does not overlap the Geni chat
     launcher. The offsets live in floatingWidgetLane.ts because the Footer has
     to reserve exactly this much space at the end of the document — see the
     arithmetic there. */
  const isCareers = hasChatLauncher(pathname);

  /* Unmounted while hidden, not faded out.
     This is mounted in App.tsx above <Routes>, so it is the first element in
     the document — ahead of the skip link. Hidden with nothing but
     `opacity-0 translate-y-4 pointer-events-none` it stayed in the tab order,
     which made an invisible Back-to-top button tab stop #1 on all 11 routes.
     Conditional render is the same fix the mobile drawer and the nav
     dropdowns use; `animate-fade-in` keeps the entrance, and the global
     prefers-reduced-motion block already neutralises it. */
  if (!show) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label={t("Back to top")}
      /* Hover fill is the accent token, not a raw colour literal. The
         arbitrary-value hover fill this replaced (a 48%-lightness orange) was
         LIGHTER than --primary, so white on it fell from 5.28:1 at rest to
         ~3.47:1 on hover — reintroducing the exact failure the token retune
         removed. White on --accent measures 5.05:1, and it matches the accent
         sweep every .btn-cta already uses on hover.

         Do not paste the old class string back into this comment: Tailwind
         scans comments, and naming it re-emits that dead rule into the CSS. */
      className={`floating-widget tap-target animate-fade-in fixed z-50 h-11 w-11 rounded-full bg-brand text-brand-foreground shadow-lg transition-colors duration-300 hover:bg-accent hover:text-accent-foreground sm:h-12 sm:w-12 ${
        isCareers ? SCROLL_TOP_POSITION.careers : SCROLL_TOP_POSITION.default
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTop;
