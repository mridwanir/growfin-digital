'use client';

import { useElectronicDemo } from '../../core/ElectronicContext';

export function ElectronicReviews() {
  const { client } = useElectronicDemo();
  const reviews = client.reviews?.length > 0 ? client.reviews : [
    { rating: 5, text: "Material finishing headphone-nya sangat berkelas, bantalan telinganya nyaman dipakai 8 jam non-stop saat editing video. Pengiriman kurir instan sampai tepat waktu.", authorName: "Aris Ramadhan", time: "Product Designer • Jakarta" },
    { rating: 5, text: "Paling suka dengan proses order via WhatsApp-nya. Tidak perlu isi formulir akun berbelit, tinggal pilih barang, isi alamat pengiriman, dan admin langsung memproses resi.", authorName: "Sherly Levina", time: "Software Engineer • Bandung" },
    { rating: 5, text: "Packaging sangat rapi dengan lapisan kardus ganda dan segel resmi. Garansi langsung otomatis terdaftar begitu dicek lewat serial number.", authorName: "M. Taufiq", time: "Arsitek • Surabaya" }
  ];

  return (
    <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--theme-color)' }}>Testimoni Nyata</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 mt-1">Dipercaya Kreator & Profesional</h2>
        <p className="text-xs sm:text-sm text-zinc-500 mt-2">
          Tingkat kepuasan 99.4% terhadap kualitas barang, garansi resmi distributor, dan proteksi kemasan kayu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map((r: any, i: number) => (
          <div key={i} className="bg-white p-7 rounded-2xl border border-zinc-200 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex gap-1 mb-4" style={{ color: 'var(--theme-color)' }}>
                {[...Array(r.rating || 5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                "{r.text || r.content}"
              </p>
            </div>
            <div className="pt-6 border-t border-zinc-100 mt-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-800 uppercase">
                {(r.authorName || r.author || r.name || 'US').substring(0, 2)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-950">{r.authorName || r.author || r.name || 'User'}</h4>
                <p className="text-[11px] text-zinc-400">{r.time || 'Verified Buyer'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
