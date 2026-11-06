import { Header } from '@/components/main-landing/header';
import { Hero } from '@/components/main-landing/hero';
import { SocialProof } from '@/components/main-landing/social-proof';
import { Features } from '@/components/main-landing/features';
import { ZigZag } from '@/components/main-landing/zig-zag';
import { Pricing } from '@/components/main-landing/pricing';
import { FAQ } from '@/components/main-landing/faq';
import { CTA } from '@/components/main-landing/cta';
import { Footer } from '@/components/main-landing/footer';
import { FloatingWhatsApp } from '@/components/main-landing/floating-whatsapp';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MeracikWeb | Racik Website Cepat Sesuai Gayamu',
  description: 'Buat website profesional untuk bisnis, UMKM, atau personal brand dengan mudah, cepat, dan siap online.',
};

export default function Page() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <SocialProof />
        <Features />
        <ZigZag />
        <Pricing />
        <FAQ />
      </main>
      <CTA />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
