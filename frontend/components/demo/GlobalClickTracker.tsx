'use client';

import { useEffect } from 'react';

interface GlobalClickTrackerProps {
  businessId: string;
}

export function GlobalClickTracker({ businessId }: GlobalClickTrackerProps) {
  useEffect(() => {
    // Generate a simple session-based visitor ID if not exists
    let visitorId = sessionStorage.getItem('growfin_visitor_id');
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem('growfin_visitor_id', visitorId);
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Look for the closest anchor or button
      const closestElement = target.closest('a, button');
      if (!closestElement) return;

      const href = closestElement.getAttribute('href') || '';
      const text = closestElement.textContent?.toLowerCase() || '';
      
      // Determine if it's a WhatsApp action
      // E.g., href contains wa.me, or text contains whatsapp/pesan/booking
      const isWhatsappHref = href.includes('wa.me') || href.includes('whatsapp.com') || href.includes('api.whatsapp.com');
      const isWhatsappText = text.includes('whatsapp') || text.includes('pesan via wa') || text.includes('booking via wa') || text.includes('hubungi kami');

      if (isWhatsappHref || isWhatsappText) {
        // Fire and forget analytics event
        fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId,
            event_type: 'whatsapp_click',
            visitor_id: visitorId
          })
        }).catch((err) => console.error('Failed to track click', err));
      }
    };

    // Use event delegation on the document
    document.addEventListener('click', handleClick);
    
    // Also track page view initially
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        business_id: businessId,
        event_type: 'page_view',
        visitor_id: visitorId
      })
    }).catch((err) => console.error('Failed to track pageview', err));

    return () => document.removeEventListener('click', handleClick);
  }, [businessId]);

  return null;
}
