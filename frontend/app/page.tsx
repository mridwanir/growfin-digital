import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import { Features } from '@/components/features';
import { DemoShowcase } from '@/components/demo-showcase';
import { Pricing } from '@/components/pricing';
import { FAQ } from '@/components/faq';
import { Footer } from '@/components/footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Growfin — Partner Pertumbuhan Pasien Klinik Local (Dental, Aesthetic, Medical)',
  description: 'Konversi traffic Google Maps klinik Anda menjadi reservasi pasien WhatsApp dalam hitungan detik. Tanpa komisi per pasien & 100% mobile-first.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 selection:bg-blue-600 selection:text-white">
      <Header />
      <main>
        <Hero />
        <Features />
        <DemoShowcase />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
