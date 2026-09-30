'use client';

import { useGroceriesDemo } from '../../core/GroceriesContext';

export function ArtisanFooter() {
  const { client } = useGroceriesDemo();
  return (
    <footer className="border-t border-zinc-200 bg-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} {client.name}. Hak cipta dilindungi.</p>
        <div className="flex gap-6">
          <a href="#katalog" className="hover:text-zinc-800">Katalog</a>
          <a href="#lookbook" className="hover:text-zinc-800">Lookbook</a>
          <a href="#testimoni" className="hover:text-zinc-800">Testimoni</a>
        </div>
      </div>
    </footer>
  );
}
