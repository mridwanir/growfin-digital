export type AnalyticsEvent = 'page_view' | 'checkout_start' | 'checkout_complete'

function getSlugFromPathname(pathname: string): string | null {
  const match = pathname.match(/^\/site\/([^/?#]+)/)
  return match ? match[1] : null
}

export function trackEvent(event: AnalyticsEvent, metadata?: Record<string, unknown>): void {
  if (typeof window === 'undefined' || !window.location) {
    return
  }

  const slug = getSlugFromPathname(window.location.pathname || '')
  if (!slug) {
    return
  }

  let endpoint = '/api/analytics/track'

  if (event === 'page_view' && window.location.search) {
    const searchParams = new URLSearchParams(window.location.search)
    const utmParams = new URLSearchParams()
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
      const val = searchParams.get(key)
      if (val) {
        utmParams.set(key, val)
      }
    }
    const queryString = utmParams.toString()
    if (queryString) {
      endpoint = `${endpoint}?${queryString}`
    }
  }

  fetch(endpoint, {
    keepalive: true,
    method: 'POST',
    body: JSON.stringify({
      event,
      metadata,
      slug,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {
    // Errors silently caught (fire-and-forget)
  })
}
