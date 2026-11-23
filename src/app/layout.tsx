import type { Metadata } from 'next'

import { Geist, Plus_Jakarta_Sans } from 'next/font/google'

import { cn } from '@/lib/utils'

import '@/styles/globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const plusJakartaSans = Plus_Jakarta_Sans({
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
    <html className={cn('font-sans', geist.variable, plusJakartaSans.variable)} lang="id">
      <body>{children}</body>
    </html>
  )
}
