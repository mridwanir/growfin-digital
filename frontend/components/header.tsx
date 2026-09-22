'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { language, toggleLanguage } = useLanguage();

  const waUrl = "https://wa.me/6289668078854?text=Hello%20Growfin,%20I'm%20interested%20in%20your%20software%20development%20and%20AI%20services.";

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for header height

      let currentActive = 'home';
      for (const link of navLinks) {
        const element = document.getElementById(link.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentActive = link.id;
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#262633] bg-[#0B0B0E]/90 backdrop-blur-md transition-all">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Identifier (Left) */}
          <div className="flex items-center gap-2">
            <Link href="#home" className="flex items-center gap-2 group">
              {/* Logoipsum generic SVG logo */}
              <svg viewBox="0 0 100 100" className="w-8 h-8 text-[#00b894]" fill="currentColor">
                <path d="M50 0L100 25V75L50 100L0 75V25L50 0ZM50 18.5L20 33.5V66.5L50 81.5L80 66.5V33.5L50 18.5Z" />
              </svg>
              <span className="text-[#FFFFFF] font-black tracking-tight text-xl">Growfin</span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`transition-colors duration-300 ${
                  activeSection === link.id
                    ? 'text-[#FFFFFF] font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'
                    : 'text-[#8E8EA0] hover:text-[#FFFFFF]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Primary Conversion Action (Right) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="text-xs font-bold text-[#8E8EA0] hover:text-[#FFFFFF] uppercase border border-[#262633] px-3 py-1.5 rounded-full transition-colors"
            >
              {language === 'en' ? 'EN' : 'ID'}
            </button>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-[#00b894] hover:bg-[#00e0b8] text-[#FFFFFF] text-[13px] font-semibold rounded-full shadow-md transition-all hover:shadow-[0_0_15px_rgba(112,66,244,0.4)]"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleLanguage}
              className="text-[10px] font-bold text-[#8E8EA0] hover:text-[#FFFFFF] uppercase border border-[#262633] px-2 py-1 rounded-full transition-colors"
            >
              {language === 'en' ? 'EN' : 'ID'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#FFFFFF] hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#262633] bg-[#14141A] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-300 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs py-2 border-b border-[#262633] uppercase tracking-wide transition-colors ${
                activeSection === link.id ? 'font-black text-[#00e0b8]' : 'font-bold text-[#FFFFFF]'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#00b894] hover:bg-[#00e0b8] text-[#FFFFFF] text-xs font-extrabold rounded-full shadow-md mt-2 transition-colors"
          >
            <span>Contact Us &rarr;</span>
          </a>
        </div>
      )}
    </header>
  );
}
