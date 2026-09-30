import { useFnbDemo } from '../../../core/FnbDemoContext';
import { CakeSlice, Globe, Mail, MessageCircle } from 'lucide-react';

export function BakeryFooter() {
  const { client } = useFnbDemo();

  return (
    <footer className="bg-stone-900 text-stone-200 py-14 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-brand-primary">
                <CakeSlice className="w-5 h-5" />
              </span>
              <span className="font-serif-title text-2xl font-bold tracking-tight text-white">{client.name}</span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm">
              {client.tagline || 'Menghadirkan seni hidangan penutup klasik Prancis dan pastry modern dengan bahan berkualitas dari penjuru dunia.'}
            </p>
            <div className="flex gap-4 text-brand-primary pt-2">
              <a href="#" className="hover:text-white transition"><Globe className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition"><Mail className="w-5 h-5" /></a>
              <a href={`https://wa.me/${client.phone}`} className="hover:text-white transition"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Jam Operasional Dapur</h4>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>Senin - Minggu: {client.hours || '07.30 - 20.00 WIB'}</li>
              <li className="pt-2 text-white font-semibold">Pengiriman Kue: 09.00 - 18.00 WIB</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Lokasi Dapur Utama</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              {client.address || 'Jl. Senopati Raya No. 44B, Kebayoran Baru, Jakarta Selatan. 12190'}
            </p>
            <p className="text-xs text-stone-400 mt-3">
              Hotline: <strong className="text-white">+{client.phone || '62 812-3456-7890'}</strong>
            </p>
          </div>
        </div>

        <div className="pt-10 mt-10 border-t border-stone-800 text-center text-xs text-stone-500">
          &copy; {new Date().getFullYear()} {client.name}. All rights reserved. E-Commerce Checkout Experience.
        </div>
      </div>
    </footer>
  );
}
