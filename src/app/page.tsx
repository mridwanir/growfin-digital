import { ArchetypeSwitcher } from '@/components/marketing/archetypes'
import { MarketingFooter } from '@/components/marketing/footer'
import { MarketingHero } from '@/components/marketing/hero'
import { WhatsAppSimulator } from '@/components/marketing/order-engine'
import { PricingMatrix } from '@/components/marketing/pricing'

export default function Home() {
  return (
    <div className="bg-background text-foreground relative flex min-h-screen flex-col overflow-x-hidden">
      {/* Keyboard accessible skip-to-content link */}
      <a
        className="bg-primary text-primary-foreground focus:ring-ring sr-only focus:not-sr-only focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:shadow-md focus:ring-2 focus:outline-hidden"
        data-testid="skip-to-content-link"
        href="#main-content"
      >
        Lewati ke konten utama
      </a>

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

        {/* Screen 5: Close Conversion Trigger & Brand Platform Footer */}
        <MarketingFooter />
      </main>
    </div>
  )
}
