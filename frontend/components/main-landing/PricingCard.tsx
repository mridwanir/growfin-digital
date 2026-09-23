'use client';
import { useLanguage } from '@/lib/language-context';
import { siteConfig } from '@/lib/site-config';

type PricingFeature = string | { text: string; bold?: boolean };

interface PricingCardProps {
  plan: typeof siteConfig.pricing[0];
}

export function PricingCard({ plan }: PricingCardProps) {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const badge = isEn ? plan.badgeEn : plan.badgeId;
  const featuredBadge = isEn ? plan.featuredBadgeEn : plan.featuredBadgeId;
  const title = isEn ? plan.titleEn : plan.titleId;
  const desc = isEn ? plan.descEn : plan.descId;
  
  const price = (plan as any).priceEn ? (isEn ? (plan as any).priceEn : (plan as any).priceId) : plan.price;
  
  const period = isEn ? plan.periodEn : plan.periodId;
  const features = isEn ? plan.featuresEn : plan.featuresId;
  const buttonText = isEn ? plan.buttonEn : plan.buttonId;
  const waLink = siteConfig.contact.waLinks[plan.linkKey as keyof typeof siteConfig.contact.waLinks];

  if (plan.isFeatured) {
    return (
      <div className="relative flex flex-col justify-between rounded-3xl bg-gradient-to-b from-[#00b894]/20 to-[#0B0B0E] p-8 text-white shadow-[0_0_30px_rgba(0,184,148,0.15)] border-2 border-[#00b894] transform xl:-translate-y-4">
        {featuredBadge && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00b894] to-[#00e0b8] text-[#14141A] text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
            {featuredBadge}
          </div>
        )}
        <div className="space-y-6">
          <div>
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#00e0b8] bg-[#00b894]/10 px-3 py-1 rounded-full mb-2 border border-[#00b894]/20">
              {badge}
            </span>
            <h3 className="text-xl font-black text-white">{title}</h3>
            <p className="text-xs text-[#8E8EA0] mt-1 font-medium">{desc}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-black text-white">{price}</span>
            <span className="text-[10px] font-medium text-[#8E8EA0]">{period}</span>
          </div>
          <ul className="space-y-3 text-xs font-semibold text-[#8E8EA0] border-t border-[#262633] pt-5">
            {features.map((feature: PricingFeature, idx: number) => {
              const text = typeof feature === 'string' ? feature : feature.text;
              const isBold = typeof feature !== 'string' && feature.bold;
              return (
                <li key={idx} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894] text-[#FFFFFF] text-xs font-bold">✓</span>
                  <span className={isBold ? "font-extrabold text-white" : "text-[#FFFFFF]"}>{text}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="pt-8 mt-6">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#00b894] to-[#00e0b8] hover:from-[#00e0b8] hover:to-[#00b894] active:scale-98 text-[#14141A] text-xs font-black rounded-2xl shadow-lg transition-all"
          >
            <span>{buttonText}</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-3xl bg-[#14141A] p-8 border border-[#262633] shadow-sm hover:border-[#00b894]/50 transition-all">
      <div className="space-y-6">
        <div>
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#8E8EA0] bg-[#262633] px-3 py-1 rounded-full mb-2">
            {badge}
          </span>
          <h3 className="text-xl font-black text-[#FFFFFF]">{title}</h3>
          <p className="text-xs text-[#8E8EA0] mt-1 font-medium">{desc}</p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-3xl font-black text-[#FFFFFF]">{price}</span>
          <span className="text-[10px] font-medium text-[#8E8EA0]">{period}</span>
        </div>
        <ul className="space-y-3 text-xs font-semibold text-[#8E8EA0] border-t border-[#262633] pt-5">
          {features.map((feature: PricingFeature, idx: number) => {
            const text = typeof feature === 'string' ? feature : feature.text;
            const isBold = typeof feature !== 'string' && feature.bold;
            return (
              <li key={idx} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00b894]/20 text-[#00e0b8] text-xs font-bold">✓</span>
                <span className={isBold ? "font-bold text-white" : ""}>{text}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pt-8 mt-6">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#262633] hover:bg-[#00b894]/20 active:scale-98 text-[#FFFFFF] text-xs font-black rounded-2xl shadow-md transition-all border border-[#262633]"
        >
          <span>{buttonText}</span>
        </a>
      </div>
    </div>
  );
}
