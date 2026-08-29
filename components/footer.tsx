import Link from 'next/link';

export function Footer() {
  const waUrl = "https://wa.me/6289668078854?text=Halo%20Growfin,%20saya%20tertarik%20konsultasi%20pembuatan%20website%20demo%20klinik";

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-xl shadow-md">
                G
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Growfin<span className="text-blue-500">.my.id</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-sm">
              Mitra pertumbuhan digital untuk klinik lokal (Dental, Aesthetic, Medical) yang mengubah traffic Google Maps menjadi reservasi pasien WhatsApp yang siap berobat.
            </p>

            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold rounded-full shadow-md shadow-emerald-600/20 transition-all"
              >
                <span>Hubungi Tim Growfin 💬</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div className="space-y-3">
              <p className="font-black text-slate-200 uppercase tracking-wider text-[11px]">Demo Klinik</p>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <Link href="/demo/klinik-utama-bandung-dental-center" className="hover:text-blue-400 transition-colors">
                    Klinik Dokter Gigi
                  </Link>
                </li>
                <li>
                  <Link href="/demo/vorta-beauty-clinic-bandung" className="hover:text-blue-400 transition-colors">
                    Klinik Kecantikan & Estetika
                  </Link>
                </li>
                <li>
                  <Link href="/demo/klinik-utama-dokter-kita" className="hover:text-blue-400 transition-colors">
                    Klinik Pratama & Cek Lab
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-black text-slate-200 uppercase tracking-wider text-[11px]">Navigasi</p>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>
                  <a href="#fitur" className="hover:text-blue-400 transition-colors">
                    Fitur Unggulan
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-blue-400 transition-colors">
                    Showcase Demo
                  </a>
                </li>
                <li>
                  <a href="#harga" className="hover:text-blue-400 transition-colors">
                    Paket Harga
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-blue-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-black text-slate-200 uppercase tracking-wider text-[11px]">Kontak & Support</p>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li>WhatsApp: +62 896-6807-8854</li>
                <li>Website: growfin.my.id</li>
                <li>Email: support@growfin.my.id</li>
                <li>Jam Kerja: 08:00 - 20:00 WIB</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© {new Date().getFullYear()} Growfin (growfin.my.id). All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer font-bold text-blue-500">Healthcare Partner</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
