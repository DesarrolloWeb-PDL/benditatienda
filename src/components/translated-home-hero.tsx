'use client';

import Image from 'next/image';
import { Calendar, Map } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { getTranslatedContent } from '@/i18n/content-translations';
import { TimeGatingBanner } from '@/components/time-gating-banner';
import type { AppTheme } from '@/lib/app-theme';

interface TranslatedHomeHeroProps {
  themeConfig: AppTheme;
  timeGatingData: {
    isOpen: boolean;
    timeRemaining?: { days: number; hours: number; minutes: number; seconds: number };
    nextOpening?: string;
    openingDayLabel?: string;
    openingHour?: number;
    openingMinute?: number;
    closingDayLabel?: string;
    closingHour?: number;
    closingMinute?: number;
  };
}

export function TranslatedHomeHero({ themeConfig, timeGatingData }: TranslatedHomeHeroProps) {
  const { lang } = useLanguage();
  const content = getTranslatedContent(lang, themeConfig);

  return (
    <section
      className={`relative border-b border-brand-gold/20`}
      style={{ backgroundColor: 'var(--brand-section-hero)' }}
    >
      <div className="container mx-auto px-4 py-10 md:py-14 relative z-10 w-full">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${themeConfig.heroImageUrl ? 'text-white' : 'text-brand-gold-dark'}`}>
            {content.heroTitle}
          </h1>
          <p className={`text-base md:text-lg mb-5 ${themeConfig.heroImageUrl ? 'text-white/90' : 'text-brand-gold/80'}`}>
            {content.heroSubtitle}
          </p>

          <TimeGatingBanner
            isOpen={timeGatingData.isOpen}
            timeRemaining={timeGatingData.timeRemaining}
            nextOpening={timeGatingData.nextOpening}
            openingDayLabel={timeGatingData.openingDayLabel}
            openingHour={timeGatingData.openingHour}
            openingMinute={timeGatingData.openingMinute}
            closingDayLabel={timeGatingData.closingDayLabel}
            closingHour={timeGatingData.closingHour}
            closingMinute={timeGatingData.closingMinute}
          />
        </div>
      </div>
    </section>
  );
}

export function TranslatedHomeInfo({ themeConfig }: { themeConfig: AppTheme }) {
  const { lang } = useLanguage();
  const content = getTranslatedContent(lang, themeConfig);

  return (
    <section className="border-t border-brand-gold/15" style={{ backgroundColor: 'var(--brand-section-info)' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-brand-gold" />
            <h3 className="font-semibold text-brand-gold-dark mb-2">
              {content.infoTitle1}
            </h3>
            <p className="text-sm text-white/80">
              {content.infoSubtitle1}
            </p>
          </div>
          <div className="text-center">
            {themeConfig.logoUrl ? (
              <Image
                src={themeConfig.logoUrl}
                alt={content.infoTitle2}
                width={80}
                height={80}
                className="mx-auto mb-3 w-[70px] h-[70px] md:w-[100px] md:h-[100px] object-contain"
              />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mx-auto mb-3 text-brand-gold">
                <path d="M12 22V8" />
                <path d="M12 8c2-2 4-2.5 4-4" />
                <path d="M12 8c-2-2-4-2.5-4-4" />
                <path d="M8 12c2-1 3-1.5 4-3" />
                <path d="M16 12c-2-1-3-1.5-4-3" />
                <path d="M7 16c1.5-1 3-2 4-3" />
                <path d="M17 16c1.5-1-3-2-4-3" />
                <path d="M6 19l2-2" />
                <path d="M18 19l-2-2" />
              </svg>
            )}
            <h3 className="font-semibold text-brand-gold-dark mb-2">
              {content.infoTitle2}
            </h3>
            <p className="text-sm text-white/80">
              {content.infoSubtitle2}
            </p>
          </div>
          <div className="text-center">
            <Map className="w-10 h-10 mx-auto mb-3 text-brand-gold" />
            <h3 className="font-semibold text-brand-gold-dark mb-2">
              {content.infoTitle3}
            </h3>
            <p className="text-sm text-white/80">
              {content.infoSubtitle3}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
