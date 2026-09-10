import { getSiteContent } from '@/lib/site-content'
import { TranslatedAbout } from '@/components/translated-about'

export const metadata = {
  title: 'Sobre Nosotros | Clara y Yema',
}

export default async function SobreNosotrosPage() {
  const siteContent = await getSiteContent()

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <TranslatedAbout />
    </main>
  )
}
