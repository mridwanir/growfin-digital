'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const waUrl = "https://wa.me/6289630352370?text=Halo%20MeracikWeb,%20saya%20tertarik%20untuk%20berkonsultasi%20pembuatan%20website.";

  return (
    <footer className="bg-deep-navy text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 group cursor-pointer py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded-lg"
            >
              <Image
                src="/meracikweb-icon.png"
                alt="MeracikWeb Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-extrabold text-xl tracking-tight">
                <span className="text-white">Meracik</span>
                <span className="text-sky-cyan italic">Web</span>
              </span>
            </Link>

            <p className="text-sm text-soft-gray text-pretty">
              Racik Website Cepat Sesuai Gayamu.
            </p>

            <p className="text-xs text-soft-gray/70 leading-relaxed max-w-sm text-pretty">
              Platform solusi website cepat, fleksibel, dan siap pakai untuk UMKM, bisnis, dan personal brand.
            </p>

            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center min-h-[44px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg px-6 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2"
              >
                Hubungi Tim Kami
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Studi Kasus</h3>
              <ul className="space-y-2 text-soft-gray/70 font-medium">
                <li>
                  <Link
                    href="/demo/klinik-utama-bandung-dental-center"
                    className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
                  >
                    Dental Clinic
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo/vorta-beauty-clinic-bandung"
                    className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
                  >
                    Aesthetic Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo/klinik-utama-dokter-kita"
                    className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
                  >
                    Medical & Labs
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi</h3>
              <ul className="space-y-2 text-soft-gray/70 font-medium">
                <li>
                  <a
                    href="#layanan"
                    className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
                  >
                    Fitur
                  </a>
                </li>
                <li>
                  <a
                    href="#portofolio"
                    className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
                  >
                    Template
                  </a>
                </li>
                <li>
                  <a
                    href="#harga"
                    className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
                  >
                    Paket
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Kontak</h3>
              <ul className="space-y-2 text-soft-gray/70 font-medium">
                <li>WA: +62 896-3035-2370</li>
                <li>Web: meracikweb.id</li>
                <li>Email: contact@meracikweb.id</li>
                <li>Operasional: 08:00 - 20:00 WIB</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-soft-gray/70 font-medium gap-4">
          <p>© {new Date().getFullYear()} MeracikWeb. Hak Cipta Dilindungi.</p>
          <div>
            <Link
              href="#"
              className="inline-block py-1 hover:text-sky-cyan transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 rounded"
            >
              Kebijakan Privasi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
