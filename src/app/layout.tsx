import type { Metadata } from 'next'

import { Geist } from 'next/font/google'

import { cn } from '@/lib/utils'

import '@/styles/globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  description: 'Digitalisasi UMKM Indonesia secara instan dalam satu klik.',
  title: 'Growfin Digital | Platform SaaS UMKM Indonesia',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={cn('font-sans', geist.variable)} lang="id">
      <body>{children}</body>
    </html>
  )
}
