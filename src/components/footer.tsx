'use client'

import { useEffect, useState } from 'react'
import { useTheme } from '@/components/theme-provider'
import { useLanguage } from '@/components/language-provider'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Instagram, MessageCircle } from 'lucide-react'
import { normalizePublicAssetUrl } from '@/lib/url-normalizer'
import type { SiteContent } from '@/lib/site-content.shared'

interface FooterProps {
  siteContent: SiteContent
}

export default function Footer({ siteContent }: FooterProps) {
  const [year, setYear] = useState('')
  const pathname = usePathname()
  const theme = useTheme()
  const { t } = useLanguage()
  const logoSrc = normalizePublicAssetUrl(theme.logoUrl) || '/img/espiga.png'
  const logoIsExternal = /^https?:\/\//i.test(logoSrc)

  useEffect(() => {
    setYear(String(new Date().getFullYear()))
  }, [])

  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer 
      className="border-t relative z-10 backdrop-blur-xl"
      style={{ borderColor: theme.primaryColor + '30', backgroundColor: 'var(--brand-section-footer)', paddingBottom: 'var(--safe-area-bottom, 0px)' }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info */}
          <div>
            <h3 
              className="font-semibold mb-3 truncate"
              style={{ color: theme.primaryColor, fontSize: theme.fontSizeTitle }}
            >
              {theme.logoUrl && (
                <Image
                  src={logoSrc}
                  alt={theme.appTitle}
                  className="inline-block mr-2 object-contain h-12 w-12 md:h-14 md:w-14"
                  width={Number(theme.logoSize) || 64}
                  height={Number(theme.logoSize) || 64}
                  unoptimized={logoIsExternal}
                />
              )}
              {theme.appTitle}
            </h3>
            <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
              {t.footerDescription}
            </p>
          </div>

          {/* Horarios */}
          <div>
            <h3 
              className="font-semibold mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t.footerScheduleTitle}
            </h3>
            <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
              {t.footerScheduleText}
              <br />
              <span className="text-xs" style={{ color: 'var(--brand-text-muted)' }}>
                {t.footerDeliveryText}
              </span>
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 
              className="font-semibold mb-3"
              style={{ color: theme.primaryColor }}
            >
              {t.footerContactTitle}
            </h3>
            <p className="text-sm" style={{ color: 'var(--brand-text-muted)' }}>
              {t.footerLabelEmail} {siteContent.contactEmail}
              <br />
              {t.footerLabelPhone} {siteContent.contactPhone}
              <br />
              {siteContent.contactAddress}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          {siteContent.contactInstagram && (
            <a
              href={siteContent.contactInstagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-brand-gold transition-colors"
              style={{ color: 'var(--brand-text-muted)' }}
            >
              <Instagram className="w-5 h-5" />
            </a>
          )}
          {siteContent.contactWhatsapp && (
            <a
              href={`https://wa.me/${siteContent.contactWhatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-[#25D366] transition-colors"
              style={{ color: 'var(--brand-text-muted)' }}
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          )}
        </div>

        <div
          className="mt-6 pt-6 border-t"
          style={{ borderColor: theme.primaryColor + '30' }}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-center text-sm" style={{ color: 'var(--brand-text-muted)' }}>
              © {year || '2026'} {theme.appTitle}. {t.footerCopyright}
            </p>
            <a
              href="https://desarrolloweb-pdl.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-brand flex items-center gap-2 text-xs transition-colors hover:text-[var(--brand-gold,#d4a574)]"
              style={{ color: 'var(--brand-text-muted)' }}
            >
              <span
                className="inline-flex w-4 h-4 shrink-0 transition-transform hover:scale-105"
                aria-hidden="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="currentColor"
                  className="w-full h-full"
                >
                  <rect x="4" y="4" width="11" height="11" rx="2" opacity="1" />
                  <rect x="17" y="4" width="11" height="11" rx="2" opacity="0.7" />
                  <rect x="4" y="17" width="11" height="11" rx="2" opacity="0.5" />
                  <rect x="17" y="17" width="11" height="11" rx="2" opacity="0.3" />
                </svg>
              </span>
              DesarrolloWeb-pdl
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
