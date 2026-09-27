import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useT } from "@/i18n/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const t = useT();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-muted">
      <div className="section-container text-center">
        <h1 className="mb-4 font-heading text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t("Oops! Page not found")}</p>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center justify-center text-accent underline underline-offset-2 hover:text-foreground"
        >
          {t("Return to Home")}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
