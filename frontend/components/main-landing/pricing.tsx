'use client';
import { useLanguage } from '@/lib/language-context';
import { siteConfig } from '@/lib/site-config';
import { PricingCard } from './PricingCard';

export function Pricing() {
  const { language } = useLanguage();

  return (
    <section id="pricing" className="py-24 bg-[#0B0B0E]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#00e0b8] bg-[#00b894]/10 px-3 py-1 rounded-full border border-[#00b894]/20">
            {language === 'en' ? 'Investment Plans' : 'Rencana Investasi'}
          </span>
          <h2 className="text-3xl font-black text-[#FFFFFF] sm:text-5xl tracking-tight">
            {language === 'en' ? (
              <>Affordable Pricing for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b894] to-[#00e0b8]">Growing Businesses</span></>
            ) : (
              <>Harga Terjangkau untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00b894] to-[#00e0b8]">UMKM Indonesia</span></>
            )}
          </h2>
          <p className="text-sm sm:text-lg text-[#8E8EA0] leading-relaxed font-medium">
            {language === 'en'
              ? 'From ready-to-use instant templates to fully custom software solutions for rapidly growing businesses.'
              : 'Mulai dari template instan yang siap pakai hari ini, hingga solusi software kustom untuk bisnis yang sedang berkembang pesat.'}
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 items-stretch">
          {siteConfig.pricing.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
