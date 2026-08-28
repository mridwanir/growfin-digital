import { Benefits } from '@/components/benefits'
import { CTA } from '@/components/cta'
import { Features } from '@/components/features'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Pricing } from '@/components/pricing'

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <Benefits />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

