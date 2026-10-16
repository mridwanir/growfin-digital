'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface AccessDeniedScreenProps {
  email?: string | null;
}

export function AccessDeniedScreen({ email }: AccessDeniedScreenProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-lg bg-[#14141A] border border-[#262633] rounded-3xl p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold tracking-wider uppercase mb-3 inline-block">
          403 • Super Admin Only
        </span>

        <h1 className="text-2xl font-black text-white mt-1 mb-2">
          Akses Ditolak
        </h1>

        <p className="text-[#8E8EA0] text-sm mb-6 leading-relaxed">
          Akun <span className="font-semibold text-white underline underline-offset-4">{email || 'Anda'}</span> tidak terdaftar dalam daftar otorisasi Super Admin (<code className="text-xs bg-[#262633] px-1.5 py-0.5 rounded text-amber-300">ADMIN_EMAILS</code>).
        </p>

        <div className="bg-[#0B0B0E] border border-[#262633] rounded-xl p-4 text-xs text-left text-[#8E8EA0] mb-8 space-y-1">
          <p className="font-bold text-white mb-1">Informasi Pengembang / Admin:</p>
          <p>• Tambahkan email Anda ke environment variable <code className="text-white">ADMIN_EMAILS</code> di file <code className="text-white">.env.local</code> atau dashboard hosting.</p>
          <p>• Contoh: <code className="text-emerald-400">ADMIN_EMAILS=admin@growfin.id,owner@growfin.id</code></p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="flex-1 py-3 px-5 bg-white hover:bg-gray-200 text-[#14141A] font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Ke Dashboard User
          </Link>

          <button
            onClick={handleLogout}
            className="py-3 px-5 border border-[#262633] hover:bg-[#262633] text-[#8E8EA0] hover:text-white font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
