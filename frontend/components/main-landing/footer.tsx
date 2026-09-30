'use client';
import Link from 'next/link';

export function Footer() {
  const waUrl = "https://wa.me/6289668078854?text=Halo%20Growfin,%20saya%20tertarik%20untuk%20berkonsultasi%20pembuatan%20website.";

  return (
    <footer className="bg-white text-slate-800 pt-16 pb-12 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

        <div className="grid gap-8 lg:grid-cols-12">

          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-2 group cursor-pointer">
              <img src="/image/landing/growfin-logo-icon.png" alt="Growfin Logo" className="w-10 h-10 object-contain" />
              <span className="text-dark font-extrabold tracking-tight text-2xl">Growfin</span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm mt-4">
              Mitra teknologi andalan Anda untuk sistem rekayasa kustom, otomatisasi proses bisnis, dan website UMKM profesional.
            </p>

            <div className="pt-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold rounded-full transition-all">
                <span>Hubungi Tim Kami</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <p className="font-extrabold text-dark uppercase tracking-wider text-[11px]">Studi Kasus</p>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><Link href="/demo/klinik-utama-bandung-dental-center" className="hover:text-emerald transition-colors">Dental Clinic</Link></li>
                <li><Link href="/demo/vorta-beauty-clinic-bandung" className="hover:text-emerald transition-colors">Aesthetic Center</Link></li>
                <li><Link href="/demo/klinik-utama-dokter-kita" className="hover:text-emerald transition-colors">Medical & Labs</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-extrabold text-dark uppercase tracking-wider text-[11px]">Navigasi</p>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li><a href="#layanan" className="hover:text-emerald transition-colors">Layanan</a></li>
                <li><a href="#portofolio" className="hover:text-emerald transition-colors">Portofolio</a></li>
                <li><a href="#harga" className="hover:text-emerald transition-colors">Harga</a></li>
                <li><a href="#faq" className="hover:text-emerald transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-extrabold text-dark uppercase tracking-wider text-[11px]">Kontak</p>
              <ul className="space-y-2 text-slate-500 font-medium">
                <li>WA: +62 896-6807-8854</li>
                <li>Web: growfin.my.id</li>
                <li>Email: growfin.id@gmail.com</li>
                <li>Operasional: 08:00 - 20:00 WIB</li>
              </ul>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-4">
          <p>© {new Date().getFullYear()} Growfin Digital. Hak Cipta Dilindungi.</p>
          <div className="flex gap-6">
            <span className="hover:text-emerald cursor-pointer transition-colors">Kebijakan Privasi</span>
            <span className="hover:text-emerald cursor-pointer font-bold text-emerald transition-colors">Innovation Partner</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
