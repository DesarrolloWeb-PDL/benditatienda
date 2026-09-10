import { prisma as db } from '@/lib/db'
import { normalizePublicAssetUrl } from '@/lib/url-normalizer'

export interface AppTheme {
  appTitle: string
  appSubtitle: string
  logoUrl: string
  heroImageUrl: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  heroTitle: string
  heroSubtitle: string
  infoTitle1: string
  infoSubtitle1: string
  infoTitle2: string
  infoSubtitle2: string
  infoTitle3: string
  infoSubtitle3: string
}

const DEFAULT_THEME: AppTheme = {
  appTitle: 'Bendita Tienda',
  appSubtitle: 'Tienda Deportiva',
  logoUrl: '/img/benditocross.png',
  heroImageUrl: '/img/hero-bg.png',
  primaryColor: '#FF0000',
  secondaryColor: '#1A1A1A',
  accentColor: '#333333',
  heroTitle: 'Equipamiento Deportivo',
  heroSubtitle: 'Indumentaria para CrossFit y entrenamiento funcional.',
  infoTitle1: 'Ropa Deportiva',
  infoSubtitle1: 'Camisetas, pantalones, shorts y accesorios para entrenar.',
  infoTitle2: 'Equipamiento',
  infoSubtitle2: 'Barras, bandas, guantes y equipamiento para CrossFit.',
  infoTitle3: 'Suplementos',
  infoSubtitle3: 'Proteínas, creatina y suplementos para optimizar tu rendimiento.',
}

export async function getThemeConfig(): Promise<AppTheme> {
  try {
    const configs = await db.siteConfig.findMany({
      where: {
        key: {
          in: [
            'theme_appTitle',
            'theme_appSubtitle',
            'theme_logoUrl',
            'theme_heroImageUrl',
            'theme_primaryColor',
            'theme_secondaryColor',
            'theme_accentColor',
            'theme_heroTitle',
            'theme_heroSubtitle',
            'theme_infoTitle1',
            'theme_infoSubtitle1',
            'theme_infoTitle2',
            'theme_infoSubtitle2',
            'theme_infoTitle3',
            'theme_infoSubtitle3',
          ],
        },
      },
    })

    const theme: Partial<AppTheme> = {}
    configs.forEach((config) => {
      const key = config.key.replace('theme_', '') as keyof AppTheme
      ;(theme as any)[key] = config.value
    })

    const mergedTheme = { ...DEFAULT_THEME, ...theme }
    return {
      ...mergedTheme,
      logoUrl: normalizePublicAssetUrl(mergedTheme.logoUrl),
      heroImageUrl: normalizePublicAssetUrl(mergedTheme.heroImageUrl),
    }
  } catch (error) {
    console.error('Error fetching theme config:', error)
    return DEFAULT_THEME
  }
}
