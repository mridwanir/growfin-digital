'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { OnboardingModal } from './onboarding-modal';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-soft-gray/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left: Brand Logo & Code-rendered Name */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group cursor-pointer rounded-lg min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
            >
              <Image
                src="/meracikweb-icon.png"
                alt="MeracikWeb Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain transition-transform group-hover:scale-105 motion-reduce:group-hover:scale-100"
              />
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-midnight-navy font-extrabold text-xl">Meracik</span>
                <span className="text-electric-blue italic font-extrabold text-xl">Web</span>
              </span>
            </Link>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
              <Link
                href="#layanan"
                className="inline-flex items-center min-h-[44px] px-3 py-3 text-slate-body hover:text-electric-blue font-semibold text-sm transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Fitur
              </Link>
              <Link
                href="#portofolio"
                className="inline-flex items-center min-h-[44px] px-3 py-3 text-slate-body hover:text-electric-blue font-semibold text-sm transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Template
              </Link>
              <Link
                href="#harga"
                className="inline-flex items-center min-h-[44px] px-3 py-3 text-slate-body hover:text-electric-blue font-semibold text-sm transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Paket
              </Link>
              <Link
                href="#faq"
                className="inline-flex items-center min-h-[44px] px-3 py-3 text-slate-body hover:text-electric-blue font-semibold text-sm transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Bantuan
              </Link>
            </nav>

            {/* Right: Login & Primary CTA Button */}
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="hidden md:inline-flex items-center min-h-[44px] px-3 py-3 text-slate-body hover:text-electric-blue font-semibold text-sm transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Login
              </Link>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center min-h-[44px] gap-1.5 bg-electric-blue hover:bg-electric-blue-hover text-white rounded-lg px-5 py-2.5 sm:px-6 sm:py-2.5 font-bold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Mulai Sekarang <span>→</span>
              </button>
              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
                aria-expanded={isMobileMenuOpen}
                className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-lg text-slate-body hover:text-electric-blue hover:bg-light-blue transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={2} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Nav Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-soft-gray/30 bg-white/95 backdrop-blur-md px-4 pt-4 pb-6 shadow-lg">
            <nav className="flex flex-col gap-3">
              <Link
                href="#layanan"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center min-h-[44px] px-3 text-slate-body hover:text-electric-blue font-semibold text-base transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Fitur
              </Link>
              <Link
                href="#portofolio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center min-h-[44px] px-3 text-slate-body hover:text-electric-blue font-semibold text-base transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Template
              </Link>
              <Link
                href="#harga"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center min-h-[44px] px-3 text-slate-body hover:text-electric-blue font-semibold text-base transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Paket
              </Link>
              <Link
                href="#faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center min-h-[44px] px-3 text-slate-body hover:text-electric-blue font-semibold text-base transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Bantuan
              </Link>
              <div className="pt-3 border-t border-soft-gray/30 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex items-center min-h-[44px] px-3 text-slate-body hover:text-electric-blue font-semibold text-base transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
                >
                  Login
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full inline-flex items-center justify-center min-h-[44px] gap-1.5 bg-electric-blue hover:bg-electric-blue-hover text-white rounded-lg px-5 py-3 font-bold text-sm transition-all shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
                >
                  Mulai Sekarang <span>→</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
