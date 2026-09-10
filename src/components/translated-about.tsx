'use client'

import { useLanguage } from '@/components/language-provider'

export function TranslatedAbout() {
  const { t } = useLanguage()
  return (
    <>
      <h1 className="text-3xl font-bold text-brand-gold">{t.aboutTitle}</h1>
      <div className="mt-4 space-y-4 text-brand-gold/85">
        <p>{t.aboutBody}</p>
        <p>{t.aboutSecondaryBody}</p>
      </div>
    </>
  )
}
