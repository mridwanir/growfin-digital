'use client';
import { useState } from 'react';
import { OnboardingModal } from './onboarding-modal';
import { siteConfig } from '@/lib/site-config';

export function ZigZag() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="py-24 bg-white overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl font-extrabold text-dark mb-6 leading-tight">
                                Fokus aja jualan, <br /><span className="text-emerald">Urusan Tech biar kita!</span>
                            </h2>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                Nggak usah pusing mikirin server, coding, atau error. Tim Growfin udah nyiapin infrastruktur yang rapi dan canggih biar kamu tinggal terima beres dan fokus naikin omset.
                            </p>
                            <a href={`https://wa.me/${siteConfig.contact.whatsappNumber}?text=Halo%20Growfin,%20saya%20Ingin%20Konsultasi.`} target="_blank" className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald hover:bg-emerald-light text-white text-sm font-extrabold rounded-full shadow-lg transition-all active:scale-95">
                                Konsultasi Gratis
                            </a>
                        </div>
                        <div className="order-1 md:order-2 relative h-[400px] flex items-center justify-center">
                            <div className="absolute w-[70%] h-[90%] bg-[#fff1b8] blob-shape"></div>
                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                <img src="/image/landing/zigzag.png" alt="Growfin Tech Infrastructure" className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="portofolio" className="py-24 bg-matcha-light overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="relative h-[400px] flex items-center justify-center">
                            <div className="absolute w-[80%] h-[80%] bg-emerald/20 blob-shape"></div>
                            <div className="relative z-10 w-[95%] h-[100%] flex items-center justify-center">
                                <img src="/image/landing/zigzag2.png" alt="Growfin Portofolio Mockup" className="w-full h-full object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-extrabold text-dark mb-6 leading-tight">
                                Portofolio <span className="text-emerald">Bisnis & UMKM</span> yang udah Go Digital
                            </h2>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                Mulai dari Klinik hingga Ritel, kami membantu memfasilitasi bisnis mereka agar tampil lebih profesional, terpercaya, dan siap go-digital.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3 transition-transform hover:scale-110">
                                    <img src="/image/landing/company/fake-company (11).png" alt="Portofolio 1" className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                                </div>
                                <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3 transition-transform hover:scale-110">
                                    <img src="/image/landing/company/fake-company (12).png" alt="Portofolio 2" className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                                </div>
                                <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3 transition-transform hover:scale-110">
                                    <img src="/image/landing/company/fake-company (13).png" alt="Portofolio 3" className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
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
