import { ArchetypeSwitcher } from '@/components/marketing/archetypes'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingHeader, MarketingHero } from '@/components/marketing/hero'
import { WhatsAppSimulator } from '@/components/marketing/order-engine'
import { PricingMatrix } from '@/components/marketing/pricing'

export default function Home() {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Keyboard accessible skip-to-content link */}
      <a
        className="bg-primary text-primary-foreground focus-visible:ring-primary focus-visible:ring-offset-background sr-only focus-visible:not-sr-only focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:px-4 focus-visible:py-2 focus-visible:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2"
        data-testid="skip-to-content-link"
        href="#main-content"
      >
        Lewati ke konten utama
      </a>

      {/* Brand Header Navigation */}
      <MarketingHeader />

      {/* Main Landmark */}
      <main className="flex-1 outline-hidden" id="main-content" tabIndex={-1}>
        {/* Screen 1: Hero & Interactive Storefront Editor Simulator */}
        <MarketingHero />

        {/* Screen 2: Archetype Switcher (F&B and Retail) */}
        <ArchetypeSwitcher />

        {/* Screen 3: WhatsApp Order Engine Simulator */}
        <WhatsAppSimulator />

        {/* Screen 4: Transparent Three-Tier Pricing Matrix */}
        <PricingMatrix />
      </main>

      {/* Screen 5: Close Conversion Trigger & Brand Platform Footer */}
      <MarketingFooter />
    </div>
  )
}
