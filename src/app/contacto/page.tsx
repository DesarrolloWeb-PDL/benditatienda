import { getSiteContent } from '@/lib/site-content'
import { TranslatedContact } from '@/components/translated-contact'

export const metadata = {
  title: 'Contacto | Clara y Yema',
}

export default async function ContactoPage() {
  const siteContent = await getSiteContent()

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <TranslatedContact siteContent={siteContent} />
    </main>
  )
}
