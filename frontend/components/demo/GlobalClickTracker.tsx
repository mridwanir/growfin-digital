'use client';

import { useEffect } from 'react';
import { getVisitorId } from '@/lib/analytics';

interface GlobalClickTrackerProps {
  businessId: string;
}

export function GlobalClickTracker({ businessId }: GlobalClickTrackerProps) {
  useEffect(() => {
    // Generate/retrieve persistent visitor ID from localStorage
    const visitorId = getVisitorId();
    let lastTrackedTime = 0;
    const DEBOUNCE_MS = 1500;

    const trackClick = () => {
      const now = Date.now();
      if (now - lastTrackedTime < DEBOUNCE_MS) {
        return; // Ignore duplicate clicks within cooldown period
      }
      lastTrackedTime = now;

      // Fire and forget analytics event with keepalive
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          business_id: businessId,
          event_type: 'whatsapp_click',
          visitor_id: visitorId,
        }),
      }).catch((err) => console.error('Failed to track click', err));
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. Explicit data-track="whatsapp" attribute check
      const trackAttrElement = target.closest('[data-track="whatsapp"]');
      if (trackAttrElement) {
        trackClick();
        return;
      }

      // 2. Fallback anchor or button checking
      const closestElement = target.closest('a, button');
      if (!closestElement) return;

      const href = closestElement.getAttribute('href') || '';
      const text = closestElement.textContent?.toLowerCase() || '';

      const isWhatsappHref =
        href.includes('wa.me') ||
        href.includes('whatsapp.com') ||
        href.includes('api.whatsapp.com');

      const isWhatsappText =
        text.includes('whatsapp') ||
        text.includes('pesan via wa') ||
        text.includes('booking via wa') ||
        text.includes('via wa') ||
        text.includes('tanya cs') ||
        text.includes('hubungi kami');

      if (isWhatsappHref || isWhatsappText) {
        trackClick();
      }
    };

    const handleSubmit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (!form) return;
      const hasWaTracker = form.querySelector('[data-track="whatsapp"]');
      if (hasWaTracker) {
        trackClick();
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);

    // Initial page view track with keepalive
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        business_id: businessId,
        event_type: 'page_view',
        visitor_id: visitorId,
      }),
    }).catch((err) => console.error('Failed to track pageview', err));

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [businessId]);

  return null;
}
