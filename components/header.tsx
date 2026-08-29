'use client';

import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const waUrl = "https://wa.me/6289668078854?text=Halo%20Growfin,%20saya%20tertarik%20konsultasi%20pembuatan%20website%20demo%20klinik";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Healthcare Partner Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                G
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-slate-900 leading-none tracking-tight">
                  Growfin<span className="text-blue-600">.my.id</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400">Clinic Growth Partner</span>
              </div>
            </Link>
            
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200/80">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
              Healthcare Partner
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#fitur" className="hover:text-blue-600 transition-colors">
              Fitur Unggulan
            </a>
            <a href="#demo" className="hover:text-blue-600 transition-colors">
              Demo Interaktif
            </a>
            <a href="#harga" className="hover:text-blue-600 transition-colors">
              Paket Harga
            </a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-extrabold rounded-full shadow-md shadow-emerald-600/20 transition-all"
            >
              <span>Konsultasi WA 💬</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <a
            href="#fitur"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 py-2 border-b border-slate-50"
          >
            Fitur Unggulan
          </a>
          <a
            href="#demo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 py-2 border-b border-slate-50"
          >
            Demo Interaktif
          </a>
          <a
            href="#harga"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 py-2 border-b border-slate-50"
          >
            Paket Harga
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs font-bold text-slate-700 py-2 border-b border-slate-50"
          >
            FAQ
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white text-xs font-extrabold rounded-full shadow-md mt-2"
          >
            <span>Konsultasi WA Sekarang 💬</span>
          </a>
        </div>
      )}
    </header>
  );
}
