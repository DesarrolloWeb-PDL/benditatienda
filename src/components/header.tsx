'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores/cart-store';
import { useTheme } from '@/components/theme-provider';
import { useLanguage } from '@/components/language-provider';
import { LanguageSwitcher } from '@/components/language-switcher';
import { normalizePublicAssetUrl } from '@/lib/url-normalizer';
import type { SiteContent } from '@/lib/site-content.shared';

interface HeaderProps {
  showCart?: boolean;
  siteContent: SiteContent
}

export function Header({ siteContent, showCart = true }: HeaderProps) {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const theme = useTheme();
  const { t } = useLanguage();
  const logoSrc = normalizePublicAssetUrl(theme.logoUrl) || '/img/espiga.png';
  const logoIsExternal = /^https?:\/\//i.test(logoSrc);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => { setIsHydrated(true); }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const safeTotalItems = isHydrated ? totalItems : 0;

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className="sticky z-50 w-full border-b transition-all duration-300 backdrop-blur-xl overflow-visible"
      style={{
        top: 'var(--safe-area-top, 0px)',
        backgroundColor: 'var(--brand-section-header)',
        borderColor: theme.primaryColor + '30',
      }}
    >
      <div
        className="mx-auto px-4"
        style={{ maxWidth: 'var(--brand-header-max-width, 1280px)' }}
      >
        <div className="flex h-32 md:h-40 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {theme.logoUrl && (
              <Image
                src={logoSrc}
                alt={theme.appTitle}
                className="object-contain shrink-0 h-[112px] w-[112px] md:h-[160px] md:w-[160px]"
                width={Number(theme.logoSize) || 160}
                height={Number(theme.logoSize) || 160}
                unoptimized={logoIsExternal}
                priority
              />
            )}
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:opacity-75"
              style={{ color: theme.primaryColor }}
            >
              {t.navProductsLabel}
            </Link>
            <Link
              href="/sobre-nosotros"
              className="text-sm font-medium transition-colors hover:opacity-75"
              style={{ color: theme.primaryColor }}
            >
              {t.navAboutLabel}
            </Link>
            <Link
              href="/contacto"
              className="text-sm font-medium transition-colors hover:opacity-75"
              style={{ color: theme.primaryColor }}
            >
              {t.navContactLabel}
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            {showCart && (
              <Button
                variant="outline"
                size="icon"
                className="relative"
                onClick={toggleCart}
                style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                <ShoppingCart className="h-5 w-5" />
                {safeTotalItems > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    style={{ backgroundColor: theme.primaryColor, color: '#2C2C2C' }}
                  >
                    {safeTotalItems}
                  </Badge>
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? t.navCloseMenu : t.navOpenMenu}
              style={{ color: theme.primaryColor }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav 
          className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
          }`}
          style={{ borderColor: theme.primaryColor + '30' }}
        >
          <Link
            href="/"
            className="text-sm font-medium px-1 py-1 transition-colors hover:opacity-75 block"
            style={{ color: theme.primaryColor }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.navProductsLabel}
          </Link>
          <Link
            href="/sobre-nosotros"
            className="text-sm font-medium px-1 py-1 transition-colors hover:opacity-75 block"
            style={{ color: theme.primaryColor }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.navAboutLabel}
          </Link>
          <Link
            href="/contacto"
            className="text-sm font-medium px-1 py-1 transition-colors hover:opacity-75 block"
            style={{ color: theme.primaryColor }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t.navContactLabel}
          </Link>
          <div className="mt-2 pt-2 border-t" style={{ borderColor: theme.primaryColor + '30' }}>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
