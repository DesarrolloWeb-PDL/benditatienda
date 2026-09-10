import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import { CartSidebar } from "@/components/cart-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/language-provider";
import WhatsAppBot from "@/components/whatsapp-bot";
import { getSiteContent } from "@/lib/site-content";
import { Toaster } from "@/components/toaster";

export const metadata: Metadata = {
  title: "Bendito Cross — Indumentaria Deportiva",
  description: "Indumentaria deportiva, equipamiento y suplementos para CrossFit y entrenamiento funcional.",
  manifest: "/manifest",
  themeColor: "#FF0000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bendito Cross",
  },
  icons: {
    icon: [
      { url: '/favicon-egg.svg', type: 'image/svg+xml' },
      { url: '/api/icon?size=192', sizes: '192x192', type: 'image/png' },
      { url: '/api/icon?size=512', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: ['/favicon-egg.svg'],
    apple: [
      { url: '/favicon-egg.svg', type: 'image/svg+xml' },
      { url: '/api/icon?size=180', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body>
        <LanguageProvider>
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Header siteContent={siteContent} showCart={true} />
              <main className="flex-1">
                {children}
              </main>
              <Footer siteContent={siteContent} />
              <CartSidebar />
              <WhatsAppBot siteContent={siteContent} />
              <Toaster />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
