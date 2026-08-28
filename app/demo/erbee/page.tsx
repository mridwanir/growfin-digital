import { notFound } from 'next/navigation';
import { demosData } from '@/lib/demos';
import type { Metadata } from 'next';

const client = demosData.erbee;

export const metadata: Metadata = {
  title: `${client?.name ?? 'Demo'} — Interactive Digital Menu Preview`,
  description: client
    ? `Official digital demo and WhatsApp ordering simulation for ${client.name}.`
    : 'Demo not found.',
};

export default function DemoPage() {
  if (!client) {
    notFound();
  }

  const getWaUrl = (itemName: string) => {
    const message = `Halo ${client.name}, saya ingin order: *${itemName}*. Apakah ready untuk dine-in / takeaway?`;
    return `https://wa.me/${client.waNumber}?text=${encodeURIComponent(message)}`;
  };

  const generalWaUrl = `https://wa.me/${client.waNumber}?text=${encodeURIComponent(
    `Halo ${client.name}, saya ingin tanya informasi menu dan reservasi tempat.`
  )}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-28 selection:bg-amber-500 selection:text-black">
      <header className="px-6 pt-10 pb-8 text-center bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-950 border-b border-neutral-800/80">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 mb-3 text-xs font-semibold tracking-wide text-amber-400 bg-amber-950/70 rounded-full border border-amber-800/50 shadow-sm">
          <span>⭐ {client.rating.toFixed(1)} on Google Maps ({client.reviewCount}+ Reviews)</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">{client.name}</h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
          {client.tagline}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-4 text-[11px] text-neutral-300">
          <span className="bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            🕒 {client.hours}
          </span>
          <span className="bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            📍 {client.address}
          </span>
          <span className="bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
            ⚡ Dine-in & Takeaway
          </span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-neutral-200 uppercase tracking-wider">Katalog Menu</h2>
          <span className="text-xs text-amber-400 font-medium">Klik Pesan via WA 💬</span>
        </div>

        <div className="space-y-3">
          {client.menu.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-neutral-900/90 rounded-2xl border border-neutral-800 hover:border-amber-700/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="font-semibold text-white text-sm sm:text-base leading-snug">
                    {item.name}
                  </h3>
                  {item.tag && (
                    <span className="text-[10px] bg-amber-500/15 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mb-3 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-neutral-800/80">
                <span className="font-bold text-amber-400 text-sm">Rp {item.price}</span>
                <a
                  href={getWaUrl(item.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition active:scale-95"
                >
                  Pesan via WA ➔
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-neutral-900/40 rounded-xl border border-dashed border-neutral-800 text-center">
          <p className="text-xs text-neutral-400 leading-relaxed">
            💡 <strong className="text-neutral-200">Interactive Preview Mode</strong>
            <br />
            Simulasi pemesanan digital khusus untuk {client.name}.
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-neutral-950/90 backdrop-blur-md border-t border-neutral-800/80 z-50">
        <div className="max-w-md mx-auto">
          <a
            href={generalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg transition active:scale-98"
          >
            <span>💬 Hubungi & Order via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}