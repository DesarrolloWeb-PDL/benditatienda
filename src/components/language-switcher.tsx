"use client";

import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={`text-xs font-semibold px-2 py-1 h-7 ${
          lang === "es"
            ? "text-[var(--brand-primary)] underline underline-offset-2"
            : "text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)]"
        }`}
        onClick={() => setLang("es")}
      >
        ES
      </Button>
      <span className="text-[var(--brand-text-muted)] text-xs">|</span>
      <Button
        variant="ghost"
        size="sm"
        className={`text-xs font-semibold px-2 py-1 h-7 ${
          lang === "pt"
            ? "text-[var(--brand-primary)] underline underline-offset-2"
            : "text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)]"
        }`}
        onClick={() => setLang("pt")}
      >
        PT
      </Button>
      <span className="text-[var(--brand-text-muted)] text-xs">|</span>
      <Button
        variant="ghost"
        size="sm"
        className={`text-xs font-semibold px-2 py-1 h-7 ${
          lang === "en"
            ? "text-[var(--brand-primary)] underline underline-offset-2"
            : "text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)]"
        }`}
        onClick={() => setLang("en")}
      >
        EN
      </Button>
    </div>
  );
}
