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
  title: 'Growfin Digital | Website Bisnis Super Cepat!',
  description: 'Nggak perlu ribet coding. Cukup isi form simpel, dan sistem kita bakal siapin website super premium buat UMKM u langsung live hari ini juga!',
};

export default function Page() {
  return (
    <>
      <Header />
      <main>
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
