import { type Lang } from './translations';

type ContentFields = {
  heroTitle: string;
  heroSubtitle: string;
  infoTitle1: string;
  infoSubtitle1: string;
  infoTitle2: string;
  infoSubtitle2: string;
  infoTitle3: string;
  infoSubtitle3: string;
};

const CONTENT_PT: ContentFields = {
  heroTitle: 'Equipamento Esportivo',
  heroSubtitle: 'Indumentaria para CrossFit e treinamento funcional.',
  infoTitle1: 'Roupas Esportivas',
  infoSubtitle1: 'Camisetas, calças, shorts e acessórios para treinar.',
  infoTitle2: 'Equipamento',
  infoSubtitle2: 'Barras, bandas, luvas e equipamento para CrossFit.',
  infoTitle3: 'Suplementos',
  infoSubtitle3: 'Proteínas, creatina e suplementos para otimizar seu desempenho.',
};

const CONTENT_EN: ContentFields = {
  heroTitle: 'Sports Equipment',
  heroSubtitle: 'Clothing for CrossFit and functional training.',
  infoTitle1: 'Sports Clothing',
  infoSubtitle1: 'T-shirts, pants, shorts and accessories for training.',
  infoTitle2: 'Equipment',
  infoSubtitle2: 'Bars, bands, gloves and equipment for CrossFit.',
  infoTitle3: 'Supplements',
  infoSubtitle3: 'Proteins, creatine and supplements to optimize your performance.',
};

const contentTranslations: Record<Exclude<Lang, 'es'>, ContentFields> = {
  pt: CONTENT_PT,
  en: CONTENT_EN,
};

/**
 * Returns translated content for theme fields.
 * Falls back to the original DB value for 'es' or missing translations.
 */
export function getTranslatedContent(
  lang: Lang,
  theme: ContentFields
): ContentFields {
  if (lang === 'es') return theme;

  const translations = contentTranslations[lang];
  if (!translations) return theme;

  return {
    heroTitle: translations.heroTitle || theme.heroTitle,
    heroSubtitle: translations.heroSubtitle || theme.heroSubtitle,
    infoTitle1: translations.infoTitle1 || theme.infoTitle1,
    infoSubtitle1: translations.infoSubtitle1 || theme.infoSubtitle1,
    infoTitle2: translations.infoTitle2 || theme.infoTitle2,
    infoSubtitle2: translations.infoSubtitle2 || theme.infoSubtitle2,
    infoTitle3: translations.infoTitle3 || theme.infoTitle3,
    infoSubtitle3: translations.infoSubtitle3 || theme.infoSubtitle3,
  };
}
