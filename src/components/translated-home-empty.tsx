'use client'

import { useLanguage } from '@/components/language-provider'

interface TranslatedHomeEmptyProps {
  isOpen: boolean
  heroImageUrl?: string | null
}

export function TranslatedHomeEmpty({ isOpen, heroImageUrl }: TranslatedHomeEmptyProps) {
  const { t } = useLanguage()
  return (
    <div className="text-center py-20">
      <div className="mb-6 text-6xl">🥖</div>
      <h2 className={`text-2xl font-semibold mb-2 ${heroImageUrl ? 'text-white' : 'text-gray-900'}`}>
        {t.homeNoProducts}
      </h2>
      <p className={heroImageUrl ? 'text-white/70' : 'text-gray-600'}>
        {isOpen
          ? t.homeComingSoon
          : t.homeClosed}
      </p>
    </div>
  )
}
