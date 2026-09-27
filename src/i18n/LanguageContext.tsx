import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fr } from "./fr";

export type Lang = "en" | "fr";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Translate an English source string into the active language. */
  t: (en: string) => string;
};

const STORAGE_KEY = "geat-lang";

const LanguageContext = createContext<LanguageContextValue | null>(null);

const readInitialLang = (): Lang => {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "fr" ? "fr" : "en";
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const t = useCallback(
    (en: string) => {
      if (lang === "en") return en;
      return fr[en] ?? en;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

const fallbackValue: LanguageContextValue = {
  lang: "en",
  setLang: () => {},
  t: (en: string) => en,
};

export const useLanguage = () => useContext(LanguageContext) ?? fallbackValue;

/** Convenience hook: const t = useT(); t("Careers") */
export const useT = () => useLanguage().t;

