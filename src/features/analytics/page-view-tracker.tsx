'use client'

import { useEffect } from 'react'

import { trackEvent } from './client'

export function PageViewTracker() {
  useEffect(() => {
    trackEvent('page_view')
  }, [])

  return null
}
