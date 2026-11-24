import type { ReactNode } from 'react'

import { PageViewTracker } from '@/features/analytics'

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
