"use client";

import * as React from "react";
import { type Lang, type Translations, getTranslations } from "@/i18n/translations";

interface LanguageContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "cym_lang";

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "es";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "pt" || stored === "en") return stored;
  } catch {}
  return "es";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("es");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setLangState(getInitialLang());
    setMounted(true);
  }, []);

  const setLang = React.useCallback((newLang: Lang) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {}
    document.documentElement.lang = newLang;
  }, []);

  const t = React.useMemo(() => getTranslations(lang), [lang]);

  const value = React.useMemo(
    () => ({ lang, t, setLang }),
    [lang, t, setLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = React.useContext(LanguageContext);
  if (!ctx) {
    // Fallback for SSR or contexts outside provider
    return {
      lang: "es" as Lang,
      t: getTranslations("es"),
      setLang: (_: Lang) => {},
    };
  }
  return ctx;
}
