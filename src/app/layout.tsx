import type { Metadata } from 'next'

import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google'

import { cn } from '@/lib/utils'

import '@/styles/globals.css'

const bricolageGrotesque = Bricolage_Grotesque({
  adjustFontFallback: true,
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-display',
})

const dmSans = DM_Sans({
  adjustFontFallback: true,
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  adjustFontFallback: true,
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mono',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  adjustFontFallback: true,
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['800'],
})

export const metadata: Metadata = {
  description: 'Digitalisasi UMKM Indonesia secara instan dalam satu klik.',
  title: 'MeracikWeb | Platform SaaS UMKM Indonesia',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="id"
      className={cn(
        'font-sans',
        dmSans.variable,
        bricolageGrotesque.variable,
        jetbrainsMono.variable,
        plusJakartaSans.variable,
      )}
    >
      <body>{children}</body>
    </html>
  )
}
