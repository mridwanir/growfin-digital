'use client';

import { useState } from 'react';
import Image from 'next/image';
import { OnboardingModal } from './onboarding-modal';
import { siteConfig } from '@/lib/site-config';

export function ZigZag() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const whatsappNumber = siteConfig?.contact?.whatsappNumber || '6289630352370';

  return (
    <>
      <section className="py-24 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-extrabold text-midnight-navy mb-6 leading-tight text-balance">
                Fokus aja jualan, <br />
                <span className="text-electric-blue">Urusan Tech biar kami!</span>
              </h2>
              <p className="text-slate-body font-medium mb-8 leading-relaxed text-pretty">
                Nggak usah pusing mikirin server, coding, atau error. Tim MeracikWeb udah nyiapin infrastruktur yang rapi dan canggih biar kamu tinggal terima beres dan fokus naikin omset.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Halo%20MeracikWeb,%20saya%20Ingin%20Konsultasi.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-11 min-w-11 border border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white rounded-lg px-8 py-3.5 font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Konsultasi Gratis
              </a>
            </div>
            <div className="order-1 md:order-2 relative h-100 flex items-center justify-center">
              <div className="absolute inset-4 bg-linear-to-br from-electric-blue/10 to-sky-cyan/10 rounded-3xl" />
              <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
                <Image
                  src="/image/landing/zigzag.png"
                  alt="MeracikWeb Tech Infrastructure"
                  width={560}
                  height={420}
                  loading="lazy"
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portofolio" className="py-24 bg-ice-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative h-100 flex items-center justify-center">
              <div className="absolute inset-4 bg-linear-to-br from-electric-blue/10 to-sky-cyan/10 rounded-3xl" />
              <div className="relative z-10 w-[95%] h-full flex items-center justify-center p-4">
                <Image
                  src="/image/landing/zigzag2.png"
                  alt="MeracikWeb Portofolio Mockup"
                  width={560}
                  height={420}
                  loading="lazy"
                  className="w-full h-full object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-midnight-navy mb-6 leading-tight text-balance">
                Portofolio <span className="text-electric-blue">Bisnis & UMKM</span> yang udah Go Digital
              </h2>
              <p className="text-slate-body font-medium mb-8 leading-relaxed text-pretty">
                Mulai dari klinik hingga ritel, kami membantu bisnis mereka tampil lebih profesional, terpercaya, dan siap go-digital.
              </p>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-white border border-soft-gray/30 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3 transition-transform hover:scale-110">
                  <Image
                    src="/image/landing/company/fake-company (11).png"
                    alt="Katalog Ritel & Toko"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                <div className="w-16 h-16 bg-white border border-soft-gray/30 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3 transition-transform hover:scale-110">
                  <Image
                    src="/image/landing/company/fake-company (12).png"
                    alt="Katalog Klinik Gigi"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                <div className="w-16 h-16 bg-white border border-soft-gray/30 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3 transition-transform hover:scale-110">
                  <Image
                    src="/image/landing/company/fake-company (13).png"
                    alt="Katalog Kafe & Restoran"
                    width={64}
                    height={64}
                    className="w-full h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
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
