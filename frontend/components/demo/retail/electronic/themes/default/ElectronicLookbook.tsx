'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicLookbook() {
  const { client } = useElectronicDemo();
  
  const product1 = client.menu?.[0] || { category: 'Accessories', name: 'Aether Studio Pro ANC' };
  const product2 = client.menu?.[1] || { category: 'Accessories', name: 'Aether Mech 75 Low-Profile' };
  const product3 = client.menu?.[2] || { category: 'Accessories', name: 'Aether Chrono GPS Ultra' };

  return (
    <section id="lookbook" className="bg-zinc-100/70 border-y border-zinc-200 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-xl mb-12">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest" style={{ color: 'var(--theme-color)' }}>Inspirasi Tata Ruang</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">Eksplorasi Setup & Sinergi Alat</h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2">
            Desain ruang cerdas, hening, dan elegan bersama {client.name}.
          </p>
        </div>

        {/* Workspace Hero with Interactive Pins */}
        <div className="relative rounded-3xl overflow-hidden border border-zinc-200 shadow-sm bg-white">
          <img 
            src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=1600&auto=format&fit=crop" 
            alt="Clean Minimalist Desk Setup" 
            className="w-full h-[480px] sm:h-[580px] object-cover"
          />

          <div className="absolute top-[28%] left-[22%] sm:left-[24%] group">
            <button className="w-9 h-9 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform border border-zinc-200 cursor-pointer">
              01
            </button>
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xl hidden group-hover:block w-48 text-left z-20">
              <p className="text-[10px] uppercase font-bold text-zinc-400">{product1.category || 'Elektronik'}</p>
              <p className="text-xs font-bold text-zinc-950 truncate">{product1.name}</p>
            </div>
          </div>

          <div className="absolute top-[65%] left-[45%] sm:left-[48%] group">
            <button className="w-9 h-9 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform border border-zinc-200 cursor-pointer">
              02
            </button>
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xl hidden group-hover:block w-48 text-left z-20">
              <p className="text-[10px] uppercase font-bold text-zinc-400">{product2.category || 'Elektronik'}</p>
              <p className="text-xs font-bold text-zinc-950 truncate">{product2.name}</p>
            </div>
          </div>

          <div className="absolute top-[52%] right-[18%] sm:right-[22%] group">
            <button className="w-9 h-9 rounded-full bg-white text-zinc-950 shadow-xl flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform border border-zinc-200 cursor-pointer">
              03
            </button>
            <div className="absolute bottom-11 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xl hidden group-hover:block w-48 text-left z-20">
              <p className="text-[10px] uppercase font-bold text-zinc-400">{product3.category || 'Elektronik'}</p>
              <p className="text-xs font-bold text-zinc-950 truncate">{product3.name}</p>
            </div>
          </div>

          {/* Bottom overlay tag */}
          <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-white/90 backdrop-blur-sm px-5 py-3 rounded-2xl border border-zinc-200/80 text-xs text-zinc-600 shadow-sm">
            <strong>Workstation Pilihan:</strong> Dirancang hening, lapang, dan minim kabel untuk fokus optimal.
          </div>
        </div>

      </div>
    </section>
  );
}
