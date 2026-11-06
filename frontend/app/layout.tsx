import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MeracikWeb | Racik Website Cepat Sesuai Gayamu',
  description: 'Buat website profesional untuk bisnis, UMKM, atau personal brand dengan mudah, cepat, dan siap online.',
  generator: 'MeracikWeb',
  icons: {
    icon: [
      {
        url: '/meracikweb-icon.png',
        type: 'image/png',
      },
    ],
    apple: '/meracikweb-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F4F7FC' },
  ],
}

import { LanguageProvider } from '@/lib/language-context';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { MetaPixel } from '@/components/analytics/MetaPixel';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`light ${plusJakarta.variable}`} style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
      <body className="antialiased" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-electric-blue focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          Lewati ke konten utama
        </a>
        <LanguageProvider>
          {children}
          <MetaPixel />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
