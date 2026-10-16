const sanitizeId = (id?: string) => id?.replace(/[`'"]/g, '').trim() || undefined;

export const META_PIXEL_ID = sanitizeId(process.env.NEXT_PUBLIC_META_PIXEL_ID);
export const TIKTOK_PIXEL_ID = sanitizeId(process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID);
export const GTAG_ID = sanitizeId(process.env.NEXT_PUBLIC_GTAG_ID);

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    ttq?: any;
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Standard Meta Pixel PageView
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Unified Ad Event Tracker (Meta Pixel, TikTok, & Google Tag)
 */
export const trackMetaEvent = (eventName: string, options: Record<string, any> = {}) => {
  if (typeof window === 'undefined') return;

  // 1. Meta Pixel
  if (window.fbq) {
    window.fbq('track', eventName, options);
  }

  // 2. TikTok Pixel (if active)
  if (window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track(eventName, options);
  }

  // 3. Google Tag / Google Ads (if active)
  if (window.gtag) {
    window.gtag('event', eventName, options);
  }
};
