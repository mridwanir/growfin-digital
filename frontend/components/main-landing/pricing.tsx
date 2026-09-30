'use client';
import { siteConfig } from '@/lib/site-config';

export function Pricing() {
  return (
    <section id="harga" className="py-24 bg-white border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-extrabold text-dark mb-4">Pilih Paket <span className="text-emerald">Investasi</span> Anda</h2>
                <p className="text-slate-500 font-medium">Harga jujur, tanpa biaya tersembunyi, siap bantu kembangkan bisnis Anda.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                {siteConfig.pricing.map((plan, index) => {
                    const isFeatured = plan.isFeatured;
                    const iconMap: Record<string, string> = {
                        'instan': '/image/landing/icon/instan.png',
                        'pro-basic': '/image/landing/icon/pro-basic.png',
                        'pro-advanced': '/image/landing/icon/pro-advance.png',
                        'enterprise': '/image/landing/icon/enterprise.png'
                    };
                    const iconSrc = iconMap[plan.id] || iconMap['instan'];
                    
                    if (isFeatured) {
                        return (
                            <div key={plan.id} className="bg-emerald rounded-[2rem] p-8 shadow-2xl hover-lift text-center flex flex-col relative transform md:-translate-y-4">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fff1b8] text-dark text-[10px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap">Paling Laris ✨</div>
                                
                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 px-3 py-1 rounded-full mx-auto mb-4 backdrop-blur-sm">{plan.badgeId}</span>
                                <h3 className="text-xl font-extrabold text-white">{plan.titleId}</h3>
                                <p className="text-xs text-emerald-soft mt-2 h-8">{plan.descId}</p>
                                
                                <img src={iconSrc} alt={plan.titleId} className="w-24 h-24 mx-auto my-6 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)]" />
                                
                                <div className="mb-2"><span className="text-3xl font-extrabold text-white">{plan.price || plan.priceId}</span></div>
                                <p className="text-[10px] text-emerald-soft mb-6 font-semibold pb-6 border-b border-white/20">{plan.periodId}</p>
                                
                                <ul className="space-y-3 text-[13px] text-white text-left grow mb-8">
                                    {plan.featuresId.map((feature: any, i: number) => {
                                        const text = typeof feature === 'object' ? feature.text : feature;
                                        const isBold = typeof feature === 'object' ? feature.bold : false;
                                        return (
                                            <li key={i} className="flex items-start gap-2">
                                                <span>✅</span>
                                                <span className={isBold ? "font-bold" : ""}>{text}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <a href={`https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20${plan.titleId}.`} target="_blank" className="w-full py-3.5 bg-white text-emerald font-extrabold rounded-full hover:bg-soft transition-all shadow-md flex justify-center">
                                    {plan.buttonId}
                                </a>
                            </div>
                        )
                    }

                    return (
                        <div key={plan.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl hover-lift text-center flex flex-col">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full mx-auto mb-4">{plan.badgeId}</span>
                            <h3 className="text-xl font-extrabold text-dark">{plan.titleId}</h3>
                            <p className="text-xs text-slate-500 mt-2 h-8">{plan.descId}</p>
                            
                            <img src={iconSrc} alt={plan.titleId} className="w-24 h-24 mx-auto my-6 object-contain drop-shadow-xl" />
                            
                            <div className="mb-2"><span className="text-3xl font-extrabold text-emerald">{plan.price || plan.priceId}</span></div>
                            <p className="text-[10px] text-slate-400 mb-6 font-semibold pb-6 border-b border-slate-100">{plan.periodId}</p>
                            
                            <ul className="space-y-3 text-[13px] text-slate-600 text-left grow mb-8">
                                {plan.featuresId.map((feature: any, i: number) => {
                                    const text = typeof feature === 'object' ? feature.text : feature;
                                    const isBold = typeof feature === 'object' ? feature.bold : false;
                                    return (
                                        <li key={i} className="flex items-start gap-2">
                                            <span>✅</span>
                                            <span className={isBold ? "font-bold text-slate-800" : ""}>{text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <a href={`https://wa.me/6289630352370?text=Halo%20Growfin,%20saya%20tertarik%20dengan%20Paket%20${plan.titleId}.`} target="_blank" className="w-full py-3.5 bg-emerald-soft text-emerald font-extrabold rounded-full hover:bg-emerald hover:text-white transition-all flex justify-center">
                                {plan.buttonId}
                            </a>
                        </div>
                    )
                })}
            </div>
        </div>
    </section>
  );
}
