import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { SocialProof } from '@/components/social-proof';
import { About } from '@/components/about';
import { Features } from '@/components/features';
import { DemoShowcase } from '@/components/demo-showcase';
import { Pricing } from '@/components/pricing';
import { Testimonials } from '@/components/testimonials';
import { FAQ } from '@/components/faq';
import { CTA } from '@/components/cta';
import { Footer } from '@/components/footer';
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
