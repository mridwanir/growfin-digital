'use client';
import { useState } from 'react';
import { OnboardingModal } from './onboarding-modal';

export function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section id="home" className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                        <div className="max-w-xl">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark leading-[1.2] mb-6">
                                Bikin <span className="text-emerald">Website Bisnis</span> kamu online lebih gampang
                            </h1>
                            <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed">
                                Nggak perlu ribet coding. Cukup isi form, dan sistem kita akan siapin website premium buat usahamu, langsung live hari ini juga!
                            </p>
                            <div className="flex flex-wrap gap-4 items-center">
                                <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 bg-emerald hover:bg-emerald-light text-white text-sm font-extrabold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                                    Let's Go Digital 🚀
                                </button>
                            </div>
                        </div>

                        <div className="relative h-[400px] lg:h-[500px] w-full flex items-center justify-center">
                            <div className="absolute w-[80%] h-[80%] bg-emerald-soft blob-shape"></div>

                            <div className="relative z-10 w-full h-[110%] flex items-center justify-center mt-10 md:mt-0">
                                <img src="/image/landing/hero.png" alt="Hero Illustration" className="w-full h-full object-contain" />
                            </div>

                            <div className="absolute top-10 right-0 lg:right-10 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 floating z-20 border border-slate-50">
                                <div className="w-10 h-10 bg-emerald/10 rounded-full flex items-center justify-center text-xl">⚡</div>
                                <div>
                                    <p className="text-xs font-bold text-dark">Super Cepat</p>
                                    <p className="text-[10px] text-slate-400">Live Maks 24 Jam</p>
                                </div>
                            </div>

                            <div className="absolute bottom-10 left-0 lg:left-4 bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 floating-delayed z-20 border border-slate-50">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">🤝</div>
                                <div>
                                    <p className="text-[10px] text-slate-400">Telah dipercaya</p>
                                    <p className="text-xs font-bold text-dark">500+ UMKM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
