import { Header } from '@/components/main-landing/header';
import { Hero } from '@/components/main-landing/hero';
import { SocialProof } from '@/components/main-landing/social-proof';
import { About } from '@/components/main-landing/about';
import { Features } from '@/components/main-landing/features';
import { DemoShowcase } from '@/components/main-landing/demo-showcase';
import { Pricing } from '@/components/main-landing/pricing';
import { Testimonials } from '@/components/main-landing/testimonials';
import { FAQ } from '@/components/main-landing/faq';
import { CTA } from '@/components/main-landing/cta';
import { Footer } from '@/components/main-landing/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Growfin Digital | Premium Software Engineering & AI Automation',
  description: 'We build scalable web and mobile applications, integrate AI-driven automation, and craft premium digital experiences to accelerate your business growth.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] font-sans antialiased text-[#FFFFFF] selection:bg-[#00b894] selection:text-white">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <About />
        <Features />
        <DemoShowcase />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
