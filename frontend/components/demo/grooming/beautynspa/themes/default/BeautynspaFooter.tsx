import { Scissors } from 'lucide-react';
import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext';

export function BeautynspaFooter() {
  const { client } = useGroomingDemo();

  return (
    <footer className="bg-black/80 text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <a href="#" className="text-2xl font-serif font-bold text-white flex items-center gap-2 mb-4">
            <span className="text-brand-primary"><Scissors className="w-6 h-6" /></span>
            {client.name}
          </a>
          <p className="text-gray-400 max-w-sm mb-6">Membawa seni dalam perawatan diri. Kami hadir untuk menyempurnakan penampilan dan menenangkan pikiran Anda.</p>
          <div className="flex space-x-4">
            <a href={(client as any).instagramUrl || '#'} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition">IG</a>
            <a href={(client as any).tiktokUrl || '#'} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition">TT</a>
            <a href={`https://wa.me/${client.waNumber}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition">WA</a>
          </div>
        </div>
        <div>
          <h4 className="font-serif font-semibold text-lg mb-4">Tautan Cepat</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#layanan" className="hover:text-brand-primary transition">Layanan & Harga</a></li>
            <li><a href="#stylist" className="hover:text-brand-primary transition">Tim Artisan Kami</a></li>
            <li><a href="#lookbook" className="hover:text-brand-primary transition">Galeri Portofolio</a></li>
            <li><a href="#ulasan" className="hover:text-brand-primary transition">Ulasan Pelanggan</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif font-semibold text-lg mb-4">Informasi</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex flex-col gap-1"><span className="text-white font-medium">Operasional</span> <span>{client.hours}</span></li>
            <li className="flex flex-col gap-1 mt-3"><span className="text-white font-medium">Lokasi</span> <span>{client.address}</span></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-6 max-w-7xl mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} {client.name}. All rights reserved.
      </div>
    </footer>
  );
}
