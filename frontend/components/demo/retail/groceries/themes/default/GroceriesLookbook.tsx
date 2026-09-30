'use client';

export function GroceriesLookbook() {
  return (
    <section id="lookbook" className="bg-zinc-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--theme-color)]">Lifestyle Pairing</span>
          <h2 className="text-3xl font-extrabold text-zinc-900 mt-1">Lookbook: Everyday Moments</h2>
          <p className="text-zinc-600 text-sm mt-2">Inspirasi padu-padan menu instan estetik dan nikmat untuk menemani aktivitas harian Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lookbook 1 */}
          <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200/80">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-200">
              <img src="https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80" alt="Work from Cafe Mood" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold text-[var(--theme-color)] uppercase tracking-wider">01 • Deep Work Session</span>
              <h3 className="font-bold text-lg text-zinc-900 mt-1">Iced Matcha Latte + Strawberry Sando</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">Kombinasi kafein lembut dan manis asam roti lapis buah segar untuk fokus kerja tanpa kantuk berlebih.</p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">Estimasi Kalori: 340 kcal</span>
              </div>
            </div>
          </div>

          {/* Lookbook 2 */}
          <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200/80">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-200">
              <img src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80" alt="Midnight Supper" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold text-[var(--theme-color)] uppercase tracking-wider">02 • Midnight Movie Marathon</span>
              <h3 className="font-bold text-lg text-zinc-900 mt-1">Spicy Miso Ramen Cup + Ajitsuke Tamago</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">Kuah ramen kaya rasa berpadu dengan telur marinasi gurih meleleh. Pas untuk teman nonton series favorit.</p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">Waktu Masak: 3 Menit</span>
              </div>
            </div>
          </div>

          {/* Lookbook 3 */}
          <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm border border-zinc-200/80">
            <div className="aspect-[4/5] overflow-hidden bg-zinc-200">
              <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Morning Recharge" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-5">
              <span className="text-[11px] font-bold text-[var(--theme-color)] uppercase tracking-wider">03 • Morning Commute Fuel</span>
              <h3 className="font-bold text-lg text-zinc-900 mt-1">Tokyo Chicken Bento + Calamansi Sparkler</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">Nasi jepang pulen, karage renyah dengan salad segar. Tetap bertenaga mengawali hari yang padat.</p>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800">Disajikan: Hangat Segar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
