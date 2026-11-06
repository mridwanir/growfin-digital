'use client';

import { Check } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';

type PricingFeature = string | { text: string; bold?: boolean };

function getFeatureInfo(feature: PricingFeature): { text: string; bold: boolean } {
  if (typeof feature === 'object' && feature !== null) {
    return { text: feature.text, bold: Boolean(feature.bold) };
  }
  return { text: String(feature), bold: false };
}

function getPlanPrice(plan: (typeof siteConfig.pricing)[number]): string {
  if ('price' in plan && typeof plan.price === 'string') {
    return plan.price;
  }
  if ('priceId' in plan && typeof plan.priceId === 'string') {
    return plan.priceId;
  }
  return '';
}

export function Pricing() {
  const whatsappNumber = siteConfig?.contact?.whatsappNumber || '6289630352370';

  const iconMap: Record<string, string> = {
    'instan': '/image/landing/icon/instan.png',
    'pro-basic': '/image/landing/icon/pro-basic.png',
    'pro-advanced': '/image/landing/icon/pro-advance.png',
    'enterprise': '/image/landing/icon/enterprise.png'
  };

  return (
    <section id="harga" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-midnight-navy mb-4 tracking-tight text-balance">
            Pilih Paket <span className="text-electric-blue">Investasi</span> Anda
          </h2>
          <p className="text-slate-body font-medium text-base sm:text-lg text-pretty">
            Harga jujur, tanpa biaya tersembunyi, siap bantu kembangkan bisnis Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {siteConfig.pricing.map((plan) => {
            const isFeatured = plan.isFeatured;
            const waLink = `https://wa.me/${whatsappNumber}?text=Halo%20MeracikWeb,%20saya%20tertarik%20dengan%20Paket%20${encodeURIComponent(plan.titleId)}.`;
            const price = getPlanPrice(plan);

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-7 flex flex-col transition-all shadow-xs ${
                  isFeatured
                    ? 'bg-white border-2 border-electric-blue shadow-xl relative'
                    : 'bg-white border border-soft-gray/30 hover:border-soft-gray/60'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-electric-blue text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm whitespace-nowrap">
                    Paling Laris
                  </div>
                )}

                <h3 className="text-xl font-bold text-midnight-navy text-balance">{plan.titleId}</h3>

                <div className="pt-4 pb-5 mb-5 border-b border-soft-gray/50">
                  <div className="text-3xl font-extrabold text-midnight-navy">{price}</div>
                  <div className="text-xs text-slate-body font-semibold mt-1">{plan.periodId}</div>
                </div>

                <div className="grow mb-7">
                  <div className="text-xs font-bold text-midnight-navy uppercase tracking-wider mb-3">Fitur Termasuk</div>
                  <ul className="space-y-3 text-[13px] text-slate-body">
                    {plan.featuresId.map((feature: PricingFeature, i: number) => {
                      const { text, bold } = getFeatureInfo(feature);
                      return (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-4 h-4 rounded-full bg-light-blue flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-electric-blue" strokeWidth={3} />
                          </span>
                          <span className={bold ? 'font-bold text-midnight-navy' : ''}>{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full min-h-11 py-3.5 font-bold rounded-xl transition-all flex items-center justify-center text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 ${
                    isFeatured
                      ? 'bg-electric-blue text-white hover:bg-electric-blue-hover shadow-md'
                      : 'bg-light-blue text-midnight-navy hover:bg-electric-blue hover:text-white'
                  }`}
                >
                  {plan.buttonId}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
