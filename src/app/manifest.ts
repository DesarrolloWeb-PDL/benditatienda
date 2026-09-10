import { MetadataRoute } from 'next';
import { getThemeConfig } from '@/lib/app-theme';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const theme = await getThemeConfig();

  const timestamp = Date.now();

  return {
    name: theme.appTitle || 'Bendita Tienda',
    short_name: 'Bendita Tienda',
    description: 'Indumentaria deportiva, equipamiento y suplementos para CrossFit y entrenamiento funcional.',
    start_url: `/?v=${timestamp}`,
    display: 'standalone',
    background_color: theme.secondaryColor || '#2c2c2c',
    theme_color: theme.primaryColor || '#d89a44',
    orientation: 'portrait-primary',
    icons: [
      {
        src: `/favicon-shop.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: `/api/icon?size=192&v=${timestamp}`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `/api/icon?size=512&v=${timestamp}`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: `/api/icon?size=192&v=${timestamp}`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: `/api/icon?size=512&v=${timestamp}`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
  };
}
