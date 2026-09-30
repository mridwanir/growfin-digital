'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicDarkLookbook() {
  const { client } = useElectronicDemo();
  
  const product1 = client.menu?.[0] || { category: 'Accessories', name: 'Aether Studio Pro ANC' };
  const product2 = client.menu?.[1] || { category: 'Accessories', name: 'Aether Mech 75 Low-Profile' };
  const product3 = client.menu?.[2] || { category: 'Accessories', name: 'Aether Chrono GPS Ultra' };

  return (
    <section id="lookbook" className="py-20 bg-slate-900/50 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--theme-color)' }}>Curated Ecosystems</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Inspirasi Setup & Gaya Pemakaian</h2>
          <p className="text-slate-400 text-sm mt-2">
            Kombinasi harmonis perlengkapan kerja dan kreasi digital untuk produktivitas tanpa kompromi bersama {client.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lookbook 1 */}
          <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?q=80&w=800&auto=format&fit=crop" 
                alt="Desk Setup Minimalist" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent absolute bottom-0 inset-x-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-color)' }}>The Minimalist Coder</span>
              <h3 className="text-lg font-bold text-white mt-1">Ergonomic Workflow Pack</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                Menampilkan {product1.name} untuk setup meja minimalis Anda.
              </p>
              <button className="w-full py-2.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800">
                Lihat Item Setup <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Lookbook 2 */}
          <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop" 
                alt="Audiophile Studio Setup" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent absolute bottom-0 inset-x-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-color)' }}>Studio Master</span>
              <h3 className="text-lg font-bold text-white mt-1">Audiophile Sound Station</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                Menampilkan {product2.name} untuk monitoring akustik presisi tinggi.
              </p>
              <button className="w-full py-2.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800">
                Lihat Item Setup <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>

          {/* Lookbook 3 */}
          <div className="group relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800&auto=format&fit=crop" 
                alt="Nomad Content Creator" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
            </div>
            <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent absolute bottom-0 inset-x-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-color)' }}>Mobile Creator</span>
              <h3 className="text-lg font-bold text-white mt-1">On-The-Go Production Kit</h3>
              <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                Menampilkan {product3.name} untuk render di mana saja tanpa hambatan.
              </p>
              <button className="w-full py-2.5 rounded-lg bg-slate-900/90 text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800">
                Lihat Item Setup <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
