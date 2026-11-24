export type AnalyticsEvent = 'page_view' | 'checkout_start' | 'checkout_complete'

export interface Acquisition {
  campaign?: string
  medium?: string
  referrer?: string
  source?: string
}

export interface TenantAnalyticsMetrics {
  checkoutCompletes: number
  checkoutStarts: number
  conversionRate: number
  pageViews: number
  topSources: Array<{ count: number; source: string }>
  uniqueVisitors: number
}

export interface TrackEventPayload {
  event?: unknown
  metadata?: unknown
  slug?: unknown
}
