# Server-side visitor hashing with no client-side state for storefront analytics

The rebuilt analytics system uses server-side visitor identification (SHA-256 hash of IP, user agent, tenant ID, and a daily-rotating HMAC salt) instead of client-side cookies or localStorage. This trades cross-day visitor tracking and accuracy under NAT/VPN for zero client-side storage dependencies, no cookie consent requirements, and a simpler collection path. The daily salt rotation means the same visitor gets a new hash each day, limiting analysis to same-day unique counts.

All third-party analytics (Meta Pixel, Vercel Analytics, TikTok Pixel, Google Tag) are dropped. No tenants run paid ads through the platform, so there is no conversion attribution to preserve.

## Considered options

- **Client-side UUID in localStorage** (industry standard: GA4, Mixpanel, Amplitude): accurate multi-session tracking, but requires cookie/storage consent under Indonesian PDP law, adds client-side state management, and the platform's storefront visitors are not logged-in users who would benefit from long-term identity.
- **Server-side fingerprint with longer salt rotation** (weekly, monthly): enables cross-day retention analysis, but increases the window in which a hash could theoretically be correlated back to a visitor, contradicting the privacy rationale.

## Consequences

- "Returning visitors" cannot be measured across days. If cross-day retention becomes a requirement, this decision must be revisited.
- Visitors behind shared NAT or VPN with the same browser are counted as one. Visitors switching networks (wifi to cellular) are counted as two. These inaccuracies are accepted.
- The `acquisition` data (UTM params, Referer) is recorded only on `page_view` events. Attributing a checkout to a traffic source requires joining on `visitor_hash` within the same day.
