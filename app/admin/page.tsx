import Link from 'next/link';
import { getAllClinicsFromDB } from '@/lib/supabase/queries';

export const revalidate = 0; // Always dynamic for Admin Dashboard

export default async function AdminDashboardPage() {
  const clinics = await getAllClinicsFromDB();

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-sm">
                G
              </span>
              <span className="text-xl font-black text-white tracking-tight">Growfin Admin</span>
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                CMS Panel
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Manajemen Mitra Klinik</h1>
            <p className="text-xs text-slate-400 mt-1">
              Kelola data klinik, informasi dokter, katalog treatment, dan rute demo interaktif.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/clinics/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-blue-600/30 transition-all"
            >
              <span>+ Tambah Klinik Baru</span>
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold rounded-2xl transition-all"
            >
              <span>Lihat Landing Page ↗</span>
            </Link>
          </div>
        </div>

        {/* SQL Schema Notice */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs space-y-1">
          <p className="font-bold text-blue-400">💡 Supabase Database Connected / Fallback Ready</p>
          <p className="text-slate-300">
            Klinik yang didaftarkan melalui form admin otomatis mengaktifkan rute <code className="bg-slate-900 px-2 py-0.5 rounded text-blue-300">/demo/[slug]</code> dan langsung ter-revalidate secara real-time.
          </p>
        </div>

        {/* Clinics Table / Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Daftar Mitra Klinik ({clinics.length})</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clinics.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-3xl bg-slate-900 p-5 border border-slate-800 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                      {item.city}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      ⭐ {item.rating}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug">{item.name}</h3>
                  <p className="text-xs text-slate-400">{item.category}</p>
                  <p className="text-[11px] text-slate-500 font-mono">Slug: {item.slug}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={`/demo/${item.slug}`}
                    target="_blank"
                    className="text-blue-400 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Preview Demo</span>
                    <span>↗</span>
                  </Link>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
