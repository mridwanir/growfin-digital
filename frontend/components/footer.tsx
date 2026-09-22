'use client';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export function Footer() {
  const { language } = useLanguage();
  const waUrl = "https://wa.me/6289668078854?text=Hello%20Growfin,%20I'd%20like%20to%20consult%20about%20a%20software%20project.";

  return (
    <footer className="bg-[#0B0B0E] text-white pt-16 pb-12 border-t border-[#262633]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <img src="/image/growfin_landscape.png" alt="Growfin Digital" className="h-8 object-contain brightness-0 invert opacity-90" />
            </div>

            <p className="text-xs text-[#8E8EA0] leading-relaxed font-medium max-w-sm mt-4">
              {language === 'en'
                ? 'Your premium technology partner for custom software engineering, AI-driven automation, and scalable digital solutions.'
                : 'Mitra teknologi premium Anda untuk rekayasa perangkat lunak kustom, otomatisasi berbasis AI, dan solusi digital terukur.'}
            </p>

            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00b894] hover:bg-[#00e0b8] active:scale-98 text-[#FFFFFF] text-xs font-bold rounded-full shadow-md transition-all"
              >
                <span>{language === 'en' ? 'Contact Our Team' : 'Hubungi Tim Kami'}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <p className="font-black text-[#FFFFFF] uppercase tracking-wider text-[11px]">{language === 'en' ? 'Case Studies' : 'Studi Kasus'}</p>
              <ul className="space-y-2 text-[#8E8EA0] font-medium">
                <li>
                  <Link href="/demo/klinik-utama-bandung-dental-center" className="hover:text-[#00e0b8] transition-colors">
                    Dental Clinic AI
                  </Link>
                </li>
                <li>
                  <Link href="/demo/vorta-beauty-clinic-bandung" className="hover:text-[#00e0b8] transition-colors">
                    Aesthetic Center
                  </Link>
                </li>
                <li>
                  <Link href="/demo/klinik-utama-dokter-kita" className="hover:text-[#00e0b8] transition-colors">
                    Medical & Labs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-black text-[#FFFFFF] uppercase tracking-wider text-[11px]">{language === 'en' ? 'Navigation' : 'Navigasi'}</p>
              <ul className="space-y-2 text-[#8E8EA0] font-medium">
                <li>
                  <a href="#services" className="hover:text-[#00e0b8] transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#showcase" className="hover:text-[#00e0b8] transition-colors">
                    Showcase
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-[#00e0b8] transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#00e0b8] transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-black text-[#FFFFFF] uppercase tracking-wider text-[11px]">{language === 'en' ? 'Contact & Support' : 'Kontak & Dukungan'}</p>
              <ul className="space-y-2 text-[#8E8EA0] font-medium">
                <li>WhatsApp: +62 896-6807-8854</li>
                <li>Website: growfin.my.id</li>
                <li>Email: hello@growfin.my.id</li>
                <li>{language === 'en' ? 'Hours' : 'Jam Kerja'}: 08:00 - 20:00 (GMT+7)</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#262633] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8E8EA0] font-medium gap-4">
          <p>© {new Date().getFullYear()} Growfin Digital. {language === 'en' ? 'All rights reserved.' : 'Hak cipta dilindungi.'}</p>
          <div className="flex gap-6">
            <span className="hover:text-[#FFFFFF] cursor-pointer">{language === 'en' ? 'Privacy Policy' : 'Kebijakan Privasi'}</span>
            <span className="hover:text-[#FFFFFF] cursor-pointer font-bold text-[#00b894]">Innovation Partner</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

