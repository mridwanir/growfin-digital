import type { ReactNode } from 'react'

import { PageViewTracker } from '@/features/storefront'

interface SiteLayoutProps {
  children: ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <PageViewTracker />
      {children}
    </>
  )
}
