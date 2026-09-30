'use client';
import { useState } from 'react';
import { OnboardingModal } from './onboarding-modal';
import Link from 'next/link';

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-20 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <img src="/image/landing/growfin-logo-icon.png" alt="Growfin Logo" className="w-9 h-9 object-contain" />
                    <span className="text-dark font-extrabold tracking-tight text-2xl">Growfin</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-[14px] font-bold">
                    <Link href="#home" className="text-emerald">Beranda</Link>
                    <Link href="#layanan" className="text-slate-500 hover:text-emerald transition-colors">Layanan</Link>
                    <Link href="#portofolio" className="text-slate-500 hover:text-emerald transition-colors">Portofolio</Link>
                    <Link href="#harga" className="text-slate-500 hover:text-emerald transition-colors">Harga</Link>
                </nav>
                <div className="flex gap-4">
                    <Link href="/login" className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-slate-600 hover:text-emerald font-bold transition-all">Log in</Link>
                    <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald text-white hover:bg-emerald-light text-[13px] font-extrabold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                        Daftar Sekarang
                    </button>
                </div>
            </div>
        </div>
      </header>
      <OnboardingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
