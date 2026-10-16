/**
 * Growfin Analytics Client-side Utilities
 */

export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  try {
    let visitorId = localStorage.getItem('growfin_visitor_id');
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('growfin_visitor_id', visitorId);
    }
    return visitorId;
  } catch (e) {
    return 'vis_fallback_' + Math.random().toString(36).substring(2, 10);
  }
}

export function trackAnalyticsEvent(businessId: string, eventType: 'whatsapp_click' | 'page_view') {
  if (typeof window === 'undefined' || !businessId) return;

  const visitorId = getVisitorId();

  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        business_id: businessId,
        event_type: eventType,
        visitor_id: visitorId,
      }),
    }).catch((err) => console.error(`Failed to track ${eventType}:`, err));
  } catch (err) {
    console.error(`Failed to send ${eventType} analytics:`, err);
  }
}

export function trackWhatsAppClick(businessId: string) {
  trackAnalyticsEvent(businessId, 'whatsapp_click');
}
