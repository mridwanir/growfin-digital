import { Scissors } from 'lucide-react'

import { useGroomingDemo } from '@/components/demo/grooming/core/GroomingDemoContext'

export function BeautynspaFooter() {
  const { client } = useGroomingDemo()

  return (
    <footer className="border-t border-gray-800 bg-black/80 py-12 text-white">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <a
            href="#"
            className="mb-4 flex items-center gap-2 font-serif text-2xl font-bold text-white"
          >
            <span className="text-brand-primary">
              <Scissors className="h-6 w-6" />
            </span>
            {client.name}
          </a>
          <p className="mb-6 max-w-sm text-gray-400">
            Membawa seni dalam perawatan diri. Kami hadir untuk menyempurnakan penampilan dan
            menenangkan pikiran Anda.
          </p>
          <div className="flex space-x-4">
            <a
              href={(client as any).instagramUrl || '#'}
              className="hover:bg-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition"
            >
              IG
            </a>
            <a
              href={(client as any).tiktokUrl || '#'}
              className="hover:bg-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition"
            >
              TT
            </a>
            <a
              href={`https://wa.me/${client.waNumber}`}
              className="hover:bg-brand-primary flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition"
            >
              WA
            </a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-serif text-lg font-semibold">Tautan Cepat</h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#layanan" className="hover:text-brand-primary transition">
                Layanan & Harga
              </a>
            </li>
            <li>
              <a href="#stylist" className="hover:text-brand-primary transition">
                Tim Artisan Kami
              </a>
            </li>
            <li>
              <a href="#lookbook" className="hover:text-brand-primary transition">
                Galeri Portofolio
              </a>
            </li>
            <li>
              <a href="#ulasan" className="hover:text-brand-primary transition">
                Ulasan Pelanggan
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-serif text-lg font-semibold">Informasi</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex flex-col gap-1">
              <span className="font-medium text-white">Operasional</span>{' '}
              <span>{client.hours}</span>
            </li>
            <li className="mt-3 flex flex-col gap-1">
              <span className="font-medium text-white">Lokasi</span> <span>{client.address}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto mt-12 max-w-7xl border-t border-gray-800 px-6 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {client.name}. All rights reserved.
      </div>
    </footer>
  )
}
