/**
 * Growfin Analytics Client-side Utilities
 */

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'anonymous'
  try {
    let visitorId = localStorage.getItem('growfin_visitor_id')
    if (!visitorId) {
      visitorId = `vis_${Math.random().toString(36).substring(2, 10)}`
      localStorage.setItem('growfin_visitor_id', visitorId)
    }
    return visitorId
  } catch {
    return `vis_fallback_${Math.random().toString(36).substring(2, 10)}`
  }
}
