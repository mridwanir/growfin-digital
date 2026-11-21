import type { ReactNode } from 'react'

import { PageViewTracker } from '@/components/storefront'

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
